"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import SiteNav, { type NavItem } from "@/components/SiteNav";
import { IconPlus, IconWrench, IconUser, IconLogOut } from "@/components/icons";
import { logoutAction } from "@/app/actions";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/components/maddad/I18nContext";

export interface HeaderUser {
  id: string;
  is_worker?: boolean;
  is_admin?: boolean;
}

export function AppHeader({
  user,
  unreadCount = 0,
}: {
  user: HeaderUser | null;
  unreadCount?: number;
}) {
  const { locale } = useI18n();

  const nav: NavItem[] = [
    { href: "/", label: locale === "ur" ? "مارکیٹ پلیس" : "Marketplace" },
    ...(user
      ? ([
          {
            href: "/dashboard",
            label: locale === "ur" ? "ڈیش بورڈ" : "My Dashboard",
            match: "prefix" as const,
          },
          ...(user.is_worker
            ? [
                {
                  href: "/worker/jobs",
                  label: locale === "ur" ? "ملازمتیں اور کام" : "Jobs & Offers",
                  match: "prefix" as const,
                },
              ]
            : []),
          {
            href: "/notifications",
            label: locale === "ur" ? "اطلاعات" : "Notifications",
            count: unreadCount,
            match: "prefix" as const,
          },
          {
            href: "/account",
            label: locale === "ur" ? "اکاؤنٹ" : "Account",
            match: "prefix" as const,
          },
          ...(user.is_admin
            ? [
                {
                  href: "/admin",
                  label: locale === "ur" ? "ماڈریشن" : "Moderation",
                  match: "prefix" as const,
                },
              ]
            : []),
        ] as NavItem[])
      : []),
    {
      href: "/safety",
      label: locale === "ur" ? "سیفٹی گائیڈ" : "Trust & Safety",
      match: "prefix" as const,
    },
    {
      href: "/payments",
      label: locale === "ur" ? "طریقہ کار" : "How it works",
      match: "prefix" as const,
    },
  ];

  return (
    <header className="app-header notranslate" translate="no">
      <div className="header-inner">
        <Link href="/" className="brand-badge" aria-label={locale === "ur" ? "مددگار ہوم" : "Madadgaar home"}>
          <div className="brand-avatar" aria-hidden="true">
            مددگار
          </div>
          <div className="brand-title">
            <span>Madadgaar</span>
            <span className="brand-urdu hide-sm" lang="ur">
              مددگار
            </span>
          </div>
        </Link>

        <Suspense fallback={<nav className="header-nav" aria-label="Main" />}>
          <SiteNav items={nav} />
        </Suspense>

        <div className="header-actions">
          <LanguageToggle />

          <Link
            href="/?view=post"
            className="btn btn-primary btn-sm"
            aria-label={locale === "ur" ? "کام پوسٹ کریں" : "Post a job"}
          >
            <IconPlus size={16} aria-hidden="true" />
            <span className="hide-sm">{locale === "ur" ? "کام پوسٹ کریں" : "Post a job"}</span>
          </Link>

          {user?.is_worker ? (
            <Link
              href="/worker/profile"
              className="btn btn-sm"
              aria-label={locale === "ur" ? "میری کاریگر پروفائل" : "My technician profile"}
            >
              <IconWrench size={16} aria-hidden="true" />
              <span className="btn-label-long" aria-hidden="true">
                {locale === "ur" ? "میری کاریگر پروفائل" : "My technician profile"}
              </span>
            </Link>
          ) : (
            <Link
              href="/?view=join"
              className="btn btn-sm"
              aria-label={locale === "ur" ? "بطور کاریگر شامل ہوں" : "Join as a technician"}
            >
              <IconWrench size={16} aria-hidden="true" />
              <span className="btn-label-long" aria-hidden="true">
                {locale === "ur" ? "بطور کاریگر شامل ہوں" : "Join as a technician"}
              </span>
            </Link>
          )}

          {user ? (
            <form action={logoutAction}>
              <button
                type="submit"
                className="btn btn-ghost btn-sm"
                aria-label={locale === "ur" ? "لاگ آؤٹ" : "Sign out"}
              >
                <IconLogOut size={16} aria-hidden="true" />
                <span className="hide-sm">{locale === "ur" ? "لاگ آؤٹ" : "Sign out"}</span>
              </button>
            </form>
          ) : (
            <Link
              href="/?view=signin"
              className="btn btn-ghost btn-sm"
              aria-label={locale === "ur" ? "لاگ اِن" : "Sign in"}
            >
              <IconUser size={16} aria-hidden="true" />
              <span className="hide-sm">{locale === "ur" ? "لاگ اِن" : "Sign in"}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
