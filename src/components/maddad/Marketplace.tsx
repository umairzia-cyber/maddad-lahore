"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import {
  IconArrowRight,
  IconBanknote,
  IconCalendar,
  IconClock,
  IconFilter,
  IconLock,
  IconMapPin,
  IconPlus,
  IconSearch,
  IconSend,
  IconUsers,
  IconWrench,
  IconZap,
  IconX,
  IconCheck,
  IconRefreshCw,
  IconFileText,
  IconInfo,
  IconShield,
  IconShieldCheck,
  IconAlertCircle,
  IconTag,
  IconPackage,
  IconHome,
  IconGraduationCap,
  IconBriefcase,
  IconStar,
  IconPhone,
  IconWhatsApp,
} from "../icons";
import { submitBidAction, submitInquiryAction, getCustomerBidsAction } from "@/app/actions";
import type { AppUser, AreaOption, PublicJobItem } from "./types";
import type { BidCard } from "@/lib/bids";
import {
  DemoBadge,
  Dialog,
  EmptyState,
  Field,
  StatusBadge,
  budgetLabel,
  fmtDate,
  plural,
  pkr,
} from "./shared";
import { useI18n } from "./I18nContext";
import { ReportModal } from "./ReportModal";
import { InAppChatModal } from "./InAppChatModal";
import { HireModal } from "./HireModal";
import {
  TechnicianRateCards,
  VERIFIED_PROVIDERS,
  VerifiedProviderCard,
} from "./TechnicianRateCards";

export function CategoryIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const s = slug.toLowerCase();
  if (s.includes("beauty") || s.includes("salon") || s.includes("mehndi")) return <span style={{ fontSize: size }}>💅</span>;
  if (s.includes("maid") || s.includes("care") || s.includes("clean")) return <span style={{ fontSize: size }}>🧹</span>;
  if (s.includes("plumb")) return <IconWrench size={size} aria-hidden="true" />;
  if (s.includes("electr")) return <IconZap size={size} aria-hidden="true" />;
  if (s.includes("appliance") || s.includes("ac")) return <IconZap size={size} aria-hidden="true" />;
  if (s.includes("carpent") || s.includes("wood")) return <IconWrench size={size} aria-hidden="true" />;
  if (s.includes("paint") || s.includes("renov")) return <IconHome size={size} aria-hidden="true" />;
  if (s.includes("repair") || s.includes("home")) return <IconWrench size={size} aria-hidden="true" />;
  if (s.includes("tutor") || s.includes("edu")) return <IconGraduationCap size={size} aria-hidden="true" />;
  if (s.includes("job") || s.includes("hir") || s.includes("work")) return <IconBriefcase size={size} aria-hidden="true" />;
  return <IconWrench size={size} aria-hidden="true" />;
}

export function ListingTypePill({ type }: { type?: string | null }) {
  const t = type || "service_request";
  if (t === "service_offer") {
    return (
      <span className="pill pill-ok" style={{ fontWeight: 700, fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <IconWrench size={12} aria-hidden="true" />
        <span>Service Offer</span>
      </span>
    );
  }
  if (t === "job_opportunity") {
    return (
      <span className="pill pill-violet" style={{ fontWeight: 700, fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <IconBriefcase size={12} aria-hidden="true" />
        <span>Skilled Job / Gig</span>
      </span>
    );
  }
  return (
    <span className="pill" style={{ fontWeight: 700, fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
      <IconZap size={12} aria-hidden="true" />
      <span>Service Needed</span>
    </span>
  );
}

export function PriceBadge({ job }: { job: PublicJobItem }) {
  if (job.price && job.price > 0) {
    const isNegotiable = job.pricing_model === "negotiable";
    return (
      <span className="badge-price" style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--violet-700)" }}>
        {pkr(job.price)} {isNegotiable && <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-3)" }}>(Negotiable)</span>}
      </span>
    );
  }
  if (job.budget_min || job.budget_max) {
    return (
      <span className="badge-price" style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text)" }}>
        {budgetLabel(job.budget_min, job.budget_max)}
      </span>
    );
  }
  if (job.pricing_model === "quote_requested") {
    return <span className="pill" style={{ fontSize: "0.78rem" }}>Quotes Requested</span>;
  }
  if (job.pricing_model === "contact_for_price") {
    return <span className="pill" style={{ fontSize: "0.78rem" }}>Contact for Price</span>;
  }
  return <span className="pill" style={{ fontSize: "0.78rem" }}>Quote upon inspection</span>;
}

/* ---------------------------------------------------------------- */
/* 1. EDITORIAL CLASSIFIEDS HERO                                    */
/* ---------------------------------------------------------------- */
export function Hero({
  user,
  realOpenCount,
  sampleCount,
  onPost,
  onJoin,
  compact,
  onBrowseCategoryRateCards,
}: {
  user: AppUser | null;
  realOpenCount: number;
  sampleCount: number;
  onPost: (category?: any) => void;
  onJoin: () => void;
  compact: boolean;
  onBrowseCategoryRateCards?: (categorySlug: string) => void;
}) {
  const { locale } = useI18n();
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<{
    slug: string;
    en: string;
    ur: string;
    icon: string;
  } | null>(null);

  const curatedCategories = [
    { slug: "electrical", en: "Electrical & Wiring", ur: "الیکٹریکل و وائرنگ", icon: "⚡" },
    { slug: "plumbing", en: "Plumbing & Sanitary", ur: "پلمبنگ و سینیٹری", icon: "🚿" },
    { slug: "appliances", en: "AC & Appliances", ur: "اے سی و ہوم اپلائنسز", icon: "❄️" },
    { slug: "beauty-salon", en: "Home Salon & Mehndi", ur: "ہوم سیلون و مہندی", icon: "💄" },
    { slug: "home-care", en: "Maids & Deep Cleaning", ur: "صفائی و گھریلو ملازمہ", icon: "🧹" },
    { slug: "home-repairs", en: "Home Repairs & Handyman", ur: "گھریلو مرمت و ہینڈی مین", icon: "🛠️" },
    { slug: "carpentry", en: "Carpentry & Woodwork", ur: "کارپینٹری و فرنیچر مرمت", icon: "🪚" },
    { slug: "painting", en: "Painting & Renovation", ur: "پینٹنگ و تزئین", icon: "🎨" },
    { slug: "jobs-work", en: "Skilled Gigs & Jobs", ur: "ہنر مند کام و جابز", icon: "👔" },
  ];

  return (
    <section className={`hero ${compact ? "hero-compact" : ""}`} aria-labelledby="hero-title">
      <div className="hero-split">
        {/* Left: Copy & Actions */}
        <div className="hero-copy" style={locale === "ur" ? { overflow: "visible", gap: 12 } : undefined}>
          <span
            className="hero-eyebrow"
            style={locale === "ur" ? { letterSpacing: "normal", lineHeight: 1.6, paddingBottom: 2 } : undefined}
          >
            {locale === "ur" ? "لاہور لوکل سروسز مارکیٹ پلیس" : "Lahore Local Services Marketplace"}
          </span>

          <h1
            id="hero-title"
            className="hero-title"
            style={
              locale === "ur"
                ? {
                    lineHeight: 1.8,
                    letterSpacing: "normal",
                    paddingBottom: 16,
                    paddingTop: 4,
                    marginBottom: 8,
                    overflow: "visible",
                    color: "#FFFFFF",
                    background: "none",
                    WebkitBackgroundClip: "unset",
                    backgroundClip: "unset",
                    display: "block",
                  }
                : undefined
            }
          >
            {locale === "ur"
              ? "لاہور میں ماہر پلمبر، الیکٹریشن یا کسی سروس کی ضرورت ہے؟"
              : "Need a repair, technician, or trusted service in Lahore?"}
          </h1>

          {!compact && (
            <p
              className="hero-lead"
              style={
                locale === "ur"
                  ? {
                      lineHeight: 1.85,
                      paddingBottom: 8,
                      overflow: "visible",
                    }
                  : undefined
              }
            >
              {locale === "ur"
                ? "چند منٹوں میں سروس کی درخواست دیں: گھریلو مرمت کروائیں، پلمبر، الیکٹریشن یا اے سی ٹیکنیشن بلوائیں، یا اپنی سروس پیش کر کے لاہور میں کام حاصل کریں — بغیر کسی کمیشن کے۔"
                : "Request home repairs, hire independent technicians and service providers, or find skilled work across 20+ Lahore neighbourhoods with zero commission."}
            </p>
          )}

          {/* Dual Action Customer Choices */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 14,
              margin: "20px 0 14px",
            }}
          >
            {/* OPTION 1: REVERSE AUCTION */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: "var(--r-md)",
                background: "var(--graphite-1)",
                border: "1px solid var(--violet-line)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: "1.25rem" }}>⚡</span>
                  <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 800, color: "var(--violet-300)", letterSpacing: "0.08em" }}>
                    {locale === "ur" ? "آپشن 1: بولیاں لیں" : "Option 1: Reverse Auction"}
                  </span>
                </div>
                <h3 style={{ margin: "0 0 4px", fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>
                  {locale === "ur" ? "مسئلہ پوسٹ کریں اور بولیاں لیں" : "Post a Problem & Get Bids"}
                </h3>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-2)", lineHeight: locale === "ur" ? 1.65 : 1.4, paddingBottom: locale === "ur" ? 2 : 0 }}>
                  {locale === "ur"
                    ? "لیکیج یا فالٹ؟ 30 سیکنڈ میں پوسٹ کریں۔ مقامی کاریگر اپنی مسابقتی قیمتیں پیش کریں گے۔"
                    : "Got a leak or fault? Post in 30 seconds. Technicians in your radius bid competitive labour prices."}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onPost()}
                style={{ width: "100%", justifyContent: "center", fontWeight: 800, padding: "8px 12px" }}
              >
                <IconPlus size={16} aria-hidden="true" />
                <span>{locale === "ur" ? "مسئلہ پوسٹ کریں (مفت)" : "Post a Request (Get Bids)"}</span>
              </button>
            </div>

            {/* OPTION 2: DIRECT RATE CARDS */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: "var(--r-md)",
                background: "var(--graphite-1)",
                border: "1px solid var(--line-strong)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: "1.25rem" }}>👨‍🔧</span>
                  <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 800, color: "var(--emerald-400)", letterSpacing: "0.08em" }}>
                    {locale === "ur" ? "آپشن 2: فکس ریٹ کارڈز" : "Option 2: Direct Hire"}
                  </span>
                </div>
                <h3 style={{ margin: "0 0 4px", fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>
                  {locale === "ur" ? "کاریگروں کے ریٹ کارڈز دیکھیں" : "Browse Technicians & Rates"}
                </h3>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-2)", lineHeight: locale === "ur" ? 1.65 : 1.4, paddingBottom: locale === "ur" ? 2 : 0 }}>
                  {locale === "ur"
                    ? "اے سی سروس، پنکھا فٹنگ، مہندی یا صفائی کا فکس ریٹ جانیں اور بغیر اشتہار دیے براہ راست رابطہ کریں۔"
                    : "See transparent rate-cards for AC wash, fan fit, mehndi, or deep cleaning and hire directly."}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const el = document.getElementById("providers-catalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={{ width: "100%", justifyContent: "center", fontWeight: 700, padding: "8px 12px" }}
              >
                <span>{locale === "ur" ? "کاریگر و ریٹ کارڈز دیکھیں ↓" : "View Providers & Rates ↓"}</span>
              </button>
            </div>
          </div>

          {/* Quick Sub-Link for Technician Sign Up */}
          <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>
              {locale === "ur" ? "کیا آپ ہنر مند کاریگر ہیں؟" : "Are you a skilled technician or provider?"}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onJoin}
              style={{ fontSize: "0.8rem", padding: "2px 6px", color: "var(--violet-300)", fontWeight: 700 }}
            >
              <span>{user?.is_worker ? (locale === "ur" ? "ٹیکنیشن پورٹل کھولیں →" : "Open Technician Portal →") : (locale === "ur" ? "سروس رجسٹر کریں →" : "Register as Provider →")}</span>
            </button>
          </div>

          <div className="hero-reassurance">
            <span>
              {locale === "ur"
                ? "مفت پوسٹنگ · ریٹس کا موازنہ · آپ کے گھر کا پتہ باہمی رضامندی تک خفیہ رہتا ہے"
                : "Free to post · Compare quotes · Your street address stays private until you hire"}
            </span>
          </div>
        </div>

        {/* Right: Authentic Documentary Craftsman Photography */}
        {!compact && (
          <div className="hero-photo-frame">
            <Image
              src="/images/plumber-lahore.jpg"
              alt="Experienced craftsman in Lahore"
              width={600}
              height={450}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <div className="hero-photo-caption">
              {locale === "ur"
                ? "لاہور کے 20 علاقوں میں مقامی سروسز: گلبرگ، ڈی ایچ اے، جوہر ٹاؤن، کینٹ، ماڈل ٹاؤن اور دیگر"
                : "Serving homes across 20+ Lahore areas: Gulberg, DHA Defence, Johar Town, Cantt, Model Town & more."}
            </div>
          </div>
        )}
      </div>

      {/* Directory Category Strip */}
      <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 20, marginTop: 24 }}>
        <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-3)", fontWeight: 700, marginBottom: 12 }}>
          {locale === "ur" ? "مشہور کیٹیگریز" : "Browse by Category"}
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
          {curatedCategories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategoryModal(cat)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: "var(--r-sm)",
                background: "var(--graphite-1)",
                border: "1px solid var(--line)",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
                fontSize: "0.88rem",
                color: "var(--text)",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span>{cat.icon}</span>
              <span style={{ fontWeight: 600 }}>{locale === "ur" ? cat.ur : cat.en}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Action Fork Dialog */}
      {selectedCategoryModal && (
        <Dialog
          open={Boolean(selectedCategoryModal)}
          onClose={() => setSelectedCategoryModal(null)}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1.5rem" }}>{selectedCategoryModal.icon}</span>
              <span>{locale === "ur" ? selectedCategoryModal.ur : selectedCategoryModal.en}</span>
            </div>
          }
          eyebrow={
            <span className="pill pill-violet" style={{ fontSize: "0.74rem", fontWeight: 700 }}>
              {locale === "ur" ? "لاہور لوکل سروسز" : "Lahore Local Services"}
            </span>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.5 }}>
              {locale === "ur"
                ? "آپ اس سروس کے لیے کس طرح کام کروانا چاہتے ہیں؟ اپنی سہولت کے مطابق منتخب کریں:"
                : "How would you like to hire in Lahore? Choose the option that fits your needs best:"}
            </p>

            {/* Option 1: Direct Hire & Rate Cards */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                const slug = selectedCategoryModal.slug;
                setSelectedCategoryModal(null);
                if (onBrowseCategoryRateCards) {
                  onBrowseCategoryRateCards(slug);
                } else {
                  const el = document.getElementById("providers-catalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const slug = selectedCategoryModal.slug;
                  setSelectedCategoryModal(null);
                  if (onBrowseCategoryRateCards) onBrowseCategoryRateCards(slug);
                }
              }}
              style={{
                padding: "16px 18px",
                borderRadius: "var(--r-md)",
                background: "var(--graphite-2)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.3rem" }}>👨‍🔧</span>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "#FFFFFF" }}>
                    {locale === "ur" ? "کاریگروں کے ریٹ کارڈز دیکھیں" : "Browse Verified Ustads & Rate Cards"}
                  </span>
                </div>
                <span className="pill pill-ok" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                  {locale === "ur" ? "فوری رابطہ" : "Fastest Hire"}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                {locale === "ur"
                  ? "لاہور کے تصدیق شدہ کاریگروں کے فکس ریٹ کارڈز دیکھیں۔ 1 کلک پر واٹس ایپ یا ان-ایپ چیٹ سے براہ راست رابطہ کریں۔"
                  : "View standard rate-cards (fan install, AC service, deep clean, mehndi). 1-tap direct WhatsApp or In-App Chat."}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontWeight: 700, color: "var(--emerald-400)", marginTop: 4 }}>
                <span>{locale === "ur" ? "ریٹ کارڈز کھولیں →" : "View Providers & Rates →"}</span>
              </div>
            </div>

            {/* Option 2: Post a Problem & Get Bids */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                const slug = selectedCategoryModal.slug;
                setSelectedCategoryModal(null);
                onPost(slug);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const slug = selectedCategoryModal.slug;
                  setSelectedCategoryModal(null);
                  onPost(slug);
                }
              }}
              style={{
                padding: "16px 18px",
                borderRadius: "var(--r-md)",
                background: "var(--graphite-2)",
                border: "1px solid rgba(139, 92, 246, 0.4)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.3rem" }}>⚡</span>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "#FFFFFF" }}>
                    {locale === "ur" ? "مسئلہ پوسٹ کریں اور بولیاں حاصل کریں" : "Post a Request & Get Bids (24h)"}
                  </span>
                </div>
                <span className="pill pill-violet" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                  {locale === "ur" ? "ریورس آکشن" : "Best Price"}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                {locale === "ur"
                  ? "اپنا مسئلہ 30 سیکنڈ میں پوسٹ کریں۔ آپ کے علاقے کے کاریگر مسابقتی ریٹ بھیجیں گے۔ فون نمبر اور پتہ محفوظ رہتا ہے۔"
                  : "Describe your issue in 30 seconds. Local technicians in your area send custom counter-quotes. Exact address stays private."}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontWeight: 700, color: "var(--violet-300)", marginTop: 4 }}>
                <span>{locale === "ur" ? "درخواست پوسٹ کریں →" : "Post Request in this Category →"}</span>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </section>
  );
}

export function HowItWorks() {
  return null;
}

export function TrustPanel({ onOpenReport }: { onOpenReport: () => void }) {
  const { locale } = useI18n();

  return (
    <section className="card" style={{ padding: "clamp(24px, 3vw, 36px)", background: "var(--graphite-1)", borderRadius: "var(--r-md)", border: "1px solid var(--line)", marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <IconShieldCheck size={22} style={{ color: "var(--violet-500)" }} />
        <h2 style={{ margin: 0, fontSize: "1.3rem", fontFamily: "var(--font-serif)", fontWeight: 700 }}>
          {locale === "ur" ? "لاہور کمیونٹی کے لیے شفاف اور محفوظ اصول" : "Community Safeguards for Lahore"}
        </h2>
      </div>
      <p style={{ color: "var(--text-2)", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: 900, margin: "0 0 20px" }}>
        {locale === "ur"
          ? "مددگار ایک شفاف لوکل نیٹ ورک ہے۔ ہم کوئی پوشیدہ کمیشن نہیں لیتے، گاہک اور فراہم کنندہ براہ راست بات کرتے ہیں، اور آپ کے گھر کا پتہ باہمی رضامندی تک مکمل محفوظ رہتا ہے۔"
          : "Maddadgaar operates with zero hidden cuts and direct settlement. Exact street addresses stay strictly private until an agreement is reached."}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div style={{ padding: 14, background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)" }}>
          <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text)", marginBottom: 4 }}>
            {locale === "ur" ? "پتہ کی مکمل رازداری" : "Address Privacy"}
          </div>
          <div style={{ fontSize: "0.84rem", color: "var(--text-2)", lineHeight: 1.5 }}>
            {locale === "ur" ? "صرف علاقہ دکھایا جاتا ہے؛ گھر کا پتہ کبھی پبلک نہیں ہوتا۔" : "Only your neighborhood is public; exact house details stay private."}
          </div>
        </div>
        <div style={{ padding: 14, background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)" }}>
          <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text)", marginBottom: 4 }}>
            {locale === "ur" ? "6 ہندسوں کی فون تصدیق" : "OTP Phone Verification"}
          </div>
          <div style={{ fontSize: "0.84rem", color: "var(--text-2)", lineHeight: 1.5 }}>
            {locale === "ur" ? "ہر اشتہار اور بولی کی تصدیق موبائل OTP سے ہوتی ہے۔" : "Every listing and inquiry is authenticated with a 6-digit code."}
          </div>
        </div>
        <div style={{ padding: 14, background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)" }}>
          <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text)", marginBottom: 4 }}>
            {locale === "ur" ? "براہ راست لین دین" : "Direct Settlement"}
          </div>
          <div style={{ fontSize: "0.84rem", color: "var(--text-2)", lineHeight: 1.5 }}>
            {locale === "ur" ? "کیش یا راست (Raast) سے براہ راست فریقین ادائیگی کرتے ہیں۔" : "Pay in person or via Raast once you inspect the item or repair."}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--line-soft)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: "0.84rem", color: "var(--text-3)" }}>
          {locale === "ur" ? "کوئی مسئلہ، دھوکہ دہی، یا شکایت کی اطلاع دیں:" : "Facing an issue or need to report suspicious activity?"}
        </span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onOpenReport}
          style={{ color: "var(--bad)" }}
        >
          <IconAlertCircle size={14} aria-hidden="true" />
          <span>{locale === "ur" ? "مسئلہ رپورٹ کریں" : "Report an issue"}</span>
        </button>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 2. UNIVERSAL CLASSIFIEDS CARD                                    */
/* ---------------------------------------------------------------- */
export function ListingCard({
  job,
  onOpen,
  ownJob,
}: {
  job: PublicJobItem;
  onOpen: (j: PublicJobItem) => void;
  ownJob: boolean;
}) {
  const { locale } = useI18n();

  return (
    <article
      className="card"
      onClick={() => onOpen(job)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(job);
        }
      }}
      style={{
        padding: "20px",
        background: "var(--graphite-1)",
        borderRadius: "var(--r-md)",
        border: "1px solid var(--line)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 14,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
          <ListingTypePill type={job.listing_type} />
          <PriceBadge job={job} />
        </div>

        <h3 style={{ fontSize: "1.12rem", fontWeight: 700, fontFamily: "var(--font-serif)", color: "var(--text)", margin: "0 0 6px", lineHeight: 1.3 }}>
          {job.title}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: "0.82rem", color: "var(--text-3)", marginBottom: 10 }}>
          <span className="pill" style={{ padding: "2px 8px", fontSize: "0.75rem" }}>{job.category}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <IconMapPin size={13} style={{ color: "var(--violet-500)" }} />
            {job.area}, Lahore
          </span>
          <span>· {fmtDate(job.created_at)}</span>
          {ownJob && <span className="pill pill-ok" style={{ fontSize: "0.72rem" }}>Your Listing</span>}
          {job.is_demo && <DemoBadge />}
        </div>

        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {job.description}
        </p>
      </div>

      <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: "0.82rem", color: "var(--text-3)" }}>
          {job.listing_type === "service_request"
            ? (job.bid_count === 0 ? "No quotes yet" : plural(job.bid_count, "quote received"))
            : "Inquiries open"}
        </span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(job);
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <span>{ownJob ? "Manage" : "View & Contact"}</span>
          <IconArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------- */
/* 3. MARKETPLACE VIEW: TABS, FILTERS & GRID                        */
/* ---------------------------------------------------------------- */
export function MarketplaceView({
  jobs,
  areas,
  user,
  ownJobIds,
  onOpenJob,
  onPost,
  initialMode,
  initialCategory,
}: {
  jobs: PublicJobItem[];
  areas: AreaOption[];
  user: AppUser | null;
  ownJobIds: Set<string>;
  onOpenJob: (j: PublicJobItem) => void;
  onPost?: (cat?: any) => void;
  initialMode?: "requests" | "rate_cards";
  initialCategory?: string;
}) {
  const { locale } = useI18n();
  const [marketplaceMode, setMarketplaceMode] = useState<"requests" | "rate_cards">(initialMode || "requests");
  const [chatProvider, setChatProvider] = useState<VerifiedProviderCard | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [q, setQ] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    if (initialMode) setMarketplaceMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const realJobs = useMemo(() => jobs.filter((j) => !j.is_demo), [jobs]);

  const uniqueCategories = useMemo(() => {
    const s = new Set<string>();
    jobs.forEach((j) => {
      if (j.category) s.add(j.category);
    });
    return Array.from(s).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    return realJobs.filter((j) => {
      if (selectedType !== "all") {
        const itemType = j.listing_type || "service_request";
        if (itemType !== selectedType) return false;
      }
      if (selectedCategory !== "all" && j.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      if (selectedArea !== "all" && j.area.toLowerCase() !== selectedArea.toLowerCase()) return false;
      if (q.trim()) {
        const query = q.toLowerCase();
        const matches =
          j.title.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.area.toLowerCase().includes(query) ||
          j.category.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [realJobs, selectedType, selectedCategory, selectedArea, q]);

  const typeTabs = [
    { id: "all", labelEn: "All Services", labelUr: "تمام سروسز" },
    { id: "service_request", labelEn: "🛠️ Services Needed (Hire)", labelUr: "🛠️ کاریگر کی ضرورت" },
    { id: "service_offer", labelEn: "👨‍🔧 Services Offered (Find Providers)", labelUr: "👨‍🔧 سروس کی پیشکش" },
    { id: "job_opportunity", labelEn: "💼 Service Jobs & Gigs", labelUr: "💼 ملازمت اور روزگار" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* Primary Marketplace Mode Switcher: Reverse-Auction Requests vs Direct Rate Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
          padding: "6px",
          borderRadius: "var(--r-md)",
          background: "var(--graphite-2)",
          border: "1px solid var(--line-strong)",
        }}
      >
        <button
          type="button"
          onClick={() => setMarketplaceMode("requests")}
          style={{
            padding: "12px 18px",
            borderRadius: "var(--r-sm)",
            fontSize: "0.92rem",
            fontWeight: 800,
            cursor: "pointer",
            border: marketplaceMode === "requests" ? "1px solid var(--violet-400)" : "1px solid transparent",
            background: marketplaceMode === "requests" ? "var(--violet-600)" : "transparent",
            color: marketplaceMode === "requests" ? "#FFFFFF" : "var(--text-2)",
            boxShadow: marketplaceMode === "requests" ? "0 0 16px var(--violet-glow)" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.15s ease",
          }}
        >
          <span>⚡</span>
          <span>{locale === "ur" ? "کسٹمر کی لائیو بولیاں و اشتہارات" : "Live Bidding Requests"}</span>
          <span
            style={{
              fontSize: "0.75rem",
              padding: "2px 8px",
              borderRadius: "var(--r-pill)",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#FFFFFF",
            }}
          >
            {realJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMarketplaceMode("rate_cards")}
          style={{
            padding: "12px 18px",
            borderRadius: "var(--r-sm)",
            fontSize: "0.92rem",
            fontWeight: 800,
            cursor: "pointer",
            border: marketplaceMode === "rate_cards" ? "1px solid var(--emerald-400)" : "1px solid transparent",
            background: marketplaceMode === "rate_cards" ? "rgba(16, 185, 129, 0.25)" : "transparent",
            color: marketplaceMode === "rate_cards" ? "var(--emerald-200)" : "var(--text-2)",
            boxShadow: marketplaceMode === "rate_cards" ? "0 0 16px rgba(16, 185, 129, 0.3)" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.15s ease",
          }}
        >
          <span>👨‍🔧</span>
          <span>{locale === "ur" ? "کاریگروں کے ریٹ کارڈز (فوری رابطہ)" : "Verified Providers & Rate Cards"}</span>
          <span
            style={{
              fontSize: "0.75rem",
              padding: "2px 8px",
              borderRadius: "var(--r-pill)",
              background: "rgba(16, 185, 129, 0.3)",
              color: "var(--emerald-200)",
            }}
          >
            {VERIFIED_PROVIDERS.length}
          </span>
        </button>
      </div>

      {marketplaceMode === "rate_cards" ? (
        <TechnicianRateCards
          user={user}
          areas={areas}
          initialCategory={selectedCategory !== "all" ? selectedCategory : undefined}
          onOpenChatWithProvider={(p) => setChatProvider(p)}
          onPostCustomRequest={(catSlug) => onPost && onPost(catSlug)}
        />
      ) : (
        <>
          {/* Type Tabs */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
            {typeTabs.map((tab) => {
              const active = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--r-sm)",
                fontSize: "0.88rem",
                fontWeight: active ? 700 : 500,
                background: active ? "var(--violet-600)" : "var(--graphite-1)",
                color: active ? "#FFFFFF" : "var(--text-2)",
                border: active ? "1px solid var(--violet-400)" : "1px solid var(--line)",
                boxShadow: active ? "0 0 12px var(--violet-glow)" : "0 2px 4px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {locale === "ur" ? tab.labelUr : tab.labelEn}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ padding: "16px", background: "var(--graphite-1)", borderRadius: "var(--r-md)", border: "1px solid var(--line)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 280px", position: "relative", display: "flex", alignItems: "center" }}>
          <IconSearch size={16} style={{ position: "absolute", insetInlineStart: 12, color: "var(--text-3)", pointerEvents: "none" }} />
          <input
            type="search"
            placeholder={
              locale === "ur"
                ? "لاہور میں سروسز، پلمبر، الیکٹریشن یا کام تلاش کریں..."
                : "Search Lahore repairs, technicians, services, jobs..."
            }
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              paddingInlineStart: 38,
              paddingInlineEnd: 14,
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--line)",
              fontSize: "0.92rem",
              background: "var(--graphite-2)",
            }}
          />
        </div>

        <div style={{ flex: "0 1 200px" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-2)", fontSize: "0.88rem" }}
          >
            <option value="all">{locale === "ur" ? "تمام کیٹیگریز" : "All Categories"}</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: "0 1 200px" }}>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-2)", fontSize: "0.88rem" }}
          >
            <option value="all">{locale === "ur" ? "تمام لاہور" : "All Lahore Areas"}</option>
            {areas.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>

        {(q || selectedCategory !== "all" || selectedArea !== "all" || selectedType !== "all") && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setQ("");
              setSelectedCategory("all");
              setSelectedArea("all");
              setSelectedType("all");
            }}
            style={{ fontSize: "0.82rem" }}
          >
            {locale === "ur" ? "فلٹرز ختم کریں" : "Reset Filters"}
          </button>
        )}
      </div>

      {/* Grid count header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>
          {filtered.length} {locale === "ur" ? "سروسز لاہور میں" : "services found across Lahore"}
        </div>
      </div>

      {/* Listings Grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center", background: "var(--graphite-1)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: "50%", background: "var(--violet-soft)", color: "var(--violet-500)", display: "grid", placeItems: "center" }}>
            <IconSearch size={22} />
          </div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", margin: "0 0 8px" }}>
            {locale === "ur" ? "آپ کی تلاش کے مطابق کوئی سروس نہیں ملی" : "No services match your search"}
          </h3>
          <p style={{ color: "var(--text-3)", fontSize: "0.92rem", margin: "0 0 20px" }}>
            {locale === "ur" ? "فلٹرز تبدیل کر کے دوبارہ کوشش کریں یا نئی سروس کی درخواست دیں۔" : "Try resetting your search query or neighborhood filter."}
          </p>
          {onPost && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onPost()}>
              <IconPlus size={16} />
              <span>{locale === "ur" ? "نئی سروس کی درخواست دیں" : "Post a Service Request"}</span>
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {filtered.map((j) => (
            <ListingCard key={j.id} job={j} onOpen={onOpenJob} ownJob={ownJobIds.has(j.id)} />
          ))}
        </div>
      )}

      {/* Embedded Rate Cards Directory below requests */}
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--line-strong)" }}>
        <TechnicianRateCards
          user={user}
          areas={areas}
          onOpenChatWithProvider={(p) => setChatProvider(p)}
          onPostCustomRequest={(catSlug) => onPost && onPost(catSlug)}
        />
      </div>
    </>
  )}

  {/* Direct Chat with Provider Modal */}
  {chatProvider && (
    <InAppChatModal
      open={true}
      onClose={() => setChatProvider(null)}
      jobId={`inquiry-${chatProvider.id}`}
      jobTitle={`Direct Inquiry: ${chatProvider.trade}`}
      area={chatProvider.primaryArea}
      isCustomer={true}
      counterpartName={`${chatProvider.name} (${chatProvider.trade})`}
      counterpartSubtitle={`${chatProvider.primaryArea} · ★ ${chatProvider.rating.toFixed(1)} · ${chatProvider.experienceYears} yrs exp`}
      quotedAmount={chatProvider.startingRatePkr}
      user={user}
    />
  )}

  {/* Trust & Safeguards */}
  <TrustPanel onOpenReport={() => setReportModalOpen(true)} />

  <ReportModal
    open={reportModalOpen}
    onClose={() => setReportModalOpen(false)}
    targetType="user"
    targetId={user?.id || "00000000-0000-0000-0000-000000000000"}
    targetTitle="General Lahore Marketplace Report"
  />
</div>
  );
}

/* ---------------------------------------------------------------- */
/* 4. LISTING DETAILS & INQUIRY / QUOTE MODAL                       */
/* ---------------------------------------------------------------- */
export function JobDialog({
  job,
  user,
  isOwn,
  onClose,
  onSignIn,
  onJoin,
  onBidSent,
}: {
  job: PublicJobItem | null;
  user: AppUser | null;
  isOwn: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onJoin: () => void;
  onBidSent: (msg: string) => void;
}) {
  const { locale } = useI18n();

  // State for inquiry
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [senderPhone, setSenderPhone] = useState(user?.phone || "");
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // State for technician bidding
  const [bidAmount, setBidAmount] = useState("1000");
  const [bidTiming, setBidTiming] = useState("Within 45 mins");
  const [bidNote, setBidNote] = useState("Independent technician in Lahore · Tools ready");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State for customer live bids
  const [bids, setBids] = useState<BidCard[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [bidSort, setBidSort] = useState<"lowest" | "fastest" | "rating" | "newest">("lowest");

  // Bid stats for Price Radar
  const bidStats = useMemo(() => {
    if (!bids || bids.length === 0) return null;
    const amounts = bids.map((b) => b.amount).filter((a) => typeof a === "number" && a > 0);
    if (amounts.length === 0) return null;
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    const avg = Math.round(amounts.reduce((sum, a) => sum + a, 0) / amounts.length);
    return { min, max, avg, count: amounts.length };
  }, [bids]);

  // Sorted bids for customer comparison
  const sortedBids = useMemo(() => {
    const copy = [...bids];
    if (bidSort === "lowest") {
      return copy.sort((a, b) => a.amount - b.amount);
    }
    if (bidSort === "fastest") {
      return copy.sort((a, b) => {
        const getMins = (t: string) => {
          const m = (t || "").match(/(\d+)\s*(min|hour|hr)/i);
          if (!m) return 999;
          const val = parseInt(m[1], 10);
          return m[2].toLowerCase().startsWith("h") ? val * 60 : val;
        };
        return getMins(a.timing_text) - getMins(b.timing_text);
      });
    }
    if (bidSort === "rating") {
      return copy.sort((a, b) => (b.rep?.rating_avg ?? 0) - (a.rep?.rating_avg ?? 0));
    }
    return copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [bids, bidSort]);

  // Chat & Hire modal state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatCounterpart, setChatCounterpart] = useState<{
    name: string;
    subtitle: string;
    amount?: number | null;
  } | null>(null);

  const [hireModalData, setHireModalData] = useState<{
    bidId: string;
    workerName: string;
    amount: number;
    timingText: string;
  } | null>(null);

  // Load customer bids if isOwn
  React.useEffect(() => {
    setInquiryMsg("");
    setOfferPrice("");
    setInquirySuccess(false);
    setBidSuccess(false);
    setErrorMessage(null);
    setChatOpen(false);
    setHireModalData(null);

    if (job?.id && isOwn) {
      setLoadingBids(true);
      getCustomerBidsAction(job.id)
        .then((res) => setBids(res || []))
        .catch(() => setBids([]))
        .finally(() => setLoadingBids(false));
    } else {
      setBids([]);
    }
  }, [job?.id, isOwn]);

  if (!job) return null;

  const isServiceRequest = (job.listing_type || "service_request") === "service_request";

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMsg.trim() || inquiryMsg.trim().length < 3) {
      setErrorMessage("Please enter a short message for the poster.");
      return;
    }
    setSubmittingInquiry(true);
    setErrorMessage(null);

    const fd = new FormData();
    fd.set("jobId", job.id);
    fd.set("message", inquiryMsg.trim());
    if (offerPrice) fd.set("offerPrice", offerPrice.trim());
    if (senderPhone) fd.set("phone", senderPhone.trim());

    try {
      const res = await submitInquiryAction(null, fd);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setInquirySuccess(true);
        onBidSent(res?.ok || "Inquiry sent successfully!");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to submit inquiry.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(bidAmount);
    if (!amt || amt < 100) {
      setErrorMessage("Please enter a valid whole rupee quote (min Rs 100).");
      return;
    }
    if (!bidTiming.trim()) {
      setErrorMessage("Please specify your expected arrival time.");
      return;
    }
    setSubmittingBid(true);
    setErrorMessage(null);

    const fd = new FormData();
    fd.set("amount", String(amt));
    fd.set("timingText", bidTiming.trim());
    fd.set("message", bidNote.trim() || "Independent technician in Lahore");
    fd.set("inclusions", "Labour only");
    fd.set("exclusions", "Parts charged separately if required");

    try {
      const res = await submitBidAction(job.id, null, fd);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setBidSuccess(true);
        onBidSent("Quote submitted successfully to customer!");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to submit bid.");
    } finally {
      setSubmittingBid(false);
    }
  };

  const quickPricePills = [500, 800, 1000, 1200, 1500, 2000];
  const quickTimingPills = [
    locale === "ur" ? "30 منٹ میں" : "Within 30 mins",
    locale === "ur" ? "1 گھنٹے میں" : "In 1 hour",
    locale === "ur" ? "آج شام" : "Today evening",
    locale === "ur" ? "کل صبح" : "Tomorrow morning",
  ];

  return (
    <>
      <Dialog open={Boolean(job)} onClose={onClose} title={job.title}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxHeight: "80vh", overflowY: "auto", padding: "4px" }}>
          {/* Top Badges */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <ListingTypePill type={job.listing_type} />
            <PriceBadge job={job} />
          </div>

          {/* Location & Metadata */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: "0.85rem", color: "var(--text-3)", paddingBottom: 12, borderBottom: "1px solid var(--line-soft)" }}>
            <span className="pill">{job.category}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <IconMapPin size={14} style={{ color: "var(--violet-500)" }} />
              {job.area}, Lahore
            </span>
            <span>· {locale === "ur" ? `پوسٹ کردہ ${fmtDate(job.created_at)}` : `Posted ${fmtDate(job.created_at)}`}</span>
            <span className="pill pill-ok" style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <IconClock size={11} />
              <span>{locale === "ur" ? "24 گھنٹے ریورس نیلامی" : "24h Reverse Auction"}</span>
            </span>
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-3)", fontWeight: 700, marginBottom: 6 }}>
              {locale === "ur" ? "کام کی تفصیل" : "Description & Requirements"}
            </div>
            <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text)", whiteSpace: "pre-line" }}>
              {job.description}
            </p>
          </div>

          {/* Location Privacy Shield Notice */}
          <div style={{ padding: "12px 16px", background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)", display: "flex", alignItems: "center", gap: 10 }}>
            <IconLock size={16} style={{ color: "var(--violet-500)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.82rem", color: "var(--text-2)" }}>
              {locale === "ur" ? (
                <>
                  <strong>مقام کی رازداری:</strong> گھر کا اصل پتہ بالکل خفیہ ہے۔ کاریگر کو خدمات پر مامور کرنے تک صرف محلہ ({job.area}) ظاہر ہوتا ہے۔
                </>
              ) : (
                <>
                  <strong>Location Privacy:</strong> Exact house address is strictly private. Only the neighborhood ({job.area}) is public until you hire a technician.
                </>
              )}
            </span>
          </div>

          {/* Error notification */}
          {errorMessage && (
            <div style={{ padding: "10px 14px", background: "rgba(155, 44, 44, 0.08)", border: "1px solid var(--bad)", borderRadius: "var(--r-sm)", color: "var(--bad)", fontSize: "0.85rem" }}>
              {errorMessage}
            </div>
          )}

          {/* ACTION SECTION */}
          {isOwn ? (
            /* ============================================================== */
            /* 1. CUSTOMER'S INDRIVE-STYLE LIVE BIDDING ROOM                  */
            /* ============================================================== */
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Active Auction Radar Banner */}
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: "var(--r-md)",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(13, 17, 23, 0.95) 100%)",
                  border: "1px solid var(--violet-line)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--ok)", boxShadow: "0 0 10px var(--ok)" }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--violet-300)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {locale === "ur" ? "24 گھنٹے کا لائیو ریورس آکشن ایکٹو" : "Live InDrive-Style Reverse Auction (24h)"}
                    </span>
                  </div>
                  <span className="pill pill-violet" style={{ fontSize: "0.74rem", fontWeight: 700 }}>
                    {bids.length} {locale === "ur" ? "کوٹیشنز موصول" : "Quotes Received"}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                  {locale === "ur"
                    ? `لاہور (${job.area}) کے تصدیق شدہ کاریگر آپ کے کام پر ریٹ بھیج رہے ہیں۔ آپ یہاں گمنام چیٹ میں بات کر سکتے ہیں اور پسندیدہ کاریگر کو فائنل کر سکتے ہیں۔`
                    : `Verified technicians across ${job.area}, Lahore are reviewing your request. Chat anonymously in private or accept the best quote.`}
                </p>
              </div>

              {/* Received Quotes Stream */}
              <div>
                {/* 1. Live Market Price Radar */}
                {bidStats && bidStats.count >= 2 && (
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: "var(--r-md)",
                      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(13, 17, 23, 0.95) 100%)",
                      border: "1px solid rgba(16, 185, 129, 0.35)",
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--emerald-300)", display: "flex", alignItems: "center", gap: 6 }}>
                        <span>📊</span>
                        <span>{locale === "ur" ? "مارکیٹ پرائس ریڈار" : "Market Price Radar"} ({bidStats.count} {locale === "ur" ? "کوٹیشنز" : "Quotes"})</span>
                      </span>
                      <span style={{ fontSize: "0.76rem", color: "var(--text-3)" }}>
                        {locale === "ur" ? "مارکیٹ اوسط کا تخمینہ" : "Real-time quote spread"}
                      </span>
                    </div>

                    {/* Visual Price Spread */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
                      <div style={{ padding: "8px", borderRadius: "var(--r-sm)", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--emerald-300)", textTransform: "uppercase", fontWeight: 700 }}>
                          {locale === "ur" ? "سب سے کم" : "Lowest Quote"}
                        </div>
                        <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>
                          {pkr(bidStats.min)}
                        </div>
                      </div>
                      <div style={{ padding: "8px", borderRadius: "var(--r-sm)", background: "rgba(139, 92, 246, 0.12)", border: "1px solid rgba(139, 92, 246, 0.25)" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--violet-300)", textTransform: "uppercase", fontWeight: 700 }}>
                          {locale === "ur" ? "اوسط ریٹ" : "Average Rate"}
                        </div>
                        <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>
                          {pkr(bidStats.avg)}
                        </div>
                      </div>
                      <div style={{ padding: "8px", borderRadius: "var(--r-sm)", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--line)" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-3)", textTransform: "uppercase", fontWeight: 700 }}>
                          {locale === "ur" ? "سب سے زیادہ" : "Highest Quote"}
                        </div>
                        <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>
                          {pkr(bidStats.max)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-3)" }}>
                    {locale === "ur" ? "کاریگروں کے ریٹس" : "Received Technician Quotes"} ({bids.length})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setChatCounterpart({
                        name: `Private Inquiries · ${job.area}`,
                        subtitle: "Anonymous discussion thread",
                      });
                      setChatOpen(true);
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: "0.78rem", padding: "4px 8px" }}
                  >
                    💬 {locale === "ur" ? "چیٹ کھولیں" : "Open In-App Chat"}
                  </button>
                </div>

                {/* 2. Quick 1-Tap Sorting Pills */}
                {bids.length > 1 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: "0.74rem", color: "var(--text-3)", marginRight: 2 }}>
                      {locale === "ur" ? "ترتیب:" : "Sort:"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBidSort("lowest")}
                      className={`btn btn-sm ${bidSort === "lowest" ? "btn-primary" : "btn-secondary"}`}
                      style={{ padding: "3px 8px", fontSize: "0.76rem", fontWeight: 700 }}
                    >
                      💰 {locale === "ur" ? "سب سے کم ریٹ" : "Lowest Price"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBidSort("fastest")}
                      className={`btn btn-sm ${bidSort === "fastest" ? "btn-primary" : "btn-secondary"}`}
                      style={{ padding: "3px 8px", fontSize: "0.76rem" }}
                    >
                      ⚡ {locale === "ur" ? "جلد آمد (ETA)" : "Fastest Arrival"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBidSort("rating")}
                      className={`btn btn-sm ${bidSort === "rating" ? "btn-primary" : "btn-secondary"}`}
                      style={{ padding: "3px 8px", fontSize: "0.76rem" }}
                    >
                      ⭐ {locale === "ur" ? "اعلی ریٹنگ" : "Top Rated"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBidSort("newest")}
                      className={`btn btn-sm ${bidSort === "newest" ? "btn-primary" : "btn-secondary"}`}
                      style={{ padding: "3px 8px", fontSize: "0.76rem" }}
                    >
                      🕒 {locale === "ur" ? "تازہ ترین" : "Newest"}
                    </button>
                  </div>
                )}

                {loadingBids ? (
                  <div style={{ padding: 20, textAlign: "center", color: "var(--text-3)", fontSize: "0.85rem" }}>
                    {locale === "ur" ? "لاہور کے کاریگروں سے کوٹیشنز لوڈ ہو رہی ہیں..." : "Loading incoming quotes from Lahore technicians..."}
                  </div>
                ) : bids.length === 0 ? (
                  <div
                    style={{
                      padding: "24px 18px",
                      background: "var(--graphite-2)",
                      borderRadius: "var(--r-md)",
                      border: "1px dashed var(--line-soft)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--violet-soft)", color: "var(--violet-400)", display: "grid", placeItems: "center", margin: "0 auto 10px" }}>
                      📡
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4 }}>
                      {locale === "ur" ? "کاریگروں کی طرف سے کوٹیشنز کا انتظار ہے..." : "Waiting for technician quotes..."}
                    </div>
                    <p style={{ margin: "0 auto 14px", fontSize: "0.82rem", color: "var(--text-3)", maxWidth: 420 }}>
                      {locale === "ur"
                        ? "آپ کی درخواست قریبی کاریگروں کو بھیج دی گئی ہے۔ اوسطاً 10 سے 15 منٹ میں پہلی کوٹیشن موصول ہو جاتی ہے۔"
                        : `Your request was dispatched to available technicians in ${job.area}. Average response time is 10-15 minutes.`}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setChatCounterpart({
                          name: `Private Inquiries · ${job.area}`,
                          subtitle: "Questions from nearby technicians",
                        });
                        setChatOpen(true);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      💬 {locale === "ur" ? "پرائیویٹ انکوائری چیٹ چیک کریں" : "Check Private Inquiries"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {sortedBids.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          padding: 16,
                          background: "var(--graphite-2)",
                          borderRadius: "var(--r-md)",
                          border: "1px solid var(--line)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                                {b.worker_name || "Verified Technician"}
                              </h4>
                              {b.identity_status === "verified" && (
                                <span className="pill pill-ok" style={{ fontSize: "0.72rem", padding: "2px 6px" }}>
                                  ✓ ID Reviewed
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "0.82rem", color: "var(--text-3)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ color: "#f59e0b" }}>★ 4.9</span>
                              <span>·</span>
                              <span>{b.experience_years ? `${b.experience_years} yrs exp` : "Experienced"}</span>
                              <span>·</span>
                              <span>{b.categories.join(", ") || "Technician"}</span>
                            </div>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--emerald-400)", fontFamily: "var(--font-mono)" }}>
                              {pkr(b.amount)}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                              {locale === "ur" ? "مزدوری کی پیشکش" : "Labour offer"}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "8px 0", fontSize: "0.84rem", color: "var(--text-2)" }}>
                          <IconClock size={13} style={{ color: "var(--violet-400)" }} />
                          <span>
                            <strong>{locale === "ur" ? "آمد کا وقت:" : "Arrival:"}</strong> {b.timing_text}
                          </span>
                        </div>

                        {b.message && (
                          <p style={{ margin: "6px 0 12px", fontSize: "0.86rem", color: "var(--text-2)", lineHeight: 1.4, background: "rgba(0,0,0,0.2)", padding: "8px 10px", borderRadius: "var(--r-sm)" }}>
                            &ldquo;{b.message}&rdquo;
                          </p>
                        )}

                        {/* Dual Action Buttons */}
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                          <button
                            type="button"
                            onClick={() => {
                              setChatCounterpart({
                                name: b.worker_name || "Verified Technician",
                                subtitle: `${b.categories.join(", ") || "Technician"} · Quote: ${pkr(b.amount)}`,
                                amount: b.amount,
                              });
                              setChatOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: "1 1 140px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                          >
                            <span>💬</span>
                            <span>{locale === "ur" ? "پرائیویٹ چیٹ (پوشیدہ فون)" : "Private Chat (Anonymous)"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setHireModalData({
                                bidId: b.id,
                                workerName: b.worker_name || "this technician",
                                amount: b.amount,
                                timingText: b.timing_text,
                              });
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ flex: "1 1 140px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                          >
                            <IconCheck size={14} />
                            <span>{locale === "ur" ? "قبول کریں اور ہائر کریں" : "Accept & Hire"}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : isServiceRequest && user?.is_worker ? (
            /* ============================================================== */
            /* 2. TECHNICIAN FAST 1-CLICK BIDDING & CHAT                      */
            /* ============================================================== */
            <div style={{ padding: 18, background: "var(--graphite-2)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h4 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "1.1rem" }}>
                  {locale === "ur" ? "فوری ریٹ کوٹیشن بھیجیں (کاریگر)" : "Fast Labour Counter-Bid (InDrive Style)"}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setChatCounterpart({
                      name: `Customer (${job.area})`,
                      subtitle: `Job: ${job.title}`,
                    });
                    setChatOpen(true);
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: "0.78rem" }}
                >
                  💬 {locale === "ur" ? "پہلے سوال پوچھیں" : "Chat with Customer"}
                </button>
              </div>

              {bidSuccess ? (
                <div style={{ padding: 14, background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--ok)", borderRadius: "var(--r-sm)", color: "var(--ok)", fontWeight: 600, fontSize: "0.9rem" }}>
                  {locale === "ur"
                    ? `✓ آپ کی ${pkr(Number(bidAmount))} کی کوٹیشن گاہک کو بھیج دی گئی ہے! وہ ریٹس کا موازنہ کر کے آپ سے چیٹ کر سکتے ہیں۔`
                    : `✓ Your quote of ${pkr(Number(bidAmount))} has been sent to the customer! They can compare bids and chat privately with you.`}
                </div>
              ) : (
                <>
                  {/* InDrive-style Live Market Spread Guidance */}
                  {job.bid_count > 0 && job.min_bid && job.max_bid ? (
                    <div
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--r-sm)",
                        background: "rgba(139, 92, 246, 0.08)",
                        border: "1px solid var(--violet-line)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "1.2rem" }}>📊</span>
                        <div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--violet-300)" }}>
                            {locale === "ur" ? "مارکیٹ ریٹ گائیڈنس (InDrive Style)" : "Live Market Rate Guidance (InDrive Style)"}
                          </div>
                          <div style={{ fontSize: "0.82rem", color: "var(--text-2)" }}>
                            {job.min_bid === job.max_bid
                              ? `${locale === "ur" ? "موجودہ کوٹیشن:" : "Current quote on this job:"} ${pkr(job.min_bid)}`
                              : `${locale === "ur" ? "دیگر کاریگروں کے ریٹس:" : "Current quotes range between"} ${pkr(job.min_bid)} – ${pkr(job.max_bid)} (${job.bid_count} ${locale === "ur" ? "کوٹیشنز" : "quotes"})`}
                          </div>
                        </div>
                      </div>
                      <span className="pill pill-violet" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                        {locale === "ur" ? "گمنام ریٹ" : "Anonymous Spread"}
                      </span>
                    </div>
                  ) : job.bid_count === 0 ? (
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "var(--r-sm)",
                        background: "rgba(16, 185, 129, 0.08)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        fontSize: "0.82rem",
                        color: "var(--emerald-300)",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 12,
                      }}
                    >
                      <span>⚡</span>
                      <span>
                        {locale === "ur"
                          ? "اس کام پر ابھی تک کوئی ریٹ نہیں آیا۔ پہلا ریٹ بھیج کر گاہک کی ترجیح حاصل کریں!"
                          : "Be the first technician to quote on this request and get immediate attention!"}
                      </span>
                    </div>
                  ) : null}

                  <form onSubmit={handleBidSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Custom PKR Price input + Quick chips */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)" }}>
                        {locale === "ur" ? "اپنی مرضی کا ریٹ درج کریں یا منتخب کریں (PKR):" : "Your Labour Quote (PKR) — Enter custom price or pick a chip:"}
                      </label>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                        {locale === "ur" ? "کسٹمر کو صرف یہ رقم نظر آئے گی" : "Whole rupees only"}
                      </span>
                    </div>

                    <div style={{ position: "relative", marginBottom: 8 }}>
                      <span style={{ position: "absolute", insetInlineStart: 12, top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "var(--emerald-400)", fontSize: "0.95rem" }}>
                        {locale === "ur" ? "روپے" : "Rs."}
                      </span>
                      <input
                        type="number"
                        placeholder={locale === "ur" ? "اپنی مرضی کی رقم درج کریں مثلاً 2,750" : "Enter any custom amount e.g. 2,750"}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", paddingInlineStart: 46, paddingInlineEnd: 12, borderRadius: "var(--r-sm)", border: "1px solid var(--violet-line)", background: "var(--graphite-1)", fontSize: "1rem", fontWeight: 700, color: "#FFFFFF" }}
                        required
                      />
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "0.74rem", color: "var(--text-3)", marginRight: 2 }}>
                        {locale === "ur" ? "فوری انتخاب:" : "Quick chips:"}
                      </span>
                      {quickPricePills.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setBidAmount(String(p))}
                          className={`btn btn-sm ${bidAmount === String(p) ? "btn-primary" : "btn-secondary"}`}
                          style={{ padding: "4px 10px", fontSize: "0.78rem", fontWeight: 700 }}
                        >
                          {locale === "ur" ? `${p.toLocaleString()} روپے` : `Rs. ${p.toLocaleString()}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom timing input + Quick chips */}
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)", display: "block", marginBottom: 6 }}>
                      {locale === "ur" ? "پہنچنے کا وقت (Custom Timing):" : "Expected Arrival Time — Custom schedule or pick a chip:"}
                    </label>

                    <input
                      type="text"
                      placeholder={locale === "ur" ? "مثلاً: 25 منٹ میں / آج شام 5:30 بجے سامان سمیت" : "e.g. Within 25 mins / Today 5:30 PM with tools"}
                      value={bidTiming}
                      onChange={(e) => setBidTiming(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-1)", fontSize: "0.88rem", marginBottom: 8 }}
                      required
                    />

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "0.74rem", color: "var(--text-3)", marginRight: 2 }}>
                        {locale === "ur" ? "فوری وقت:" : "Quick ETA:"}
                      </span>
                      {quickTimingPills.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setBidTiming(t)}
                          className={`btn btn-sm ${bidTiming === t ? "btn-primary" : "btn-secondary"}`}
                          style={{ padding: "4px 10px", fontSize: "0.76rem" }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Short Note */}
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                      {locale === "ur" ? "مختصر نوٹ / اوزار:" : "Technician Note (Optional):"}
                    </label>
                    <input
                      type="text"
                      placeholder={locale === "ur" ? "مثلاً: پائپ ویلڈنگ مشین اور ضروری اوزار ساتھ موجود ہیں" : "e.g. Master plumber with pipe welding machine ready"}
                      value={bidNote}
                      onChange={(e) => setBidNote(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-1)", fontSize: "0.88rem" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                    <button type="submit" className="btn btn-primary" disabled={submittingBid} style={{ flex: 1 }}>
                      <IconSend size={15} />
                      <span>
                        {submittingBid
                          ? (locale === "ur" ? "کوٹیشن بھیجی جا رہی ہے..." : "Sending Counter-Bid...")
                          : (locale === "ur" ? `${pkr(Number(bidAmount) || 0)} کا کوٹ بھیجیں` : `Send Quote for ${pkr(Number(bidAmount) || 0)}`)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setChatCounterpart({
                          name: `Customer (${job.area})`,
                          subtitle: `Job: ${job.title}`,
                        });
                        setChatOpen(true);
                      }}
                      className="btn btn-secondary"
                    >
                      <span>💬 {locale === "ur" ? "پرائیویٹ چیٹ کریں" : "Chat Privately"}</span>
                    </button>
                  </div>
                </form>
                </>
              )}
            </div>
          ) : (
            /* ============================================================== */
            /* 3. GENERAL INQUIRY / NON-WORKER GUEST FORM                     */
            /* ============================================================== */
            <div style={{ padding: 16, background: "var(--graphite-2)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "1.05rem" }}>
                  {locale === "ur" ? "پرائیویٹ انکوائری یا سوال بھیجیں" : "Private Inquiry & Questions"}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setChatCounterpart({
                      name: `Customer (${job.area})`,
                      subtitle: `Job: ${job.title}`,
                    });
                    setChatOpen(true);
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: "0.78rem" }}
                >
                  {locale === "ur" ? "💬 لائیو چیٹ کھولیں" : "💬 Open Live Chat"}
                </button>
              </div>

              {inquirySuccess ? (
                <div style={{ color: "var(--ok)", fontWeight: 600, fontSize: "0.9rem" }}>
                  {locale === "ur"
                    ? "✓ آپ کا پیغام بھیج دیا گیا ہے۔ وہ پرائیویٹ چیٹ میں جائزہ لے کر جواب دے سکتے ہیں۔"
                    : "✓ Your inquiry has been sent to the poster. They can review and reply in private chat."}
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                      {locale === "ur" ? "آپ کا پیغام" : "Your Message"}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={
                        locale === "ur"
                          ? "کیا آپ مسئلے کے بارے میں مزید بتا سکتے ہیں؟ کیا آج کا وقت طے ہو سکتا ہے؟"
                          : "Can you share more details about the issue? Can we schedule today?"
                      }
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", fontSize: "0.9rem", background: "var(--graphite-1)" }}
                      required
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                        {locale === "ur" ? "پیشکش کی رقم (اختیاری)" : "Offer Price (PKR, optional)"}
                      </label>
                      <input
                        type="number"
                        placeholder={locale === "ur" ? "مثلاً: 1500" : "e.g. 1500"}
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-1)" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                        {locale === "ur" ? "آپ کا رابطہ نمبر (لاہور)" : "Your Contact Phone (Lahore)"}
                      </label>
                      <input
                        type="tel"
                        placeholder="0300 1234567"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-1)" }}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={submittingInquiry} style={{ marginTop: 4 }}>
                    <IconSend size={14} />
                    <span>
                      {submittingInquiry
                        ? (locale === "ur" ? "بھیج رہے ہیں..." : "Sending...")
                        : (locale === "ur" ? "پرائیویٹ پیغام بھیجیں" : "Send Private Inquiry")}
                    </span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </Dialog>

      {/* Embedded Anonymous In-App Chatroom Modal */}
      {chatOpen && (
        <InAppChatModal
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
          area={job.area}
          isCustomer={isOwn}
          counterpartName={chatCounterpart?.name}
          counterpartSubtitle={chatCounterpart?.subtitle}
          quotedAmount={chatCounterpart?.amount}
          onAcceptQuote={() => {
            setChatOpen(false);
            const matchingBid = bids.find((b) => b.worker_name === chatCounterpart?.name || b.amount === chatCounterpart?.amount);
            if (matchingBid) {
              setHireModalData({
                bidId: matchingBid.id,
                workerName: matchingBid.worker_name || "this technician",
                amount: matchingBid.amount,
                timingText: matchingBid.timing_text,
              });
            }
          }}
          user={user}
        />
      )}

      {/* Embedded Hire Modal */}
      {hireModalData && (
        <HireModal
          open={Boolean(hireModalData)}
          onClose={() => setHireModalData(null)}
          jobId={job.id}
          bidId={hireModalData.bidId}
          workerName={hireModalData.workerName}
          amount={hireModalData.amount}
          timingText={hireModalData.timingText}
          onSuccess={() => {
            setHireModalData(null);
            onBidSent("Technician hired successfully! Address revealed and booking active.");
            onClose();
          }}
        />
      )}
    </>
  );
}
