import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { requireUser } from "@/lib/auth";
import { categoriesAndAreas } from "@/lib/jobs";
import { q, one, isPostgresAvailable } from "@/lib/db";
import { store } from "@/lib/store";
import { identityUploadEnabled, photoUploadEnabled, MAX_WORKER_PHOTOS } from "@/lib/config";
import { ActionForm, Submit } from "@/components/ActionForm";
import { GeoHelper } from "@/components/GeoHelper";
import { IdentityBadge } from "@/components/ui";
import {
  saveWorkerAction,
  workerPhotoAction,
  removeWorkerPhotoAction,
  identityAction,
} from "../../actions";

export const metadata: Metadata = { title: "Worker profile" };

export default async function WorkerProfilePage() {
  const cookieLocale = cookies().get("maddad_locale")?.value;
  const locale = cookieLocale === "ur" ? "ur" : "en";

  const user = await requireUser();

  const { categories, areas } = await categoriesAndAreas();

  let profile: { bio: string; experience_years: number; accepting_bids: boolean; identity_status: string } | null = null;
  let selectedCategoryIds = new Set<number>();
  let selectedAreaIds = new Set<number>();
  let photos: { id: string }[] = [];

  if (!(await isPostgresAvailable())) {
    const wp = store.getWorkerProfile(user.id);
    if (wp) {
      profile = {
        bio: wp.bio,
        experience_years: wp.experience_years ?? 0,
        accepting_bids: wp.accepting_bids,
        identity_status: wp.identity_status,
      };
      selectedCategoryIds = new Set(wp.categories);
      selectedAreaIds = new Set(wp.areas);
    }
  } else {
    profile = await one<{
      bio: string;
      experience_years: number;
      accepting_bids: boolean;
      identity_status: string;
    }>(
      `SELECT bio, experience_years, accepting_bids, identity_status::text
       FROM worker_profiles WHERE user_id = $1`,
      [user.id],
    );

    selectedCategoryIds = new Set(
      (
        await q<{ category_id: number }>(
          `SELECT category_id FROM worker_categories WHERE user_id = $1`,
          [user.id],
        )
      ).map((r) => r.category_id),
    );

    selectedAreaIds = new Set(
      (
        await q<{ area_id: number }>(
          `SELECT area_id FROM worker_areas WHERE user_id = $1`,
          [user.id],
        )
      ).map((r) => r.area_id),
    );

    photos = await q<{ id: string }>(
      `SELECT id FROM worker_photos WHERE user_id = $1 ORDER BY created_at`,
      [user.id],
    );
  }

  const idStatus = profile?.identity_status || "not_submitted";

  return (
    <div style={{ maxWidth: 720 }}>
      <h1>{locale === "ur" ? "کاریگر پروفائل" : "Worker Profile"}</h1>
      <p className="lead">
        {locale === "ur"
          ? "لاہور میں اپنی خدمات، کوریج کا علاقہ اور دستیابی کا تعین کریں تاکہ آپ کام تلاش کر کے بولی لگا سکیں۔"
          : "Set your services, coverage in Lahore, and availability to discover and bid on jobs."}
      </p>

      {/* Main Profile Form */}
      <section className="card">
        <h2 style={{ marginTop: 0 }}>{locale === "ur" ? "پروفائل کی تفصیلات" : "Profile Details"}</h2>
        <ActionForm action={saveWorkerAction}>
          <div className="field">
            <label htmlFor="displayName">{locale === "ur" ? "آپ کا نام" : "Your display name"}</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              minLength={2}
              maxLength={60}
              defaultValue={user.display_name ?? ""}
              placeholder={locale === "ur" ? "مثلاً: طارق محمود" : "e.g. Tariq Mehmood"}
            />
            <p className="hint">
              {locale === "ur"
                ? "یہ گاہکوں کو بولی لگاتے وقت دکھایا جاتا ہے۔ فون نمبر مت لکھیں۔"
                : "This is shown to customers when you bid. Do not include phone numbers."}
            </p>
          </div>

          <div className="field">
            <label htmlFor="bio">{locale === "ur" ? "اپنے تجربے اور کام کے بارے میں" : "About your experience & workmanship"}</label>
            <textarea
              id="bio"
              name="bio"
              required
              minLength={20}
              maxLength={800}
              defaultValue={profile?.bio ?? ""}
              placeholder={
                locale === "ur"
                  ? "اپنی مہارت، پچھلے کام اور جن آلات یا سسٹمز پر آپ کام کرتے ہیں ان کی تفصیل لکھیں..."
                  : "Describe your skills, previous work, types of appliances or systems you handle..."
              }
            />
          </div>

          <div className="field">
            <label htmlFor="experienceYears">{locale === "ur" ? "تجربے کی مدت (سال)" : "Years of experience"}</label>
            <input
              id="experienceYears"
              name="experienceYears"
              type="number"
              min={0}
              max={60}
              required
              defaultValue={profile?.experience_years ?? 0}
              style={{ maxWidth: 160 }}
            />
          </div>

          {/* Categories */}
          <fieldset>
            <legend>{locale === "ur" ? "پیش کردہ خدمات (پلمبنگ / الیکٹریشن)" : "Services offered (Plumbing / Electrical)"}</legend>
            <div className="checks">
              {categories.map((c) => (
                <label key={c.id} className="check">
                  <input
                    type="checkbox"
                    name="categoryIds"
                    value={c.id}
                    defaultChecked={selectedCategoryIds.has(c.id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
            <p className="hint">{locale === "ur" ? "کم از کم ایک شعبہ منتخب کریں۔" : "Select at least one trade."}</p>
          </fieldset>

          {/* Lahore Service Areas */}
          <fieldset>
            <legend>{locale === "ur" ? "لاہور کے سروس ایریاز" : "Lahore service areas"}</legend>
            <p className="hint" style={{ marginTop: 0 }}>
              {locale === "ur"
                ? "وہ علاقے منتخب کریں جہاں آپ کام کے لیے جانے کو تیار ہیں۔ ڈیوائس کا مقام اختیاری ہے۔"
                : "Select neighbourhoods you are willing to travel to. Device location is optional."}
            </p>
            <GeoHelper areas={areas} mode="areas" />
            <div className="checks" style={{ marginTop: 12 }}>
              {areas.map((a) => (
                <label key={a.id} className="check">
                  <input
                    id={`area-${a.id}`}
                    type="checkbox"
                    name="areaIds"
                    value={a.id}
                    defaultChecked={selectedAreaIds.has(a.id)}
                  />
                  {a.name}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>{locale === "ur" ? "دستیابی" : "Availability"}</legend>
            <label className="check">
              <input
                type="checkbox"
                name="acceptingBids"
                defaultChecked={profile?.accepting_bids ?? true}
              />
              {locale === "ur"
                ? "بولیاں وصول کر رہے ہیں (اگر مصروف یا چھٹی پر ہوں تو غیر منتخب کر دیں)"
                : "Accepting bids (uncheck if you are busy or on leave)"}
            </label>
          </fieldset>

          <Submit>{locale === "ur" ? "کاریگر پروفائل محفوظ کریں" : "Save worker profile"}</Submit>
        </ActionForm>
      </section>

      {/* Work Photos */}
      <section className="card">
        <h2 style={{ marginTop: 0 }}>
          {locale === "ur"
            ? `کام کی تصاویر (زیادہ سے زیادہ ${MAX_WORKER_PHOTOS})`
            : `Work Photos (Up to ${MAX_WORKER_PHOTOS})`}
        </h2>
        <p className="hint" style={{ marginTop: 0 }}>
          {locale === "ur"
            ? "گاہکوں کے اعتماد کے لیے اپنے پرانے کام یا اوزاروں کی تصاویر۔"
            : "Photos of your past work or tools to reassure customers."}
        </p>

        {photos.length > 0 && (
          <div className="photos" style={{ marginBlock: 12 }}>
            {photos.map((p) => (
              <div key={p.id} style={{ position: "relative", display: "inline-block" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/files/worker-photo/${p.id}`} alt="Work sample" />
                <ActionForm
                  action={removeWorkerPhotoAction}
                  confirm={locale === "ur" ? "کیا یہ تصویر حذف کرنی ہے؟" : "Remove this photo?"}
                >
                  <input type="hidden" name="id" value={p.id} />
                  <Submit className="btn btn-danger btn-sm" style={{ marginTop: 4, width: "100%" }}>
                    {locale === "ur" ? "حذف کریں" : "Remove"}
                  </Submit>
                </ActionForm>
              </div>
            ))}
          </div>
        )}

        {photoUploadEnabled() ? (
          photos.length < MAX_WORKER_PHOTOS ? (
            <ActionForm action={workerPhotoAction} encType="multipart/form-data">
              <div className="field">
                <label htmlFor="photo">{locale === "ur" ? "تصویر شامل کریں" : "Add photo"}</label>
                <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" required />
              </div>
              <Submit className="btn btn-sm">{locale === "ur" ? "تصویر اپ لوڈ کریں" : "Upload photo"}</Submit>
            </ActionForm>
          ) : (
            <p className="hint">
              {locale === "ur"
                ? `زیادہ سے زیادہ ${MAX_WORKER_PHOTOS} تصاویر کی حد پوری ہو گئی ہے۔`
                : `Maximum of ${MAX_WORKER_PHOTOS} photos reached.`}
            </p>
          )
        ) : (
          <p className="hint">
            {locale === "ur" ? "اس تعیناتی پر تصویر اپ لوڈ فعال نہیں ہے۔" : "Photo upload is not enabled on this deployment."}
          </p>
        )}
      </section>

      {/* Identity Verification (Manual Review) */}
      <section className="card" aria-labelledby="id-verification-heading">
        <div className="row">
          <h2 id="id-verification-heading" style={{ margin: 0, marginInlineEnd: "auto" }}>
            {locale === "ur" ? "شناخت کی تصدیق" : "Identity Verification"}
          </h2>
          <IdentityBadge status={idStatus} />
        </div>

        <div className="notice" style={{ marginBlock: 12 }}>
          <strong>{locale === "ur" ? "اہم اطلاع: " : "Important notice: "}</strong>
          {locale === "ur" ? (
            <>
              شناخت کی تصدیق ہماری ٹیم کی جانب سے دستی دستاویزات کی جانچ ہے۔ ہم <strong>نادرا سے منسلک نہیں ہیں</strong> اور نہ ہی خودکار تصدیق کرتے ہیں۔ &quot;شناخت کی جانچ شدہ&quot; لیبل صرف اس بات کی تصدیق کرتا ہے کہ دستی معائنہ کیا گیا ہے؛ یہ مہارت، حفاظت، مجرمانہ ریکارڈ یا سروس کے معیار کا <strong>ثبوت نہیں ہے</strong>۔ ہم مکمل شناختی کارڈ نمبر کبھی محفوظ نہیں کرتے اور نہ ہی شناختی کارڈ کی تصاویر عام دکھاتے ہیں۔
            </>
          ) : (
            <>
              Identity review is a manual document check by our team. We do <strong>NOT</strong> connect to NADRA or perform automated identity checks. An &quot;ID reviewed&quot; label confirms only that manual inspection took place; it does <strong>not</strong> prove skill, safety, criminal background, or service quality. We never store full CNIC numbers or display ID images publicly.
            </>
          )}
        </div>

        {idStatus === "verified" ? (
          <p className="msg msg-ok">
            {locale === "ur"
              ? "آپ کے شناختی دستاویزات کا ہماری ماڈریشن ٹیم نے دستی معائنہ کر کے تصدیق کر دی ہے۔"
              : "Your identity documents have been manually reviewed by our moderation team."}
          </p>
        ) : idStatus === "pending_review" ? (
          <p className="notice notice-dev">
            {locale === "ur"
              ? "آپ کے دستاویزات جمع ہو چکے ہیں اور ایڈمن کے دستی جائزے کے منتظر ہیں۔"
              : "Your documents have been submitted and are pending manual review by an admin."}
          </p>
        ) : (
          <div>
            {identityUploadEnabled() ? (
              <ActionForm action={identityAction} encType="multipart/form-data">
                <p className="hint">
                  {locale === "ur"
                    ? "اپنے قومی شناختی کارڈ کے سامنے اور پیچھے کی واضح تصاویر اپ لوڈ کریں۔ دستاویزات محفوظ پرائیویٹ اسٹوریج میں رکھی جاتی ہیں اور صرف ماڈریٹرز جائزہ لے سکتے ہیں۔"
                    : "Upload clear photos of the front and back of your CNIC. Documents are stored in access-controlled private storage and accessible only by moderators for review."}
                </p>
                <div className="field">
                  <label htmlFor="cnic_front">{locale === "ur" ? "شناختی کارڈ کا سامنے کا رخ" : "CNIC Front image"}</label>
                  <input id="cnic_front" name="cnic_front" type="file" accept="image/jpeg,image/png,image/webp" required />
                </div>
                <div className="field">
                  <label htmlFor="cnic_back">{locale === "ur" ? "شناختی کارڈ کا پچھلا رخ" : "CNIC Back image"}</label>
                  <input id="cnic_back" name="cnic_back" type="file" accept="image/jpeg,image/png,image/webp" required />
                </div>
                <Submit>{locale === "ur" ? "دستی جائزے کے لیے جمع کرائیں" : "Submit for manual review"}</Submit>
              </ActionForm>
            ) : (
              <div className="notice" style={{ background: "#fef3f2", color: "#912018", border: "1px solid #fecdca" }}>
                <strong>{locale === "ur" ? "شناختی دستاویزات اپ لوڈ فی الحال غیر فعال ہیں: " : "ID document upload is currently disabled: "}</strong>
                {locale === "ur"
                  ? "اس ماحول پر تصدیق شدہ محفوظ پرائیویٹ اسٹوریج کنفیگر نہیں ہے۔"
                  : "Secure private object storage with access control is not configured on this environment. Outside local development (with private local storage), identity document uploads remain disabled to prevent storing sensitive identity data in unsecured locations."}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
