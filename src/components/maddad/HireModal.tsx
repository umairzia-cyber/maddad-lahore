"use client";

import React, { useState } from "react";
import { Dialog, Field, pkr } from "./shared";
import { IconAlertCircle, IconCheck, IconLock, IconShieldCheck } from "../icons";
import { acceptBidAction } from "@/app/actions";
import { useI18n } from "./I18nContext";

interface HireModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  bidId: string;
  workerName: string;
  amount: number;
  timingText: string;
  onSuccess: (bookingId?: string) => void;
}

export function HireModal({
  open,
  onClose,
  jobId,
  bidId,
  workerName,
  amount,
  timingText,
  onSuccess,
}: HireModalProps) {
  const { t, locale } = useI18n();
  const [address, setAddress] = useState("");
  const [contactNote, setContactNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleHire = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAddress = address.trim();
    if (!cleanAddress || cleanAddress.length < 5) {
      setError(
        locale === "ur"
          ? "براہ کرم اپنا مکمل مکان نمبر اور گلی کا پتہ درج کریں (کم از کم 5 حروف) تاکہ کاریگر آسانی سے پہنچ سکے۔"
          : "Please enter your complete house and street address (at least 5 characters) so the technician can arrive."
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    const fd = new FormData();
    fd.set("jobId", jobId);
    fd.set("bidId", bidId);
    fd.set("exactAddress", cleanAddress);

    try {
      const res = await acceptBidAction(null, fd);
      if (res?.error) {
        setError(res.error);
      } else {
        onSuccess();
      }
    } catch {
      setError(
        locale === "ur"
          ? "کاریگر منتخب کرتے وقت خرابی پیش آئی۔ دوبارہ کوشش کریں۔"
          : "Failed to confirm booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        locale === "ur"
          ? `کاریگر منتخب کریں — ${workerName}`
          : `Confirm hiring ${workerName}`
      }
      eyebrow={
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--emerald-400)" }}>
          <IconLock size={14} aria-hidden="true" />
          <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>
            {locale === "ur" ? "پتہ کی رازداری کا تحفظ" : "Address Privacy Protection"}
          </span>
        </div>
      }
    >
      <form onSubmit={handleHire} className="stack" style={{ gap: 16 }}>
        <div
          style={{
            padding: "14px 16px",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            borderRadius: "var(--r-md)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{workerName}</div>
            <div style={{ color: "var(--text-2)", fontSize: "0.85rem", marginTop: 2 }}>
              {locale === "ur" ? "متوقع آمد کا وقت:" : "Expected arrival:"} {timingText}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--emerald-300)" }}>
              {pkr(amount)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
              {locale === "ur" ? "مزدوری (براہ راست ادائیگی)" : "Agreed labour offer"}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "var(--r-sm)",
            background: "var(--ink-1)",
            border: "1px solid var(--line)",
            fontSize: "0.84rem",
            color: "var(--text-2)",
            lineHeight: 1.5,
          }}
        >
          <IconLock size={14} style={{ verticalAlign: "middle", marginInlineEnd: 6, color: "var(--emerald-400)" }} />
          <strong>{locale === "ur" ? "رازداری کا اصول:" : "Privacy guarantee:"}</strong>{" "}
          {locale === "ur"
            ? "آپ کے گھر کا پتہ صرف اس منتخب کاریگر کو نظر آئے گا۔ دیگر تمام کاریگروں کے لیے آپ کا پتہ اور فون بند رہے گا۔"
            : "Your exact address and phone number are shared exclusively with this technician. Other bidders will never see your location."}
        </div>

        {error && (
          <div className="notice notice-bad" style={{ fontSize: "0.85rem" }}>
            <IconAlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <Field
          id="hire-address"
          label={locale === "ur" ? "گھر کا مکمل پتہ اور گلی (ضروری):" : "Your exact house & street address (Required):"}
          hint={
            locale === "ur"
              ? "مثلاً: مکان نمبر 18-A، گلی نمبر 4، بلاک بی، جوہر ٹاؤن، لاہور"
              : "e.g. House 18-A, Street 4, Block B, Johar Town, Lahore"
          }
        >
          {(p) => (
            <input
              {...p}
              type="text"
              required
              minLength={5}
              maxLength={300}
              placeholder={
                locale === "ur"
                  ? "مکان نمبر، گلی اور بلاک درج کریں..."
                  : "Enter house number, street, block, sector..."
              }
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ padding: "10px 14px", fontSize: "0.92rem" }}
              autoFocus
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
            className="btn btn-primary"
            disabled={submitting}
            style={{ padding: "8px 20px" }}
          >
            {submitting
              ? locale === "ur"
                ? "ہائر کیا جا رہا ہے..."
                : "Hiring..."
              : locale === "ur"
              ? "ہائر کریں اور پتہ شیئر کریں"
              : "Confirm Hire & Reveal Address"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
