"use client";

import React from "react";
import Link from "next/link";
import { IconShieldCheck } from "./icons";
import { useI18n } from "./maddad/I18nContext";

export function TrustStrip() {
  const { locale } = useI18n();

  return (
    <div className="trust-strip" role="note" style={{ background: "rgba(5, 150, 105, 0.08)", borderBottom: "1px solid rgba(16, 185, 129, 0.2)" }}>
      <div className="trust-strip-inner" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px" }}>
        <IconShieldCheck size={16} aria-hidden="true" style={{ color: "var(--emerald-400)", flexShrink: 0 }} />
        <span style={{ fontSize: "0.86rem", color: "var(--text-1)" }}>
          {locale === "ur" ? (
            <>
              <strong style={{ color: "var(--emerald-300)" }}>لاہور لوکل سروس نیٹ ورک:</strong> گھر کا پتہ صرف منتخب کاریگر کو دکھایا جاتا ہے · شناختی جانچ پڑتال · براہ راست شفاف ادائیگی۔{" "}
              <Link href="/payments" style={{ textDecoration: "underline", color: "var(--emerald-300)", fontWeight: 700 }}>
                طریقہ کار جانیں
              </Link>
            </>
          ) : (
            <>
              <strong style={{ color: "var(--emerald-300)" }}>Lahore Local Repair Network:</strong> Address protected until you hire · Verified technician profiles · Direct transparent settlement.{" "}
              <Link href="/payments" style={{ textDecoration: "underline", color: "var(--emerald-300)", fontWeight: 700 }}>
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
