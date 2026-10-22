"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
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
  IconSmartphone,
  IconCar,
  IconHome,
  IconGraduationCap,
  IconBriefcase,
} from "../icons";
import { submitBidAction, submitInquiryAction } from "@/app/actions";
import type { AppUser, AreaOption, PublicJobItem } from "./types";
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

export function CategoryIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const s = slug.toLowerCase();
  if (s.includes("plumb")) return <IconWrench size={size} aria-hidden="true" />;
  if (s.includes("electr") && !s.includes("mob")) return <IconZap size={size} aria-hidden="true" />;
  if (s.includes("phone") || s.includes("electr") || s.includes("mobile")) return <IconSmartphone size={size} aria-hidden="true" />;
  if (s.includes("vehic") || s.includes("car") || s.includes("bike")) return <IconCar size={size} aria-hidden="true" />;
  if (s.includes("furn") || s.includes("home")) return <IconHome size={size} aria-hidden="true" />;
  if (s.includes("tutor") || s.includes("edu")) return <IconGraduationCap size={size} aria-hidden="true" />;
  if (s.includes("job") || s.includes("hir")) return <IconBriefcase size={size} aria-hidden="true" />;
  return <IconTag size={size} aria-hidden="true" />;
}

export function ListingTypePill({ type }: { type?: string | null }) {
  const t = type || "service_request";
  if (t === "item_sale") {
    return (
      <span className="pill pill-amber" style={{ fontWeight: 700, fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <IconTag size={12} aria-hidden="true" />
        <span>For Sale</span>
      </span>
    );
  }
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
        <span>Hiring</span>
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
}: {
  user: AppUser | null;
  realOpenCount: number;
  sampleCount: number;
  onPost: (category?: any) => void;
  onJoin: () => void;
  compact: boolean;
}) {
  const { locale } = useI18n();

  const curatedCategories = [
    { slug: "electronics", en: "Electronics & Mobiles", ur: "الیکٹرانکس و فون", icon: "📱" },
    { slug: "plumbing", en: "Home Repairs & Trades", ur: "پلمبنگ و مرمت", icon: "🛠️" },
    { slug: "vehicles", en: "Vehicles & Parts", ur: "گاڑیاں و موٹر سائیکل", icon: "🚗" },
    { slug: "furniture", en: "Furniture & Home", ur: "فرنیچر و ہوم سامان", icon: "🛋️" },
    { slug: "services", en: "Freelance & Services", ur: "سروسز و کاریگر", icon: "💼" },
    { slug: "jobs", en: "Local Jobs & Hiring", ur: "ملازمتیں و روزگار", icon: "👔" },
    { slug: "education", en: "Tutors & Lessons", ur: "ٹیوشن و تعلیم", icon: "📚" },
  ];

  return (
    <section className="hero" aria-labelledby="hero-title" style={{ padding: "clamp(28px, 4vw, 56px) 0 20px" }}>
      <div style={{ maxWidth: "var(--content-w)", margin: "0 auto", width: "100%" }}>
        <div style={{ maxWidth: 860 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: "var(--r-pill)", background: "var(--violet-soft)", border: "1px solid var(--violet-line)", marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--violet-500)" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--violet-600)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {locale === "ur" ? "لاہور لوکل کلاسیفائیڈز اور سروسز" : "Lahore Local Classifieds & Services"}
            </span>
          </div>

          <h1 id="hero-title" style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-hero)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.015em", color: "var(--text)", margin: "0 0 16px" }}>
            {locale === "ur"
              ? "لاہور کی مقامی اشیاء، ماہر کاریگر اور قابل اعتماد سروسز۔"
              : "Lahore’s local classifieds, trusted trades, and neighbourhood work."}
          </h1>

          <p style={{ fontSize: "clamp(1.05rem, 1.2vw, 1.22rem)", lineHeight: 1.6, color: "var(--text-2)", maxWidth: 740, margin: "0 0 28px" }}>
            {locale === "ur"
              ? "چند منٹوں میں اپنا اشتہار لگائیں: استعمال شدہ اشیاء فروخت کریں، پلمبر یا الیکٹریشن بلوائیں، اپنی پیشہ ورانہ سروس پیش کریں، یا لاہور کے 20 سے زائد علاقوں میں لوکل ملازمین تلاش کریں۔"
              : "Buy and sell second-hand goods, request home repairs, hire independent service providers, or discover local work across 20+ Lahore neighbourhoods with zero commission."}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 32 }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onPost()}
              style={{ padding: "12px 24px", fontSize: "1rem" }}
            >
              <IconPlus size={18} aria-hidden="true" />
              <span>{locale === "ur" ? "نیا اشتہار لگائیں (مفت)" : "Post an Ad (Free)"}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onJoin}
              style={{ padding: "12px 22px", fontSize: "1rem" }}
            >
              <IconBriefcase size={17} aria-hidden="true" />
              <span>{user?.is_worker ? (locale === "ur" ? "پرووائیڈر پورٹل" : "Provider Portal") : (locale === "ur" ? "سروس پیش کریں" : "Offer a Service / Job")}</span>
            </button>
          </div>
        </div>

        {/* Directory Category Strip */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20, marginTop: 8 }}>
          <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-3)", fontWeight: 700, marginBottom: 12 }}>
            {locale === "ur" ? "مشہور کیٹیگریز" : "Browse by Category"}
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
            {curatedCategories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onPost(cat.slug)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  borderRadius: "var(--r-sm)",
                  background: "#FFFFFF",
                  border: "1px solid var(--line)",
                  boxShadow: "var(--sh-1)",
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
      </div>
    </section>
  );
}

export function HowItWorks() {
  return null;
}

export function TrustPanel({ onOpenReport }: { onOpenReport: () => void }) {
  const { locale } = useI18n();

  return (
    <section className="card" style={{ padding: "clamp(24px, 3vw, 36px)", background: "#FFFFFF", borderRadius: "var(--r-md)", border: "1px solid var(--line)", marginTop: 24 }}>
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
        background: "#FFFFFF",
        borderRadius: "var(--r-md)",
        border: "1px solid var(--line)",
        boxShadow: "var(--sh-1)",
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
}: {
  jobs: PublicJobItem[];
  areas: AreaOption[];
  user: AppUser | null;
  ownJobIds: Set<string>;
  onOpenJob: (j: PublicJobItem) => void;
  onPost?: (cat?: any) => void;
}) {
  const { locale } = useI18n();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [q, setQ] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);

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
    { id: "all", labelEn: "All Listings", labelUr: "تمام اشتہارات" },
    { id: "item_sale", labelEn: "🏷️ Items for Sale", labelUr: "🏷️ سامان برائے فروخت" },
    { id: "service_request", labelEn: "🛠️ Services Needed", labelUr: "🛠️ کاریگر کی ضرورت" },
    { id: "service_offer", labelEn: "👨‍🔧 Services Offered", labelUr: "👨‍🔧 سروس کی پیشکش" },
    { id: "job_opportunity", labelEn: "💼 Jobs & Hiring", labelUr: "💼 ملازمت اور روزگار" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
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
                background: active ? "var(--violet-500)" : "#FFFFFF",
                color: active ? "#FFFFFF" : "var(--text-2)",
                border: active ? "1px solid var(--violet-600)" : "1px solid var(--line)",
                boxShadow: active ? "0 2px 6px rgba(68,85,60,0.2)" : "var(--sh-1)",
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
      <div style={{ padding: "16px", background: "#FFFFFF", borderRadius: "var(--r-md)", border: "1px solid var(--line)", boxShadow: "var(--sh-1)", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 280px", position: "relative", display: "flex", alignItems: "center" }}>
          <IconSearch size={16} style={{ position: "absolute", left: 12, color: "var(--text-3)", pointerEvents: "none" }} />
          <input
            type="search"
            placeholder={
              locale === "ur"
                ? "لاہور میں اشیاء، سروسز یا نوکریاں تلاش کریں..."
                : "Search Lahore items, services, technicians, jobs..."
            }
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 38px",
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
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid count header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>
          {filtered.length} {locale === "ur" ? "اشتہارات لاہور میں" : "listings found across Lahore"}
        </div>
      </div>

      {/* Listings Grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center", background: "#FFFFFF", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: "50%", background: "var(--violet-soft)", color: "var(--violet-500)", display: "grid", placeItems: "center" }}>
            <IconSearch size={22} />
          </div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", margin: "0 0 8px" }}>
            {locale === "ur" ? "کوئی اشتہار نہیں ملا" : "No listings match your search"}
          </h3>
          <p style={{ color: "var(--text-3)", fontSize: "0.92rem", margin: "0 0 20px" }}>
            {locale === "ur" ? "فلٹرز تبدیل کر کے دوبارہ کوشش کریں یا نیا اشتہار لگائیں۔" : "Try resetting your search query or neighborhood filter."}
          </p>
          {onPost && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onPost()}>
              <IconPlus size={16} />
              <span>{locale === "ur" ? "نیا اشتہار لگائیں" : "Post a New Ad"}</span>
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
  const [tab, setTab] = useState<"details" | "contact">("details");

  // State for inquiry
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [senderPhone, setSenderPhone] = useState(user?.phone || "");
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // State for technician bidding
  const [bidAmount, setBidAmount] = useState("");
  const [bidTiming, setBidTiming] = useState("");
  const [bidNote, setBidNote] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setInquiryMsg("");
    setOfferPrice("");
    setInquirySuccess(false);
    setBidSuccess(false);
    setErrorMessage(null);
    setTab("details");
  }, [job?.id]);

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

  return (
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
          <span>· Posted {fmtDate(job.created_at)}</span>
          {job.item_condition && (
            <span className="pill pill-ok" style={{ fontSize: "0.75rem" }}>
              Condition: {job.item_condition}
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <div style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-3)", fontWeight: 700, marginBottom: 6 }}>
            Description &amp; Details
          </div>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text)", whiteSpace: "pre-line" }}>
            {job.description}
          </p>
        </div>

        {/* Privacy Shield Notice */}
        <div style={{ padding: "12px 16px", background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)", display: "flex", alignItems: "center", gap: 10 }}>
          <IconLock size={16} style={{ color: "var(--violet-500)", flexShrink: 0 }} />
          <span style={{ fontSize: "0.82rem", color: "var(--text-2)" }}>
            <strong>Location Privacy:</strong> Exact street address and house numbers are strictly protected and only shared upon confirmed mutual agreement.
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
          <div style={{ padding: 14, background: "var(--graphite-2)", borderRadius: "var(--r-sm)", textAlign: "center", fontSize: "0.88rem", color: "var(--text-2)" }}>
            This is your own listing. You can review incoming inquiries and quotes in your dashboard.
          </div>
        ) : isServiceRequest && user?.is_worker ? (
          /* Technician Quoting Form */
          <div style={{ padding: 16, background: "var(--graphite-2)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
            <h4 style={{ margin: "0 0 12px", fontFamily: "var(--font-serif)", fontSize: "1.05rem" }}>
              Submit a Labour Quote (Technician)
            </h4>
            {bidSuccess ? (
              <div style={{ color: "var(--ok)", fontWeight: 600, fontSize: "0.9rem" }}>
                ✓ Your quote has been submitted. The customer can compare bids and contact you directly.
              </div>
            ) : (
              <form onSubmit={handleBidSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                      Labour Amount (PKR)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                      Arrival Timing
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. In 45 mins / Today 4 PM"
                      value={bidTiming}
                      onChange={(e) => setBidTiming(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                    Short Note / Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 yrs experience with motor & geyser repair in Lahore"
                    value={bidNote}
                    onChange={(e) => setBidNote(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submittingBid} style={{ marginTop: 4 }}>
                  <IconSend size={14} />
                  <span>{submittingBid ? "Sending..." : "Send Quote to Customer"}</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          /* General Inquiry & Offer Form for Items, Services, Jobs */
          <div style={{ padding: 16, background: "var(--graphite-2)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
            <h4 style={{ margin: "0 0 12px", fontFamily: "var(--font-serif)", fontSize: "1.05rem" }}>
              Send Inquiry or Price Offer
            </h4>
            {inquirySuccess ? (
              <div style={{ color: "var(--ok)", fontWeight: 600, fontSize: "0.9rem" }}>
                ✓ Your inquiry has been sent to the poster. They will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                    Your Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Is this still available? Can we meet in Gulberg today?"
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", fontSize: "0.9rem" }}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                      Offer Price (PKR, optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 22000"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                      Contact Mobile (Lahore)
                    </label>
                    <input
                      type="tel"
                      placeholder="0300 1234567"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submittingInquiry} style={{ marginTop: 4 }}>
                  <IconSend size={14} />
                  <span>{submittingInquiry ? "Sending..." : "Send Inquiry to Poster"}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}
