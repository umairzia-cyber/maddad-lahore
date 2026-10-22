"use client";

import React from "react";
import Link from "next/link";
import { IconShieldCheck } from "./icons";
import { useI18n } from "./maddad/I18nContext";

export function TrustStrip() {
  const { locale } = useI18n();

  return (
    <div className="trust-strip" role="note">
      <div className="trust-strip-inner" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 20px", maxWidth: "var(--content-w)", width: "100%", margin: "0 auto" }}>
        <IconShieldCheck size={16} aria-hidden="true" style={{ color: "var(--violet-400)", flexShrink: 0 }} />
        <span style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
          {locale === "ur" ? (
            <>
              <strong style={{ color: "var(--text)" }}>لاہور لوکل سروس نیٹ ورک:</strong> گھر کا پتہ صرف منتخب کاریگر کو دکھایا جاتا ہے · موبائل OTP تصدیق · براہ راست ادائیگی۔{" "}
              <Link href="/payments" style={{ textDecoration: "underline", color: "var(--violet-300)", fontWeight: 700 }}>
                طریقہ کار جانیں
              </Link>
            </>
          ) : (
            <>
              <strong style={{ color: "var(--text)" }}>Lahore Local Repair Network:</strong> Address stays private until you hire · 6-digit OTP verification · Direct settlement with technician.{" "}
              <Link href="/payments" style={{ textDecoration: "underline", color: "var(--violet-300)", fontWeight: 700 }}>
                How it works
              </Link>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

export default TrustStrip;
