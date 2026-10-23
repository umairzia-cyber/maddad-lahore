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
              <strong style={{ color: "var(--text)" }}>لاہور لوکل سروسز مارکیٹ:</strong> مکمل رازداری کے ساتھ گھریلو مرمت، کاریگر سروسز اور لوکل کام۔ پتہ صرف باہمی رضامندی پر ظاہر ہوتا ہے۔{" "}
              <Link href="/safety" style={{ textDecoration: "underline", color: "var(--violet-300)", fontWeight: 700 }}>
                سیفٹی اور رازداری کی گائیڈ
              </Link>
            </>
          ) : (
            <>
              <strong style={{ color: "var(--text)" }}>Lahore Services Marketplace:</strong> Home repairs, technician services, skilled trades &amp; local work. Exact street addresses stay strictly private until mutually agreed.{" "}
              <Link href="/safety" style={{ textDecoration: "underline", color: "var(--violet-300)", fontWeight: 700 }}>
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
