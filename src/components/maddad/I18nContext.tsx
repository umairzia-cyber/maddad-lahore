"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Locale, LOCALE_DIR, MessageKey, t as translate } from "@/lib/i18n";

interface I18nContextType {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: MessageKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  dir: "ltr",
  setLocale: () => {},
  toggleLocale: () => {},
  t: (key: MessageKey) => key,
});

export function I18nProvider({ children, initialLocale = "en" }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("translate", "no");
      document.documentElement.classList.add("notranslate");
      if (document.body) {
        document.body.setAttribute("translate", "no");
        document.body.classList.add("notranslate");
      }
      const saved = localStorage.getItem("maddad_locale") as Locale | null;
      if (saved === "ur" || saved === "en") {
        setLocaleState(saved);
        document.documentElement.dir = LOCALE_DIR[saved];
        document.documentElement.lang = saved;
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("maddad_locale", newLocale);
      document.cookie = `maddad_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.dir = LOCALE_DIR[newLocale];
      document.documentElement.lang = newLocale;
      document.documentElement.setAttribute("translate", "no");
      document.documentElement.classList.add("notranslate");
    }
    router.refresh();
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "ur" : "en");
  };

  const t = (key: MessageKey) => translate(key, locale);

  return (
    <I18nContext.Provider
      value={{
        locale,
        dir: LOCALE_DIR[locale],
        setLocale,
        toggleLocale,
        t,
      }}
    >
      <div dir={LOCALE_DIR[locale]} className={locale === "ur" ? "rtl" : "ltr"}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
