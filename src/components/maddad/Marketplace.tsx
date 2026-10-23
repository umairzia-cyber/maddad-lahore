"use client";

import Link from "next/link";
import Image from "next/image";
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

export function CategoryIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const s = slug.toLowerCase();
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
    { slug: "home-repairs", en: "Home Repairs & Handyman", ur: "گھریلو مرمت و ہینڈی مین", icon: "🛠️" },
    { slug: "plumbing", en: "Plumbing & Sanitary", ur: "پلمبنگ و سینیٹری", icon: "🚿" },
    { slug: "electrical", en: "Electrical & Wiring", ur: "الیکٹریکل و وائرنگ", icon: "⚡" },
    { slug: "appliances", en: "AC & Appliances", ur: "اے سی و ہوم اپلائنسز", icon: "❄️" },
    { slug: "carpentry", en: "Carpentry & Woodwork", ur: "کارپینٹری و فرنیچر مرمت", icon: "🪚" },
    { slug: "painting", en: "Painting & Renovation", ur: "پینٹنگ و تزئین", icon: "🎨" },
    { slug: "jobs-work", en: "Skilled Gigs & Jobs", ur: "ہنر مند کام و جابز", icon: "👔" },
  ];

  return (
    <section className={`hero ${compact ? "hero-compact" : ""}`} aria-labelledby="hero-title">
      <div className="hero-split">
        {/* Left: Copy & Actions */}
        <div className="hero-copy">
          <span className="hero-eyebrow">
            {locale === "ur" ? "لاہور لوکل سروسز مارکیٹ پلیس" : "Lahore Local Services Marketplace"}
          </span>

          <h1 id="hero-title" className="hero-title">
            {locale === "ur"
              ? "لاہور میں ماہر پلمبر، الیکٹریشن یا کسی سروس کی ضرورت ہے؟"
              : "Need a repair, technician, or trusted service in Lahore?"}
          </h1>

          {!compact && (
            <p className="hero-lead">
              {locale === "ur"
                ? "چند منٹوں میں سروس کی درخواست دیں: گھریلو مرمت کروائیں، پلمبر، الیکٹریشن یا اے سی ٹیکنیشن بلوائیں، یا اپنی سروس پیش کر کے لاہور میں کام حاصل کریں — بغیر کسی کمیشن کے۔"
                : "Request home repairs, hire independent technicians and service providers, or find skilled work across 20+ Lahore neighbourhoods with zero commission."}
            </p>
          )}

          {/* Action Buttons */}
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onPost()}
            >
              <IconPlus size={18} aria-hidden="true" />
              <span>{locale === "ur" ? "سروس کی درخواست دیں (مفت)" : "Request a Service / Post Job"}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onJoin}
            >
              <IconBriefcase size={16} aria-hidden="true" />
              <span>{user?.is_worker ? (locale === "ur" ? "ٹیکنیشن پورٹل" : "Technician Portal") : (locale === "ur" ? "سروس پیش کریں / کام تلاش کریں" : "Offer a Service / Find Work")}</span>
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
              onClick={() => onPost(cat.slug)}
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
    { id: "all", labelEn: "All Services", labelUr: "تمام سروسز" },
    { id: "service_request", labelEn: "🛠️ Services Needed (Hire)", labelUr: "🛠️ کاریگر کی ضرورت" },
    { id: "service_offer", labelEn: "👨‍🔧 Services Offered (Find Providers)", labelUr: "👨‍🔧 سروس کی پیشکش" },
    { id: "job_opportunity", labelEn: "💼 Service Jobs & Gigs", labelUr: "💼 ملازمت اور روزگار" },
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
          <IconSearch size={16} style={{ position: "absolute", left: 12, color: "var(--text-3)", pointerEvents: "none" }} />
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
            <span>· Posted {fmtDate(job.created_at)}</span>
            <span className="pill pill-ok" style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <IconClock size={11} />
              <span>24h Reverse Auction</span>
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
              <strong>Location Privacy:</strong> Exact house address is strictly private. Only the neighborhood ({job.area}) is public until you hire a technician.
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

                {loadingBids ? (
                  <div style={{ padding: 20, textAlign: "center", color: "var(--text-3)", fontSize: "0.85rem" }}>
                    Loading incoming quotes from Lahore technicians...
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
                    {bids.map((b) => (
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
                            <strong>Arrival:</strong> {b.timing_text}
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
                  ✓ Your quote of {pkr(Number(bidAmount))} has been sent to the customer! They can compare bids and chat privately with you.
                </div>
              ) : (
                <form onSubmit={handleBidSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Quick PKR price chips */}
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 6 }}>
                      {locale === "ur" ? "مزدوری کی رقم منتخب کریں (PKR):" : "1-Click Labour Quote (PKR):"}
                    </label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      {quickPricePills.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setBidAmount(String(p))}
                          className={`btn btn-sm ${bidAmount === String(p) ? "btn-primary" : "btn-secondary"}`}
                          style={{ padding: "6px 12px", fontSize: "0.82rem", fontWeight: 700 }}
                        >
                          Rs. {p.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      placeholder="Or enter custom amount e.g. 2500"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-1)", fontSize: "0.9rem" }}
                      required
                    />
                  </div>

                  {/* Quick timing chips */}
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 6 }}>
                      {locale === "ur" ? "پہنچنے کا وقت منتخب کریں:" : "Expected Arrival Timing:"}
                    </label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      {quickTimingPills.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setBidTiming(t)}
                          className={`btn btn-sm ${bidTiming === t ? "btn-primary" : "btn-secondary"}`}
                          style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. In 40 mins / Today 5 PM"
                      value={bidTiming}
                      onChange={(e) => setBidTiming(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-1)", fontSize: "0.88rem" }}
                      required
                    />
                  </div>

                  {/* Short Note */}
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                      {locale === "ur" ? "مختصر نوٹ / اوزار:" : "Technician Note (Optional):"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Master plumber with pipe welding machine ready"
                      value={bidNote}
                      onChange={(e) => setBidNote(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-1)", fontSize: "0.88rem" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                    <button type="submit" className="btn btn-primary" disabled={submittingBid} style={{ flex: 1 }}>
                      <IconSend size={15} />
                      <span>{submittingBid ? "Sending Counter-Bid..." : `Send Quote for ${pkr(Number(bidAmount) || 0)}`}</span>
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
                      <span>💬 Chat Privately</span>
                    </button>
                  </div>
                </form>
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
                  💬 Open Live Chat
                </button>
              </div>

              {inquirySuccess ? (
                <div style={{ color: "var(--ok)", fontWeight: 600, fontSize: "0.9rem" }}>
                  ✓ Your inquiry has been sent to the poster. They can review and reply in private chat.
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                      Your Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Can you share more details about the issue? Can we schedule today?"
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", fontSize: "0.9rem", background: "var(--graphite-1)" }}
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
                        placeholder="e.g. 1500"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-1)" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", display: "block", marginBottom: 4 }}>
                        Your Contact Phone (Lahore)
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
                    <span>{submittingInquiry ? "Sending..." : "Send Private Inquiry"}</span>
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
