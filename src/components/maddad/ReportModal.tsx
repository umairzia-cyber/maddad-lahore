"use client";

import React, { useState } from "react";
import { Dialog, Field } from "./shared";
import { IconAlertCircle, IconCheck, IconShield, IconX } from "../icons";
import { reportAction } from "@/app/actions";
import { useI18n } from "./I18nContext";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  targetType: "job" | "booking" | "user" | "bid";
  targetId: string;
  targetTitle?: string;
  onSuccess?: () => void;
}

export function ReportModal({
  open,
  onClose,
  targetType,
  targetId,
  targetTitle,
  onSuccess,
}: ReportModalProps) {
  const { t, locale } = useI18n();
  const [category, setCategory] = useState<
    "no_show" | "misleading_price" | "harassment" | "suspected_fraud" | "unsafe_conduct" | "other"
  >("no_show");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (details.trim().length < 5) {
      setError(
        locale === "ur"
          ? "براہ کرم تفصیل میں کم از کم 5 حروف درج کریں تاکہ ہم کارروائی کر سکیں۔"
          : "Please describe the problem in at least 5 characters so we can investigate."
      );
      return;
    }
    setSubmitting(true);
    setError(null);

    const fd = new FormData();
    fd.set("targetType", targetType);
    fd.set("targetId", targetId);
    fd.set("category", category);
    fd.set("details", details.trim());

    try {
      const res = await reportAction(null, fd);
      if (res?.error) {
        setError(res.error);
      } else {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      }
    } catch {
      setError(
        locale === "ur"
          ? "رپورٹ جمع کرواتے وقت خرابی پیش آئی۔ دوبارہ کوشش کریں۔"
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setSubmitted(false);
        setDetails("");
        setError(null);
        onClose();
      }}
      title={locale === "ur" ? "شکایت درج کریں" : "Report a problem"}
      eyebrow={
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--bad)" }}>
          <IconAlertCircle size={14} aria-hidden="true" />
          <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
            {locale === "ur" ? "تحفظ اور شکایت" : "Trust & Safety Concern"}
          </span>
        </div>
      }
    >
      {submitted ? (
        <div style={{ padding: "16px 8px", textAlign: "center" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "var(--ok-soft)",
              color: "var(--ok)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
            }}
          >
            <IconCheck size={28} />
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.15rem" }}>
            {locale === "ur" ? "شکایت موصول ہو گئی" : "Report received"}
          </h3>
          <p style={{ color: "var(--text-2)", fontSize: "0.9rem", lineHeight: 1.5, margin: "0 0 20px" }}>
            {locale === "ur"
              ? "آپ کی رپورٹ لاہور موڈریشن ٹیم کو موصول ہو گئی ہے۔ ہم اس معاملے کی جانچ کر کے مناسب کارروائی کریں گے۔"
              : "Your report has been forwarded to our Lahore moderation team for review. Your identity remains protected."}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setSubmitted(false);
              setDetails("");
              onClose();
            }}
          >
            {locale === "ur" ? "ٹھیک ہے" : "Done"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="stack" style={{ gap: 16 }}>
          {targetTitle && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "var(--r-sm)",
                background: "var(--ink-1)",
                border: "1px solid var(--line)",
                fontSize: "0.85rem",
                color: "var(--text-2)",
              }}
            >
              <strong>{locale === "ur" ? "متعلقہ کام:" : "Regarding:"}</strong> {targetTitle}
            </div>
          )}

          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.5 }}>
            {locale === "ur"
              ? "اگر کسی کاریگر یا کسٹمر نے غیر مناسب رویہ اختیار کیا ہو، وقت پر نہ آیا ہو، یا غلط ریٹ طلب کیا ہو، تو یہاں درج کریں۔ آپ کی شناخت رازداری میں رکھی جاتی ہے۔"
              : "Let us know if you experienced a no-show, harassment, misleading quotes, or safety concerns. Reports are reviewed by human moderators in Lahore."}
          </p>

          {error && (
            <div className="notice notice-bad" style={{ fontSize: "0.85rem" }}>
              <IconAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <Field id="report-category" label={locale === "ur" ? "مسئلے کی قسم منتخب کریں:" : "What is the problem?"}>
            {(p) => (
              <select
                {...p}
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                style={{ padding: "10px 14px", fontSize: "0.9rem" }}
              >
                <option value="no_show">{t("report.type_noshow")}</option>
                <option value="misleading_price">{t("report.type_overcharge")}</option>
                <option value="harassment">{t("report.type_harassment")}</option>
                <option value="suspected_fraud">{t("report.type_fake")}</option>
                <option value="unsafe_conduct">{t("report.type_safety")}</option>
                <option value="other">{t("report.type_other")}</option>
              </select>
            )}
          </Field>

          <Field
            id="report-details"
            label={locale === "ur" ? "تفصیل سے بتائیں کہ کیا واقعہ ہوا:" : "Explain what happened:"}
            hint={
              locale === "ur"
                ? "واقعہ کے اہم نکات اور وقت کا ذکر کریں۔"
                : "Include specific details, dates, and amounts if applicable."
            }
          >
            {(p) => (
              <textarea
                {...p}
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  locale === "ur"
                    ? "مثلاً: کاریگر نے فون پر طے شدہ ریٹ سے زیادہ رقم کا مطالبہ کیا..."
                    : "e.g. Technician arrived late, demanded additional cash payment above the accepted bid..."
                }
                style={{ padding: "10px 14px", fontSize: "0.9rem" }}
                maxLength={1500}
                required
              />
            )}
          </Field>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              {locale === "ur" ? "منسوخ کریں" : "Cancel"}
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={submitting}
            >
              {submitting
                ? locale === "ur"
                  ? "جمع کیا جا رہا ہے..."
                  : "Submitting..."
                : locale === "ur"
                ? "شکایت بھیجیں"
                : "Submit report"}
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
