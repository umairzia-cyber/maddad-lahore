"use client";

import React from "react";
import { useI18n } from "./maddad/I18nContext";

export function SkipLink() {
  const { locale } = useI18n();

  return (
    <a href="#main" className="skip-link notranslate" translate="no">
      {locale === "ur" ? "مواد پر جائیں" : "Skip to content"}
    </a>
  );
}

export default SkipLink;
