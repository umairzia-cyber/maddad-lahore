"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  requestOtp, verifyOtp, logout, requireUser, requireActive, requireWorker, requireAdmin, loginAsDemoUser,
} from "@/lib/auth";
import { AppError } from "@/lib/state";
import { DEMO_ACCOUNTS, demoAccountsEnabled } from "@/lib/config";
import { normalizePkPhone, maskSensitiveContact } from "@/lib/phone";
import { reportError } from "@/lib/logger";
import { createDraft, publishJob, cancelJob, createAndPublishJob } from "@/lib/jobs";
import { submitBid, withdrawBid, acceptBid, listBidsForCustomer, BidCard } from "@/lib/bids";
import { progress, reportProblem, Action } from "@/lib/bookings";
import { submitReview, createReport } from "@/lib/reviews";
import {
  saveWorkerProfile, addWorkerPhoto, removeWorkerPhoto, submitIdentity, updateNotificationPrefs,
  updateDisplayName, submitAppeal, deleteAccount,
} from "@/lib/account";
import { moderate, addReportNote, closeAppeal, decideIdentity, updateSettings, adminExpandJob } from "@/lib/admin";
import { q, one, isPostgresAvailable } from "@/lib/db";
import { store } from "@/lib/store";
import { collectSignup, collectJobLead, collectBidActivity } from "@/lib/supabase";

export type FormState = { error?: string; ok?: string; devCode?: string; phone?: string; jobId?: string; next?: string } | null;

/** Converts expected AppErrors to form messages; lets Next redirect/notFound signals through. */
async function wrap(fn: () => Promise<FormState | void>): Promise<FormState> {
  try {
    return (await fn()) ?? null;
  } catch (e) {
    if (e instanceof AppError) return { error: e.message };
    const digest = (e as { digest?: string })?.digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_")) throw e;
    reportError(e, { where: "server_action" });
    return { error: "Something went wrong. Please try again." };
  }
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "");

// ---------- auth ----------
export async function requestOtpAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const channel = (str(f, "channel") || "whatsapp") as "whatsapp" | "sms";
    const r = await requestOtp(str(f, "phone"), channel);
    return {
      phone: r.phone,
      devCode: r.devCode,
      channel: r.channel,
      ok: r.channel === "whatsapp" ? "Verification code sent to your WhatsApp." : "Verification code sent via SMS.",
    };
  });
}

export async function signUpAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const name = str(f, "name").trim();
    const phone = str(f, "phone").trim();
    const channel = (str(f, "channel") || "whatsapp") as "whatsapp" | "sms";

    if (!name || name.length < 2) {
      throw new AppError("Please enter your real full name.");
    }
    if (!phone) {
      throw new AppError("Please enter your Pakistani mobile number.");
    }

    const r = await requestOtp(phone, channel);

    return {
      phone: r.phone,
      devCode: r.devCode,
      channel: r.channel,
      ok: r.channel === "whatsapp" ? "Verification code sent to your WhatsApp." : "Verification code sent to your mobile.",
    };
  });
}

export async function verifyOtpAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const phone = str(f, "phone");
    await verifyOtp(phone, str(f, "code"));

    // If registration metadata was provided, initialize user profile honestly
    const name = str(f, "name").trim();
    const role = str(f, "role").trim() === "worker" ? "technician" : "customer";
    const trade = str(f, "trade").trim();
    const area = str(f, "area").trim();

    if (name) {
      try {
        const u = await requireUser();
        await updateDisplayName(u, name);
        if (str(f, "role") === "worker") {
          const profileFd = new FormData();
          profileFd.set("bio", `${name} · Independent Technician in Lahore`);
          // Honest onboarding: do not inject fake 3-years experience claim
          profileFd.set("accepting_bids", "on");
          if (trade === "electrical") {
            profileFd.append("categories", "2");
          } else if (trade === "both") {
            profileFd.append("categories", "1");
            profileFd.append("categories", "2");
          } else {
            profileFd.append("categories", "1");
          }
          await saveWorkerProfile(u, profileFd);
        }

        // Collect signup lead only AFTER verified OTP authentication
        await collectSignup({ name, phone, role, trade, area });
      } catch {
        // Non-blocking
      }
    }

    revalidatePath("/", "layout");
    const nextUrl = str(f, "next").trim();
    const safeNext = nextUrl.startsWith("/") && !nextUrl.startsWith("//") ? nextUrl : null;
    if (str(f, "native_form") === "1") {
      redirect(safeNext || "/");
    }
    return { ok: "Signed in successfully.", next: safeNext || undefined };
  });
}
export async function switchDemoUserAction(phone: string): Promise<FormState> {
  return wrap(async () => {
    const normalized = normalizePkPhone(String(phone ?? ""));
    const allowed = DEMO_ACCOUNTS.some((d) => normalizePkPhone(d.phone) === normalized);
    if (!demoAccountsEnabled() || !normalized || !allowed) {
      throw new AppError("Demo sign-in isn't available.", "forbidden");
    }
    await loginAsDemoUser(phone);
    revalidatePath("/", "layout");
    return { ok: "Demo session active." };
  });
}
export async function logoutAction() {
  await logout();
  revalidatePath("/", "layout");
  redirect("/");
}

// ---------- account ----------
export async function saveNameAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireUser();
    await updateDisplayName(u, str(f, "displayName"));
    revalidatePath("/", "layout");
    if (f.get("setup")) redirect("/dashboard");
    return { ok: "Saved." };
  });
}
export async function prefsAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    await updateNotificationPrefs(await requireUser(), f.get("in_app") === "on");
    return { ok: "Saved." };
  });
}
export async function appealAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    await submitAppeal(await requireUser(), str(f, "message"));
    return { ok: "Your appeal was sent. A moderator will review it." };
  });
}
export async function deleteAccountAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireUser();
    if (str(f, "confirm") !== "DELETE") throw new AppError("Type DELETE to confirm.");
    const r = await deleteAccount(u);
    if (!r.ok) return { error: r.message };
    redirect("/?deleted=1");
  });
}

// ---------- jobs ----------
export async function createJobAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireActive();
    const id = await createDraft(u, f);
    redirect(`/jobs/${id}/preview`);
  });
}
export async function publishJobAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireActive();
    await publishJob(u, str(f, "jobId"));
    redirect(`/jobs/${str(f, "jobId")}`);
  });
}
export async function createAndPublishJobAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireActive();
    const id = await createAndPublishJob(u, f);
    try {
      const priceVal = Number(f.get("price")) || Number(f.get("budgetMin")) || null;
      await collectJobLead({
        title: str(f, "title"),
        description: str(f, "description"),
        category: str(f, "categoryName") || (str(f, "categoryId") === "2" ? "Electrical" : "Plumbing"),
        area: str(f, "areaId"),
        budgetMin: Number(f.get("budgetMin")) || priceVal,
        budgetMax: Number(f.get("budgetMax")) || priceVal,
        customerPhone: u.phone,
        // PRIVACY GUARANTEE: Never leak customer exact street/house address to third-party lead storage
        addressText: str(f, "landmark") ? `Near ${str(f, "landmark")}` : "Coarse Area Centroid Only",
      });
    } catch {
      // Non-blocking
    }
    revalidatePath("/", "layout");
    return { ok: "Listing posted and published successfully to Lahore marketplace!", jobId: id };
  });
}

export async function submitInquiryAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const jobId = str(f, "jobId");
    const message = str(f, "message").trim();
    const offerPrice = f.get("offerPrice") ? Number(f.get("offerPrice")) : null;
    const phoneInput = str(f, "phone").trim();

    if (!jobId) throw new AppError("Listing is required.");
    if (!message || message.length < 3) throw new AppError("Please write a message of at least 3 characters.");

    const u = await requireUser().catch(() => null);
    const senderPhone = u?.phone || (phoneInput ? normalizePkPhone(phoneInput) : null);
    if (!senderPhone) throw new AppError("Please provide a valid Pakistani mobile number.");

    if (await isPostgresAvailable()) {
      await q(
        `INSERT INTO listing_inquiries (listing_id, sender_id, sender_phone, message, offer_amount, inquiry_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [jobId, u?.id || null, senderPhone, message, offerPrice, offerPrice ? "offer" : "question"]
      );
      const [job] = await q<{ customer_id: string; title: string }>(`SELECT customer_id, title FROM jobs WHERE id=$1`, [jobId]);
      if (job) {
        await q(
          `INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id) VALUES ($1, 'inquiry_received', 'New Inquiry on your listing', $2, 'job', $3)`,
          [job.customer_id, `Someone inquired: "${message.slice(0, 80)}"`, jobId]
        );
      }
    }
    revalidatePath("/", "layout");
    return { ok: "Your inquiry has been sent to the poster!" };
  });
}

export type ChatMessageDto = {
  id: string;
  job_id: string;
  sender_id: string;
  sender_role: "customer" | "worker";
  sender_name: string;
  message: string;
  created_at: string;
};



export async function getJobMessagesAction(jobId: string): Promise<ChatMessageDto[]> {
  const u = await requireUser().catch(() => null);
  if (!u) return [];

  const isPg = await isPostgresAvailable();
  if (!isPg) {
    const list = store.getJobMessages(jobId);
    return list.map((m) => ({
      ...m,
      created_at: m.created_at.toISOString(),
    }));
  }

  try {
    const job = await one<{ customer_id: string }>("SELECT customer_id FROM jobs WHERE id=$1", [jobId]);
    if (!job) return [];

    // Authorization guard: only customer, bidding/contacting workers, or admins can read job chat
    const isCustomer = job.customer_id === u.id;
    const isBidder = (await one("SELECT 1 FROM bids WHERE job_id=$1 AND worker_id=$2", [jobId, u.id])) !== null;
    if (!isCustomer && !isBidder && !u.is_admin) {
      return [];
    }

    const rows = await q<{
      id: string;
      listing_id: string;
      sender_id: string | null;
      message: string;
      created_at: Date;
      display_name: string | null;
      is_worker: boolean | null;
    }>(
      `SELECT i.id, i.listing_id, i.sender_id, i.message, i.created_at,
              u.display_name, u.is_worker
       FROM listing_inquiries i
       LEFT JOIN users u ON u.id = i.sender_id
       WHERE i.listing_id=$1
       ORDER BY i.created_at ASC`,
      [jobId]
    );

    if (rows && rows.length > 0) {
      return rows.map((r) => {
        const isCust = r.sender_id === job.customer_id;
        return {
          id: r.id,
          job_id: r.listing_id,
          sender_id: r.sender_id || "guest",
          sender_role: isCust ? "customer" : "worker",
          sender_name: r.display_name || (isCust ? "Customer" : "Verified Technician"),
          message: r.message,
          created_at: new Date(r.created_at).toISOString(),
        };
      });
    }
  } catch {
    // fallback to store
  }

  const list = store.getJobMessages(jobId);
  return list.map((m) => ({
    ...m,
    created_at: m.created_at.toISOString(),
  }));
}

export async function sendJobMessageAction(
  jobId: string,
  messageText: string
): Promise<{ ok?: boolean; error?: string; message?: ChatMessageDto }> {
  try {
    const rawClean = (messageText || "").trim();
    if (!rawClean || rawClean.length < 2) return { error: "Message must be at least 2 characters." };

    const u = await requireActive();
    // Server-side contact masking: enforces platform trust policy
    const clean = maskSensitiveContact(rawClean);

    const isPg = await isPostgresAvailable();
    if (isPg) {
      const job = await one<{ customer_id: string; title: string }>("SELECT customer_id, title FROM jobs WHERE id=$1", [jobId]);
      if (job) {
        await q(
          `INSERT INTO listing_inquiries (listing_id, sender_id, message) VALUES ($1, $2, $3)`,
          [jobId, u.id, clean]
        );

        // Notify counterpart
        const recipientId = u.id === job.customer_id
          ? (await one<{ worker_id: string }>("SELECT worker_id FROM bids WHERE job_id=$1 AND status='active' ORDER BY updated_at DESC LIMIT 1", [jobId]))?.worker_id
          : job.customer_id;

        if (recipientId) {
          await q(
            `INSERT INTO notifications (user_id, type, title, body, ref_type, ref_id)
             VALUES ($1, 'chat_message', 'New message on job', $2, 'job', $3)`,
            [recipientId, `${u.display_name || "A user"}: "${clean.slice(0, 60)}"`, jobId]
          );
        }
      }
    }

    const senderRole = u.is_worker ? "worker" : "customer";
    const senderName = u.display_name || (senderRole === "customer" ? "Customer" : "Verified Technician");
    const saved = store.sendJobMessage(jobId, u.id, clean, senderRole, senderName);
    return {
      ok: true,
      message: {
        ...saved,
        created_at: saved.created_at.toISOString(),
      },
    };
  } catch (err: any) {
    return { error: err?.message || "Failed to send message." };
  }
}
export async function cancelJobAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireActive();
    await cancelJob(u, str(f, "jobId"));
    redirect("/dashboard");
  });
}

// ---------- bids ----------
export async function submitBidAction(jobId: string, _: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireWorker();
    await submitBid(u, jobId, f);
    try {
      await collectBidActivity({
        jobId,
        workerPhone: u.phone,
        amount: Number(f.get("amount")) || 0,
        timingText: str(f, "timingText"),
        message: str(f, "message"),
      });
    } catch {
      // Non-blocking
    }
    revalidatePath(`/jobs/${jobId}`);
    return { ok: "Your bid was saved. You can edit or withdraw it until the customer chooses." };
  });
}
export async function withdrawBidAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireWorker();
    await withdrawBid(u, str(f, "bidId"));
    revalidatePath("/dashboard");
    revalidatePath(`/jobs/${str(f, "jobId")}`);
    return { ok: "Bid withdrawn." };
  });
}
export async function acceptBidAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireActive();
    await acceptBid(u, str(f, "bidId"), str(f, "exactAddress") || undefined);
    revalidatePath("/", "layout");
    redirect(`/jobs/${str(f, "jobId")}`);
  });
}

export async function getCustomerBidsAction(jobId: string): Promise<BidCard[]> {
  try {
    const u = await requireUser();
    return await listBidsForCustomer(u, jobId);
  } catch {
    return [];
  }
}

// ---------- booking progress ----------
export async function progressAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireActive();
    await progress(u, str(f, "bookingId"), str(f, "action") as Action, str(f, "code"));
    revalidatePath(`/jobs/${str(f, "jobId")}`);
    return { ok: "Updated." };
  });
}
export async function reportProblemAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireActive();
    await reportProblem(u, str(f, "bookingId"), str(f, "details"));
    revalidatePath(`/jobs/${str(f, "jobId")}`);
    return { ok: "Reported. The booking is marked disputed and will be reviewed." };
  });
}
export async function reviewAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireActive();
    await submitReview(u, str(f, "bookingId"), f);
    revalidatePath(`/jobs/${str(f, "jobId")}`);
    return { ok: "Review submitted. It becomes visible when both sides have reviewed, or after 7 days." };
  });
}
export async function reportAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireActive();
    await createReport(u, f);
    return { ok: "Thanks. Your report was sent to our moderators." };
  });
}

// ---------- worker ----------
export async function saveWorkerAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireActive();
    await saveWorkerProfile(u, f);
    revalidatePath("/", "layout");
    return { ok: "Profile saved." };
  });
}
export async function workerPhotoAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireWorker();
    const file = f.get("photo") as File | null;
    if (!file?.size) throw new AppError("Choose a photo.");
    await addWorkerPhoto(u, file);
    revalidatePath("/worker/profile");
    return { ok: "Photo added." };
  });
}
export async function removeWorkerPhotoAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    await removeWorkerPhoto(await requireWorker(), str(f, "id"));
    revalidatePath("/worker/profile");
  });
}
export async function identityAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const u = await requireWorker();
    await submitIdentity(u, f);
    revalidatePath("/worker/profile");
    return { ok: "Submitted for manual review. This is not a NADRA check." };
  });
}
export async function markReadAction(_?: FormState): Promise<FormState> {
  return wrap(async () => {
    const u = await requireUser();
    if (!(await isPostgresAvailable())) {
      store.markNotificationsRead(u.id);
    } else {
      await q("UPDATE notifications SET read_at=now() WHERE user_id=$1 AND read_at IS NULL", [u.id]);
    }
    revalidatePath("/", "layout");
    return { ok: "Marked all as read." };
  });
}

// ---------- admin (each re-checks admin role server-side) ----------
export async function moderateAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    await moderate(await requireAdmin(), f);
    revalidatePath("/admin");
    return { ok: "Action recorded." };
  });
}
export async function reportNoteAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    await addReportNote(await requireAdmin(), str(f, "reportId"), str(f, "note"));
    revalidatePath("/admin");
    return { ok: "Note added." };
  });
}
export async function appealCloseAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    await closeAppeal(await requireAdmin(), str(f, "id"));
    revalidatePath("/admin");
  });
}
export async function identityDecisionAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    const a = await requireAdmin();
    const reason = str(f, "reason").trim();
    if (reason.length < 5) throw new AppError("A reason is required.");
    const d = str(f, "decision");
    if (!["verified", "rejected", "needs_resubmission"].includes(d)) throw new AppError("Invalid decision.");
    await decideIdentity(a, str(f, "userId"), d as "verified", reason);
    revalidatePath("/admin");
    return { ok: "Decision recorded." };
  });
}
export async function settingsAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    await updateSettings(await requireAdmin(), f);
    revalidatePath("/admin");
    return { ok: "Settings saved." };
  });
}
export async function expandJobAction(_: FormState, f: FormData): Promise<FormState> {
  return wrap(async () => {
    await adminExpandJob(await requireAdmin(), str(f, "jobId"));
    revalidatePath("/admin");
    return { ok: "Matching widened and new workers notified." };
  });
}
