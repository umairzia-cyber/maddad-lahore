"use client";

import React from "react";
import Link from "next/link";
import { IconShieldCheck } from "./icons";
import { useI18n } from "./maddad/I18nContext";

export function TrustStrip() {
  const { locale } = useI18n();

  return (
    <div className="trust-strip" role="note" style={{ background: "var(--graphite-2)", borderBottom: "1px solid var(--line-soft)" }}>
      <div className="trust-strip-inner" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px clamp(16px, 2.5vw, 44px)", maxWidth: "var(--content-w)", width: "100%", margin: "0 auto" }}>
        <IconShieldCheck size={16} aria-hidden="true" style={{ color: "var(--violet-500)", flexShrink: 0 }} />
        <span style={{ fontSize: "0.84rem", color: "var(--text-2)" }}>
          {locale === "ur" ? (
            <>
              <strong style={{ color: "var(--text)" }}>لاہور لوکل مارکیٹ پلیس:</strong> مکمل رازداری کے ساتھ اشیاء برائے فروخت، ہوم ریپئرز، سروسز اور لوکل ملازمتیں۔ پتہ صرف باہمی رضامندی پر ظاہر ہوتا ہے۔{" "}
              <Link href="/safety" style={{ textDecoration: "underline", color: "var(--violet-500)", fontWeight: 600 }}>
                سیفٹی اور رازداری کی گائیڈ
              </Link>
            </>
          ) : (
            <>
              <strong style={{ color: "var(--text)" }}>Lahore Local Marketplace:</strong> Classifieds, home repairs, freelance services &amp; local jobs. Exact street addresses stay strictly private until mutually agreed.{" "}
              <Link href="/safety" style={{ textDecoration: "underline", color: "var(--violet-500)", fontWeight: 600 }}>
                Trust &amp; Safety Guide
              </Link>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

export default TrustStrip;
