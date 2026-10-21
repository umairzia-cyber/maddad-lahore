"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "./maddad/I18nContext";
import { LanguageToggle } from "./LanguageToggle";

export function SiteFooter() {
  const { t, locale } = useI18n();

  return (
    <footer className="site-footer" style={{ borderTop: "1px solid var(--line-soft)", background: "var(--ink-1)", padding: "24px 16px" }}>
      <div className="site-footer-inner" style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--text-1)", fontSize: "0.95rem" }}>
            {locale === "ur" ? "© مدد لاہور · مقامی پلمبنگ اور الیکٹریکل سروسز" : "© Maddad Lahore · Local Plumbing & Electrical Network"}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-3)", marginTop: 4, maxWidth: 500 }}>
            {t("footer.direct_pay")}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <Link href="/payments" style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
            {locale === "ur" ? "طریقہ کار" : "How it works"}
          </Link>
          <Link href="/privacy" style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
            {locale === "ur" ? "رازداری پالیسی" : "Privacy notice"}
          </Link>
          <Link href="/terms" style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
            {locale === "ur" ? "شرائط و ضوابط" : "Terms"}
          </Link>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
