"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconAlertCircle,
  IconArrowRight,
  IconBriefcase,
  IconCheck,
  IconClock,
  IconFileText,
  IconLock,
  IconMapPin,
  IconPhone,
  IconPlus,
  IconRefreshCw,
  IconShield,
  IconShieldCheck,
  IconStar,
  IconUser,
  IconWrench,
  IconZap,
} from "../icons";
import {
  acceptBidAction,
  progressAction,
  withdrawBidAction,
} from "@/app/actions";
import type { AppUser, BookingItem, CustomerJobItem, PublicJobItem, WorkerBidItem } from "./types";
import { EmptyState, StatusBadge, budgetLabel, fmtDate, fmtDateTime, pkr, plural } from "./shared";
import { useI18n } from "./I18nContext";
import { HireModal } from "./HireModal";
import { ReportModal } from "./ReportModal";

/* ---------------------------------------------------------------- */
/* CUSTOMER DASHBOARD                                               */
/* ---------------------------------------------------------------- */
interface CustomerDashboardProps {
  user: AppUser;
  jobs: CustomerJobItem[];
  bookings: BookingItem[];
  onOpenJob: (job: PublicJobItem) => void;
  onPostJob: () => void;
  onToast: (msg: string, kind?: "ok" | "error") => void;
}

export function CustomerDashboardView({
  user,
  jobs,
  bookings,
  onOpenJob,
  onPostJob,
  onToast,
}: CustomerDashboardProps) {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<"jobs" | "bookings">("jobs");
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);

  // Hire modal state
  const [hireModalData, setHireModalData] = useState<{
    open: boolean;
    jobId: string;
    bidId: string;
    workerName: string;
    amount: number;
    timingText: string;
  } | null>(null);

  // Report modal state
  const [reportModalData, setReportModalData] = useState<{
    open: boolean;
    bookingId: string;
    title: string;
  } | null>(null);

  const openJobs = jobs.filter((j) => j.status === "open" || j.status === "draft");
  const completedJobs = jobs.filter((j) => j.status === "completed" || j.status === "cancelled");
  const activeBookings = bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled");
  const pastBookings = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  const handleConfirmCompletion = async (booking: BookingItem) => {
    if (
      !window.confirm(
        locale === "ur"
          ? "کیا آپ تصدیق کرتے ہیں کہ کاریگر نے کام تسلی بخش مکمل کر دیا ہے؟"
          : "Confirm that the technician has finished the work to your satisfaction?"
      )
    )
      return;

    setSubmittingAction(`complete-${booking.id}`);
    try {
      const fd = new FormData();
      fd.set("bookingId", booking.id);
      fd.set("action", "confirm");
      fd.set("jobId", booking.job_id);
      await progressAction(null, fd);
      onToast(
        locale === "ur"
          ? "کام مکمل قرار دیا گیا۔ اب آپ کاریگر کے لیے جائزہ لکھ سکتے ہیں۔"
          : "Job marked as completed. You can now leave a review for the technician."
      );
      window.location.reload();
    } catch {
      onToast(locale === "ur" ? "تصدیق کرتے وقت خرابی ہوئی۔" : "Failed to confirm completion.", "error");
    } finally {
      setSubmittingAction(null);
    }
  };

  return (
    <div className="stack" style={{ maxWidth: 960, margin: "0 auto", width: "100%" }}>
      {/* Header Hub Plate */}
      <div
        className="plate"
        style={{
          padding: "20px 24px",
          borderRadius: "var(--r-md)",
          background: "var(--ink-1)",
          border: "1px solid var(--line)",
        }}
      >
        <div className="row-between" style={{ flexWrap: "wrap", gap: 14 }}>
          <div>
            <span className="hero-eyebrow" style={{ color: "var(--emerald-400)" }}>
              {locale === "ur" ? "کسٹمر ہب" : "Customer Hub"}
            </span>
            <h1 style={{ margin: "4px 0 0", fontSize: "1.5rem", fontWeight: 800 }}>
              {locale === "ur" ? "میرے کام اور بکنگز" : "My Repairs & Bookings"}
            </h1>
            <p className="meta" style={{ margin: 0 }}>
              {locale === "ur"
                ? "کوٹیشنز کا جائزہ لیں، کاریگر منتخب کریں اور کام کی تکمیل یقینی بنائیں۔"
                : "Track quotes, compare technicians side-by-side, and coordinate service completion."}
            </p>
          </div>
          <button type="button" onClick={onPostJob} className="btn btn-primary">
            <IconPlus size={16} />
            <span>{locale === "ur" ? "نیا کام پوسٹ کریں" : "Post a New Repair"}</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="stat-grid" style={{ marginTop: 20 }}>
          <div className="stat">
            <div className="l">{locale === "ur" ? "اوپن کام" : "Open Requests"}</div>
            <div className="n">{openJobs.length}</div>
          </div>
          <div className="stat">
            <div className="l">{locale === "ur" ? "ایکٹو بکنگز" : "Active Bookings"}</div>
            <div className="n">{activeBookings.length}</div>
          </div>
          <div className="stat">
            <div className="l">{locale === "ur" ? "کل پوسٹس" : "Total Posted"}</div>
            <div className="n">{jobs.length}</div>
          </div>
          <div className="stat">
            <div className="l">{locale === "ur" ? "مکمل شدہ کام" : "Completed"}</div>
            <div className="n">{pastBookings.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist" aria-label="Customer sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "jobs"}
          onClick={() => setActiveTab("jobs")}
          className="tab-btn"
        >
          <IconBriefcase size={16} />
          <span>{locale === "ur" ? "میرے پوسٹ کردہ کام" : "My Posted Jobs"}</span>
          <span className="tab-badge">{jobs.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "bookings"}
          onClick={() => setActiveTab("bookings")}
          className="tab-btn"
        >
          <IconShieldCheck size={16} />
          <span>{locale === "ur" ? "ایکٹو بکنگز اور کاریگر" : "Hired & Active Bookings"}</span>
          <span className="tab-badge">{bookings.length}</span>
        </button>
      </div>

      {/* VIEW: POSTED JOBS */}
      {activeTab === "jobs" && (
        <div className="stack" style={{ gap: 14 }}>
          {jobs.length === 0 ? (
            <EmptyState
              icon={<IconBriefcase size={24} />}
              title={locale === "ur" ? "ابھی تک کوئی کام پوسٹ نہیں کیا گیا" : "No repair requests posted yet"}
              action={
                <button type="button" className="btn btn-primary" onClick={onPostJob}>
                  <IconPlus size={16} />
                  <span>{locale === "ur" ? "پہلا کام پوسٹ کریں" : "Post your first repair"}</span>
                </button>
              }
            >
              {locale === "ur"
                ? "پلمبنگ یا الیکٹریکل کام کی تفصیل درج کریں تاکہ قریبی کاریگر کوٹیشنز بھیج سکیں۔"
                : "Describe a plumbing or electrical issue to receive quotes from nearby technicians."}
            </EmptyState>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {jobs.map((job) => {
                const isOpen = job.status === "open";
                return (
                  <div
                    key={job.id}
                    className="plate"
                    style={{
                      padding: 20,
                      borderRadius: "var(--r-md)",
                      background: "var(--ink-1)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <div className="row-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div className="row" style={{ gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                          <span className="pill">{job.category}</span>
                          <StatusBadge status={job.status} />
                          {job.asap && <span className="pill pill-warn">{locale === "ur" ? "فوری" : "Urgent"}</span>}
                        </div>
                        <h3 style={{ margin: "0 0 4px", fontSize: "1.2rem", fontWeight: 800 }}>
                          {job.title}
                        </h3>
                        <p className="meta" style={{ margin: 0 }}>
                          <IconMapPin size={13} style={{ verticalAlign: "middle", marginInlineEnd: 4 }} />
                          {job.area}, Lahore · {fmtDate(job.created_at)}
                        </p>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span className="budget" style={{ fontSize: "1.1rem" }}>
                          <small>{locale === "ur" ? "بجٹ" : "Budget"}</small>
                          {budgetLabel(job.budget_min, job.budget_max)}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: "12px 0", color: "var(--text-2)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                      {job.description}
                    </p>

                    {/* Received Bids Callout */}
                    {isOpen && (
                      <div
                        style={{
                          marginTop: 14,
                          padding: "14px 18px",
                          borderRadius: "var(--r-sm)",
                          background: "var(--graphite-1)",
                          border: "1px solid var(--line)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 12,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, color: "var(--emerald-300)", fontSize: "0.95rem" }}>
                            {job.bid_count === 0
                              ? locale === "ur"
                                ? "ابھی تک کوئی کوٹیشن موصول نہیں ہوئی"
                                : "No quotes received yet"
                              : `${job.bid_count} ${locale === "ur" ? "کاریگروں نے ریٹ بھیجے ہیں" : "technicians submitted quotes"}`}
                          </div>
                          <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "var(--text-3)" }}>
                            {locale === "ur"
                              ? "کاریگر کے ریٹس، تجربہ اور وقت کا موازنہ کریں اور اپنی پسند سے ہائر کریں۔"
                              : "Compare quotes side-by-side and choose who to hire with address protection."}
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => onOpenJob(job as any)}
                            className="btn btn-secondary btn-sm"
                            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                          >
                            <span>💬</span>
                            <span>{locale === "ur" ? "لائیو آکشن اور چیٹ" : "Live Quotes & Chat"}</span>
                          </button>

                          <Link href={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
                            <span>{locale === "ur" ? "ریٹ کا موازنہ کریں" : "Compare & Hire"}</span>
                            <IconArrowRight size={14} aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW: HIRED & BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="stack" style={{ gap: 14 }}>
          {bookings.length === 0 ? (
            <EmptyState
              icon={<IconShieldCheck size={24} />}
              title={locale === "ur" ? "کوئی ایکٹو بکنگ نہیں ہے" : "No active bookings yet"}
            >
              {locale === "ur"
                ? "جب آپ کسی کاریگر کی کوٹیشن قبول کریں گے، ان کا فون نمبر اور آپ کا چار ہندسوں والا تکمیل کوڈ یہاں نظر آئے گا۔"
                : "When you accept a quote, direct contact numbers and your 4-digit completion code will appear here."}
            </EmptyState>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {bookings.map((booking) => {
                const isCompleted = booking.status === "completed";
                const isDisputed = booking.status === "disputed";
                const isActing = submittingAction?.includes(booking.id);

                return (
                  <div
                    key={booking.id}
                    className="plate"
                    style={{
                      padding: 22,
                      borderRadius: "var(--r-md)",
                      background: "var(--ink-1)",
                      border: "1px solid",
                      borderColor: isCompleted
                        ? "rgba(16, 185, 129, 0.4)"
                        : isDisputed
                        ? "rgba(255, 138, 138, 0.5)"
                        : "var(--emerald-500)",
                    }}
                  >
                    <div className="row-between" style={{ flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                          <StatusBadge status={booking.status} />
                          <span className="pill pill-ok">
                            {locale === "ur" ? "طے شدہ رقم:" : "Agreed:"} {pkr(booking.amount)}
                          </span>
                        </div>
                        <h3 style={{ margin: "4px 0 2px", fontSize: "1.2rem", fontWeight: 800 }}>
                          {booking.title}
                        </h3>
                        <p className="meta" style={{ margin: 0 }}>
                          {locale === "ur" ? "منتخب کاریگر:" : "Hired technician:"}{" "}
                          <strong>{booking.worker_name || "Verified Technician"}</strong> ·{" "}
                          {fmtDateTime(booking.selected_at)}
                        </p>
                      </div>
                    </div>

                    {/* Unlocked Contact & Completion Code Box */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: 14,
                        padding: "16px 18px",
                        borderRadius: "var(--r-sm)",
                        background: "var(--graphite-1)",
                        border: "1px solid var(--line-strong)",
                        marginTop: 14,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--emerald-400)", fontWeight: 800 }}>
                          📞 {locale === "ur" ? "کاریگر سے براہ راست رابطہ:" : "Direct Technician Contact:"}
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: 4 }}>
                          {booking.worker_name || "Technician"}
                        </div>
                        <p className="hint" style={{ margin: "2px 0 0", fontSize: "0.82rem" }}>
                          {locale === "ur"
                            ? "آمد کے درست وقت اور گلی کے راستے کے لیے کال کر کے رابطہ کریں۔"
                            : "Call directly to coordinate arrival time or give directions."}
                        </p>
                        {booking.worker_phone ? (() => {
                          const rawPhone = booking.worker_phone;
                          const clean = rawPhone.replace(/[^0-9]/g, "");
                          const waNumber = clean.startsWith("0") ? `92${clean.slice(1)}` : clean;
                          const waText = encodeURIComponent(
                            `Assalam-o-Alaikum ${booking.worker_name || "Ustad ji"}, I hired you on Madadgaar for "${booking.title}".`
                          );
                          return (
                            <div style={{ marginTop: 8 }}>
                              <a
                                href={`https://wa.me/${waNumber}?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ok btn-sm"
                                style={{
                                  background: "#25D366",
                                  color: "#ffffff",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  fontWeight: 700,
                                  textDecoration: "none",
                                  padding: "5px 12px",
                                  borderRadius: "var(--r-sm)",
                                  fontSize: "0.82rem",
                                }}
                              >
                                <span>🟢</span>
                                <span>WhatsApp ({booking.worker_phone})</span>
                              </a>
                            </div>
                          );
                        })() : (
                          <div style={{ marginTop: 8 }}>
                            <Link
                              href={`/jobs/${booking.job_id}`}
                              className="btn btn-ok btn-sm"
                              style={{
                                background: "#25D366",
                                color: "#ffffff",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontWeight: 700,
                                textDecoration: "none",
                                padding: "5px 12px",
                                borderRadius: "var(--r-sm)",
                                fontSize: "0.82rem",
                              }}
                            >
                              <span>🟢</span>
                              <span>{locale === "ur" ? "واٹس ایپ و رابطہ" : "WhatsApp & Contact"}</span>
                            </Link>
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--violet-300)", fontWeight: 800 }}>
                          🔑 {locale === "ur" ? "آپ کا تصدیقی تکمیل کوڈ:" : "Your Completion Code:"}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <span
                            className="completion-code-box"
                            style={{
                              fontSize: "1.35rem",
                              padding: "4px 14px",
                              borderRadius: "var(--r-xs)",
                              background: "rgba(124, 58, 237, 0.15)",
                              border: "1px solid var(--violet-400)",
                              color: "var(--violet-200)",
                              fontWeight: 800,
                              letterSpacing: "0.15em",
                            }}
                          >
                            7344
                          </span>
                        </div>
                        <p className="hint" style={{ margin: "4px 0 0", fontSize: "0.78rem" }}>
                          {locale === "ur"
                            ? "یہ 4 ہندسوں کا کوڈ صرف اسی وقت کاریگر کو دیں جب وہ کام تسلی بخش مکمل کر لے۔"
                            : "Read this code to the technician only after checking that the repair is fully finished."}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 12,
                        borderTop: "1px solid var(--line-soft)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <Link href={`/jobs/${booking.job_id}`} className="btn btn-ghost btn-sm">
                        <span>{locale === "ur" ? "مکمل تفصیل دیکھیں →" : "View full details →"}</span>
                      </Link>

                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        {!isCompleted && !isDisputed && (
                          <button
                            type="button"
                            onClick={() =>
                              setReportModalData({
                                open: true,
                                bookingId: booking.id,
                                title: booking.title,
                              })
                            }
                            disabled={isActing}
                            className="btn btn-ghost btn-sm"
                            style={{ color: "var(--bad)" }}
                          >
                            <IconAlertCircle size={15} />
                            <span>{locale === "ur" ? "شکایت درج کریں" : "Report a problem"}</span>
                          </button>
                        )}

                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() => handleConfirmCompletion(booking)}
                            disabled={isActing}
                            className="btn btn-primary btn-sm"
                          >
                            <IconCheck size={16} />
                            <span>{locale === "ur" ? "کام کی تکمیل کی تصدیق" : "Confirm work completed"}</span>
                          </button>
                        )}

                        {isCompleted && (
                          <Link href={`/jobs/${booking.job_id}#reviews`} className="btn btn-secondary btn-sm">
                            <IconStar size={15} />
                            <span>{locale === "ur" ? "جائزہ درج کریں" : "Leave review"}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Hire Modal with Address Privacy */}
      {hireModalData && (
        <HireModal
          open={hireModalData.open}
          onClose={() => setHireModalData(null)}
          jobId={hireModalData.jobId}
          bidId={hireModalData.bidId}
          workerName={hireModalData.workerName}
          amount={hireModalData.amount}
          timingText={hireModalData.timingText}
          onSuccess={() => {
            setHireModalData(null);
            onToast(
              locale === "ur"
                ? "کاریگر منتخب ہو گیا اور گھر کا پتہ شیئر کر دیا گیا۔"
                : "Technician hired! Exact address unlocked exclusively for them."
            );
            window.location.reload();
          }}
        />
      )}

      {/* Report Modal */}
      {reportModalData && (
        <ReportModal
          open={reportModalData.open}
          onClose={() => setReportModalData(null)}
          targetType="booking"
          targetId={reportModalData.bookingId}
          targetTitle={reportModalData.title}
          onSuccess={() => {
            setReportModalData(null);
            onToast(
              locale === "ur"
                ? "آپ کی رپورٹ موصول ہو گئی ہے۔"
                : "Report submitted to Lahore moderation team."
            );
          }}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* DEDICATED WORKER / TECHNICIAN DASHBOARD                          */
/* ---------------------------------------------------------------- */
interface WorkerDashboardProps {
  user: AppUser;
  bids: WorkerBidItem[];
  matchingJobs: PublicJobItem[];
  onOpenJob: (job: PublicJobItem) => void;
  onOpenProfile: () => void;
  onToast: (msg: string, kind?: "ok" | "error") => void;
}

export function WorkerDashboardView({
  user,
  bids,
  matchingJobs,
  onOpenJob,
  onOpenProfile,
  onToast,
}: WorkerDashboardProps) {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<"matching" | "my_bids">("matching");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const activeBids = bids.filter((b) => b.status === "active");
  const acceptedBids = bids.filter((b) => b.status === "accepted");

  const handleWithdrawBid = async (bid: WorkerBidItem) => {
    if (
      !window.confirm(
        locale === "ur"
          ? `کیا آپ "${bid.title}" پر اپنی بولی واپس لینا چاہتے ہیں؟`
          : `Withdraw your quote of Rs ${bid.amount.toLocaleString("en-PK")} for "${bid.title}"?`
      )
    )
      return;

    setWithdrawingId(bid.id);
    try {
      const fd = new FormData();
      fd.set("bidId", bid.id);
      fd.set("jobId", bid.job_id);
      await withdrawBidAction(null, fd);
      onToast(locale === "ur" ? "بولی واپس لے لی گئی۔" : "Quote withdrawn.");
      window.location.reload();
    } catch {
      onToast(locale === "ur" ? "بولی واپس لیتے وقت خرابی ہوئی۔" : "Failed to withdraw quote.", "error");
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="stack" style={{ maxWidth: 960, margin: "0 auto", width: "100%" }}>
      {/* Header Hub Plate */}
      <div
        className="plate"
        style={{
          padding: "20px 24px",
          borderRadius: "var(--r-md)",
          background: "var(--ink-1)",
          border: "1px solid var(--line)",
        }}
      >
        <div className="row-between" style={{ flexWrap: "wrap", gap: 14 }}>
          <div>
            <span className="hero-eyebrow" style={{ color: "var(--emerald-400)" }}>
              {locale === "ur" ? "کاریگر پورٹل" : "Technician Portal"}
            </span>
            <h1 style={{ margin: "4px 0 0", fontSize: "1.5rem", fontWeight: 800 }}>
              {locale === "ur" ? "لاہور کے کام اور بولیاں" : "Available Jobs & Quotes"}
            </h1>
            <p className="meta" style={{ margin: 0 }}>
              {locale === "ur"
                ? "اپنے قریبی علاقوں کے نئے کام دیکھیں اور کسٹمرز کو اپنا ریٹ بھیجیں۔"
                : "Browse local repair requests in your service areas and submit competitive quotes."}
            </p>
          </div>
          <button type="button" onClick={onOpenProfile} className="btn btn-secondary">
            <IconUser size={16} />
            <span>{locale === "ur" ? "پروفائل اور علاقے" : "Profile & Areas"}</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="stat-grid" style={{ marginTop: 20 }}>
          <div className="stat">
            <div className="l">{locale === "ur" ? "نئے دستیاب کام" : "Available Jobs"}</div>
            <div className="n">{matchingJobs.length}</div>
          </div>
          <div className="stat">
            <div className="l">{locale === "ur" ? "ایکٹو بولیاں" : "Sent Quotes"}</div>
            <div className="n">{activeBids.length}</div>
          </div>
          <div className="stat">
            <div className="l">{locale === "ur" ? "ملے ہوئے کام" : "Hired Jobs"}</div>
            <div className="n">{acceptedBids.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist" aria-label="Technician sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "matching"}
          onClick={() => setActiveTab("matching")}
          className="tab-btn"
        >
          <IconZap size={16} />
          <span>{locale === "ur" ? "کام تلاش کریں" : "Find Work in Lahore"}</span>
          <span className="tab-badge">{matchingJobs.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "my_bids"}
          onClick={() => setActiveTab("my_bids")}
          className="tab-btn"
        >
          <IconFileText size={16} />
          <span>{locale === "ur" ? "میری بولیاں اور سٹیٹس" : "My Sent Quotes"}</span>
          <span className="tab-badge">{bids.length}</span>
        </button>
      </div>

      {/* TAB: MATCHING AVAILABLE JOBS */}
      {activeTab === "matching" && (
        <div className="stack" style={{ gap: 14 }}>
          {matchingJobs.length === 0 ? (
            <EmptyState
              icon={<IconZap size={24} />}
              title={locale === "ur" ? "اس وقت آپ کے علاقوں میں کوئی نیا کام نہیں" : "No open jobs in your areas right now"}
              action={
                <button type="button" className="btn btn-secondary" onClick={onOpenProfile}>
                  <IconMapPin size={16} />
                  <span>{locale === "ur" ? "مزید علاقے منتخب کریں" : "Update Service Areas"}</span>
                </button>
              }
            >
              {locale === "ur"
                ? "اپنی پروفائل میں جا کر لاہور کے مزید علاقے منتخب کریں تاکہ آپ کو زیادہ کام مل سکیں۔"
                : "Add more Lahore neighborhoods in your technician profile to receive more job alerts."}
            </EmptyState>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {matchingJobs.map((job) => (
                <div
                  key={job.id}
                  className="plate"
                  style={{
                    padding: 20,
                    borderRadius: "var(--r-md)",
                    background: "var(--ink-1)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <div className="row-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                        <span className="pill">{job.category}</span>
                        <StatusBadge status={job.status} />
                        {job.asap && <span className="pill pill-warn">{locale === "ur" ? "فوری" : "Urgent"}</span>}
                      </div>
                      <h3 style={{ margin: "4px 0 2px", fontSize: "1.15rem", fontWeight: 800 }}>
                        {job.title}
                      </h3>
                      <p className="meta" style={{ margin: 0 }}>
                        <IconMapPin size={13} style={{ verticalAlign: "middle", marginInlineEnd: 4 }} />
                        {job.area}, Lahore · {fmtDate(job.created_at)}
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span className="budget">
                        <small>{locale === "ur" ? "کسٹمر بجٹ" : "Customer budget"}</small>
                        {budgetLabel(job.budget_min, job.budget_max)}
                      </span>
                    </div>
                  </div>

                  <p style={{ margin: "12px 0", color: "var(--text-2)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                    {job.description}
                  </p>

                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: "1px solid var(--line-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <span className="pill pill-ok" style={{ fontSize: "0.8rem" }}>
                      {job.bid_count === 0
                        ? locale === "ur" ? "پہلا ریٹ بھیجیں" : "Be the first to quote"
                        : `${job.bid_count} ${locale === "ur" ? "بولیاں موصول" : "quotes so far"}`}
                    </span>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onOpenJob(job)}
                    >
                      <IconPlus size={15} />
                      <span>{locale === "ur" ? "ریٹ بھیجیں" : "Send Quote"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: MY SENT BIDS */}
      {activeTab === "my_bids" && (
        <div className="stack" style={{ gap: 14 }}>
          {bids.length === 0 ? (
            <EmptyState
              icon={<IconFileText size={24} />}
              title={locale === "ur" ? "ابھی تک کوئی بولی نہیں بھیجی گئی" : "No quotes sent yet"}
            >
              {locale === "ur"
                ? "دستیاب کاموں کا جائزہ لیں اور کسٹمرز کو اپنا ریٹ بھیجیں۔"
                : "Browse available jobs to submit quotes to Lahore customers."}
            </EmptyState>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {bids.map((bid) => {
                const isAccepted = bid.status === "accepted";
                const isWithdrawing = withdrawingId === bid.id;

                return (
                  <div
                    key={bid.id}
                    className="plate"
                    style={{
                      padding: 20,
                      borderRadius: "var(--r-md)",
                      background: "var(--ink-1)",
                      border: "1px solid",
                      borderColor: isAccepted ? "var(--emerald-500)" : "var(--line)",
                    }}
                  >
                    <div className="row-between" style={{ flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                          <StatusBadge status={bid.status} kind="bid" />
                          <span className="pill">{locale === "ur" ? "کام سٹیٹس:" : "Job:"} {bid.job_status}</span>
                        </div>
                        <h3 style={{ margin: "4px 0 2px", fontSize: "1.15rem", fontWeight: 800 }}>
                          {bid.title}
                        </h3>
                        <p className="meta" style={{ margin: 0 }}>
                          {locale === "ur" ? "اپ ڈیٹ:" : "Updated:"} {fmtDateTime(bid.updated_at)}
                        </p>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--emerald-300)" }}>
                          {pkr(bid.amount)}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                          {locale === "ur" ? "آپ کی پیشکش" : "Your quote"}
                        </div>
                      </div>
                    </div>

                    {isAccepted && (
                      <div
                        style={{
                          marginTop: 14,
                          padding: "12px 16px",
                          borderRadius: "var(--r-sm)",
                          background: "rgba(16, 185, 129, 0.1)",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          color: "var(--emerald-200)",
                          fontSize: "0.88rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 10,
                        }}
                      >
                        <div>
                          <strong>{locale === "ur" ? "مبارک ہو! آپ کا ریٹ قبول ہو گیا ہے" : "Your quote was accepted!"}</strong>
                          <div style={{ fontSize: "0.82rem", color: "var(--text-2)", marginTop: 2 }}>
                            {locale === "ur"
                              ? "کسٹمر کا مکمل پتہ اور فون نمبر دیکھنے کے لیے کام کا صفحہ کھولیں۔"
                              : "Open the job page to view the customer's unlocked address and phone number."}
                          </div>
                        </div>
                        <Link href={`/jobs/${bid.job_id}`} className="btn btn-primary btn-sm">
                          <span>🟢</span>
                          <span>{locale === "ur" ? "پتہ و واٹس ایپ دیکھیں" : "View Address & WhatsApp"}</span>
                          <IconArrowRight size={14} />
                        </Link>
                      </div>
                    )}

                    {!isAccepted && bid.status === "active" && (
                      <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleWithdrawBid(bid)}
                          disabled={isWithdrawing}
                          style={{ color: "var(--bad)" }}
                        >
                          {isWithdrawing
                            ? locale === "ur" ? "واپس لی جا رہی ہے..." : "Withdrawing..."
                            : locale === "ur" ? "بولی واپس لیں" : "Withdraw Quote"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
