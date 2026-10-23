"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "./maddad/I18nContext";
import { LanguageToggle } from "./LanguageToggle";

export function SiteFooter() {
  const { t, locale } = useI18n();

  return (
    <footer className="site-footer" style={{ borderTop: "1px solid var(--line-soft)", background: "var(--ink-1)", padding: "24px 16px" }}>
      <div className="site-footer-inner" style={{ maxWidth: "var(--content-w)", width: "100%", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.95rem" }}>
            {locale === "ur" ? "© مددگار لاہور · لوکل سروسز اور ریپئر نیٹ ورک" : "© Madadgaar Lahore · Local Services & Repairs Network"}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-3)", marginTop: 4, maxWidth: 540 }}>
            {locale === "ur"
              ? "لاہور میں گھریلو مرمت، سروسز اور ہنر مند کاریگروں کا محفوظ نیٹ ورک۔ تمام تر لین دین براہ راست فریقین کے درمیان ہوتا ہے۔ مددگار کوئی فنڈز یا رقم ہولڈ نہیں کرتا۔"
              : "Lahore's trusted services marketplace. Direct communication and direct settlement between clients and independent technicians. Madadgaar holds zero funds and operates no financial escrow."}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Link href="/safety" style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
            {locale === "ur" ? "سیفٹی گائیڈ" : "Safety"}
          </Link>
          <Link href="/help" style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
            {locale === "ur" ? "رہنمائی اور سوالات" : "Help / FAQ"}
          </Link>
          <Link href="/contact" style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
            {locale === "ur" ? "رابطہ" : "Contact"}
          </Link>
          <Link href="/payments" style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
            {locale === "ur" ? "طریقہ کار" : "How it works"}
          </Link>
          <Link href="/privacy" style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
            {locale === "ur" ? "رازداری پالیسی" : "Privacy"}
          </Link>
          <Link href="/terms" style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
            {locale === "ur" ? "شرائط" : "Terms"}
          </Link>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
