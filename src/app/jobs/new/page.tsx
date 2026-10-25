import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { requireUser } from "@/lib/auth";
import { categoriesAndAreas } from "@/lib/jobs";
import { photoUploadEnabled } from "@/lib/config";
import { ActionForm, Submit } from "@/components/ActionForm";
import { ImagePicker } from "@/components/ImagePicker";
import { GeoHelper } from "@/components/GeoHelper";
import { createJobAction } from "../../actions";

export const metadata: Metadata = { title: "Post a job" };

export default async function NewJob() {
  const cookieLocale = cookies().get("maddad_locale")?.value;
  const locale = cookieLocale === "ur" ? "ur" : "en";

  const user = await requireUser();
  if (!user.display_name) {
    return (
      <p className="notice">
        {locale === "ur" ? (
          <>برائے مہربانی پہلے <Link href="/account?setup=1">اپنا نام شامل کریں</Link>۔</>
        ) : (
          <>Please <Link href="/account?setup=1">add your name</Link> first.</>
        )}
      </p>
    );
  }
  if (user.account_status !== "active") {
    return (
      <p className="msg msg-error">
        {locale === "ur" ? (
          <>آپ کا اکاؤنٹ محدود ہے اور آپ کام پوسٹ نہیں کر سکتے۔ دیکھیں <Link href="/account">اکاؤنٹ</Link>۔</>
        ) : (
          <>Your account is restricted and can&apos;t post jobs. See <Link href="/account">Account</Link>.</>
        )}
      </p>
    );
  }
  const { categories, areas } = await categoriesAndAreas();

  return (
    <div style={{ maxWidth: 680 }}>
      <h1>{locale === "ur" ? "لاہور میں کام پوسٹ کریں" : "Post a job in Lahore"}</h1>
      <p className="lead">
        {locale === "ur"
          ? "لائیو ہونے سے پہلے آپ اس کا جائزہ لیں گے۔ کاریگر صرف آپ کا علاقہ دیکھیں گے، آپ کا پتہ یا فون نمبر نہیں۔"
          : "You'll preview it before it goes live. Workers see only your area, never your address or phone."}
      </p>
      <ActionForm action={createJobAction} encType="multipart/form-data" className="card">
        <div className="field">
          <label htmlFor="categoryId">{locale === "ur" ? "کام کی قسم" : "Type of work"}</label>
          <select id="categoryId" name="categoryId" required defaultValue="">
            <option value="" disabled>{locale === "ur" ? "منتخب کریں…" : "Choose…"}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="title">{locale === "ur" ? "مختصر عنوان" : "Short title"}</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={5}
            maxLength={120}
            placeholder={locale === "ur" ? "مثلاً: کچن کا نلکا لیک کر رہا ہے" : "e.g. Kitchen tap leaking"}
          />
        </div>
        <div className="field">
          <label htmlFor="description">{locale === "ur" ? "کیا کام کروانا ہے؟" : "What needs doing?"}</label>
          <textarea id="description" name="description" required minLength={20} maxLength={2000} />
          <p className="hint">
            {locale === "ur"
              ? "بولی لگانے والے تمام افراد اسے دیکھ سکتے ہیں۔ برائے مہربانی یہاں اپنا فون نمبر یا گھر کا نمبر مت درج کریں۔"
              : "Everyone who can bid sees this. Please don't put phone numbers or your house number here."}
          </p>
        </div>

        <fieldset>
          <legend>{locale === "ur" ? "کب؟" : "When?"}</legend>
          <label className="check">
            <input type="checkbox" name="asap" /> {locale === "ur" ? "جتنی جلدی ممکن ہو" : "As soon as possible"}
          </label>
          <div className="field">
            <label htmlFor="preferredAt">
              {locale === "ur" ? "یا پسندیدہ تاریخ و وقت (پاکستانی وقت)" : "Or preferred date & time (Pakistan time)"}
            </label>
            <input id="preferredAt" name="preferredAt" type="datetime-local" />
          </div>
        </fieldset>

        <fieldset>
          <legend>{locale === "ur" ? "کہاں؟" : "Where?"}</legend>
          <div className="field">
            <label htmlFor="areaId">{locale === "ur" ? "علاقہ / محلہ" : "Area / neighbourhood"}</label>
            <select id="areaId" name="areaId" required defaultValue="">
              <option value="" disabled>{locale === "ur" ? "اپنا علاقہ منتخب کریں…" : "Choose your area…"}</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <p className="hint">
              {locale === "ur" ? "شہر: لاہور۔ کاریگر صرف یہی مقام دیکھ سکیں گے۔" : "City: Lahore. This is the only location workers will see."}
            </p>
          </div>
          <div className="field">
            <label htmlFor="addressText">
              {locale === "ur" ? "قریبی مشہور جگہ یا سیکٹر (اختیاری)" : "Nearby landmark or sector (Optional)"}
            </label>
            <input
              id="addressText"
              name="addressText"
              type="text"
              maxLength={300}
              placeholder={locale === "ur" ? "مثلاً: پیکیجز مال کے قریب، سیکٹر وائے" : "e.g. Near Packages Mall, Sector Y"}
            />
            <p className="hint">
              {locale === "ur"
                ? "عام معلومات درج کریں۔ مکمل مکان اور گلی نمبر صرف اس وقت طلب کیا جائے گا جب آپ کاریگر کی خدمات حاصل کرنے کے لیے تیار ہوں گے۔"
                : "Keep it general. Exact house and street number will be requested only when you are ready to hire a technician."}
            </p>
          </div>
          <div className="field">
            <label htmlFor="contactNote">
              {locale === "ur" ? "رسائی سے متعلق نوٹ (خفیہ، اختیاری)" : "Access note (private, optional)"}
            </label>
            <input
              id="contactNote"
              name="contactNote"
              type="text"
              maxLength={300}
              placeholder={locale === "ur" ? "مثلاً: دو بار بیل بجائیں، دوسری منزل" : "e.g. ring bell twice, 2nd floor"}
            />
          </div>
          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lng" name="lng" />
          <GeoHelper areas={areas} mode="pin" />
        </fieldset>

        <fieldset>
          <legend>{locale === "ur" ? "بجٹ (اختیاری)" : "Budget (optional)"}</legend>
          <div className="grid grid-2">
            <div className="field">
              <label htmlFor="budgetMin">{locale === "ur" ? "کم از کم (روپے)" : "From (Rs)"}</label>
              <input id="budgetMin" name="budgetMin" type="number" inputMode="numeric" min={100} step={50} />
            </div>
            <div className="field">
              <label htmlFor="budgetMax">{locale === "ur" ? "زیادہ سے زیادہ (روپے)" : "To (Rs)"}</label>
              <input id="budgetMax" name="budgetMax" type="number" inputMode="numeric" min={100} step={50} />
            </div>
          </div>
          <p className="hint">
            {locale === "ur" ? "اگر یقین نہ ہو تو خالی چھوڑ دیں۔ کاریگر اپنے کام کا معاوضہ خود بتائیں گے۔" : "Leave blank if unsure. Workers bid their own labour price."}
          </p>
        </fieldset>

        {photoUploadEnabled() ? (
          <ImagePicker name="photos" max={3} label={locale === "ur" ? "تصاویر (اختیاری)" : "Photos (optional)"} />
        ) : (
          <p className="hint">
            {locale === "ur" ? "اس تعیناتی پر تصویر اپ لوڈ فعال نہیں ہے۔" : "Photo upload is not enabled on this deployment."}
          </p>
        )}

        <p className="notice">
          <strong>{locale === "ur" ? "آپ خود چنتے ہیں اور براہ راست ادائیگی کرتے ہیں۔ " : "You choose and you pay directly. "}</strong>
          {locale === "ur"
            ? "منتخب کردہ کاریگر سے رقم کا لین دین براہ راست طے پاتا ہے۔ ہم ادائیگی یا کام کے معیار کے ضامن نہیں ہیں۔ کام کی درست تفصیلات فراہم کرنے اور بولی منتخب کرنے کے آپ خود ذمہ دار ہیں۔"
            : "Payment is arranged directly with the worker you select. We don't hold or guarantee payment or work quality. You are responsible for accurate job details and for choosing a bid."}
        </p>
        <label className="check">
          <input type="checkbox" name="ack" required />{" "}
          {locale === "ur"
            ? "میں سمجھتا ہوں کہ ادائیگی براہ راست منتخب کردہ کاریگر سے طے ہوتی ہے، اور میں کام کی تفصیلات اور اپنے فیصلے کا خود ذمہ دار ہوں۔"
            : "I understand that payment is arranged directly with the selected worker, and that I'm responsible for my job details and my choice."}
        </label>
        <Submit>{locale === "ur" ? "کام کا جائزہ لیں" : "Preview job"}</Submit>
      </ActionForm>
    </div>
  );
}
