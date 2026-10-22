"use client";

import React from "react";
import { useI18n } from "./maddad/I18nContext";

export function LanguageToggle() {
  const { locale, toggleLocale } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="lang-switcher-btn"
      aria-label="Switch language / زبان تبدیل کریں"
      title={locale === "ur" ? "Switch to English" : "اردو میں دیکھیں"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: "var(--r-sm)",
        fontWeight: 700,
        fontSize: "0.82rem",
        cursor: "pointer",
        background: "var(--bg-white)",
        border: "1px solid var(--line-mid)",
        color: "var(--text-ink)",
      }}
    >
      <span>{locale === "ur" ? "English" : "اردو"}</span>
    </button>
  );
}

export default LanguageToggle;
