import type { Metadata, Viewport } from "next";
import "./globals.css";
import { appName } from "@/lib/config";
import { cookies } from "next/headers";
import { type Locale, LOCALE_DIR } from "@/lib/i18n";
import { getUser } from "@/lib/auth";
import { isPostgresAvailable, q } from "@/lib/db";
import { store } from "@/lib/store";
import { I18nProvider } from "@/components/maddad/I18nContext";
import { AppHeader } from "@/components/AppHeader";
import { SkipLink } from "@/components/SkipLink";
import { TrustStrip } from "@/components/TrustStrip";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: { default: `${appName} – Lahore Local Services Marketplace`, template: `%s · ${appName}` },
  description:
    "Lahore's trusted local services marketplace. Request home repairs, hire verified technicians, offer professional services, and discover skilled work across Lahore.",
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
  other: {
    google: "notranslate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050507",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get("maddad_locale")?.value;
  const locale: Locale = cookieLocale === "ur" ? "ur" : "en";
  const user = await getUser();

  let unreadCount = 0;
  if (user) {
    if (!(await isPostgresAvailable())) {
      unreadCount = store.unreadNotificationCount(user.id);
    } else {
      const res = await q<{ n: number }>("SELECT count(*)::int n FROM notifications WHERE user_id=$1 AND read_at IS NULL", [user.id]);
      unreadCount = res[0]?.n ?? 0;
    }
  }

  return (
    <html lang={locale} dir={LOCALE_DIR[locale]} className="notranslate" translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="notranslate" translate="no">
        <I18nProvider initialLocale={locale}>
          <SkipLink />
          <div className="app-wrap">
            <div className="app-canvas">
              <AppHeader user={user} unreadCount={unreadCount} />

              <TrustStrip />

              <main id="main" tabIndex={-1}>
                {children}
              </main>

              <SiteFooter />
            </div>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
