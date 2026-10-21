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
  IconStar,
} from "../icons";
import { submitBidAction } from "@/app/actions";
import type { AppUser, AreaOption, PublicJobItem } from "./types";
import {
  DemoBadge,
  Dialog,
  EmptyState,
  Field,
  StatusBadge,
  budgetLabel,
  fmtDate,
  fmtDateTime,
  plural,
  whenLabel,
  pkr,
} from "./shared";
import { useI18n } from "./I18nContext";
import { ReportModal } from "./ReportModal";

export function TradeIcon({ category, size = 18 }: { category: string; size?: number }) {
  return category.toLowerCase() === "plumbing" ? (
    <IconWrench size={size} aria-hidden="true" />
  ) : (
    <IconZap size={size} aria-hidden="true" />
  );
}

/* ---------------------------------------------------------------- */
/* HERO SECTION                                                     */
/* Centered on: "I need a plumber or electrician. What do I do next?" */
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
  onPost: (category?: "plumbing" | "electrical") => void;
  onJoin: () => void;
  compact: boolean;
}) {
  const { t, locale, toggleLocale } = useI18n();

  return (
    <section className={`hero ${compact ? "hero-compact" : ""}`} aria-labelledby="hero-title" style={{ position: "relative" }}>
      <div className="hero-copy" style={{ maxWidth: 840 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          <span className="hero-eyebrow" style={{ color: "var(--emerald-400)", fontWeight: 800 }}>
            {t("hero.eyebrow")}
          </span>
          <button
            type="button"
            onClick={toggleLocale}
            className="lang-switcher-btn"
            aria-label="Switch language / زبان تبدیل کریں"
          >
            <span>{locale === "ur" ? "English" : "اردو"}</span>
          </button>
        </div>

        <h1 id="hero-title" className="hero-title" style={{ fontSize: compact ? "clamp(1.6rem, 1.2rem + 1.6vw, 2.2rem)" : "clamp(2rem, 1.4rem + 2.2vw, 2.9rem)", lineHeight: 1.25 }}>
          {t("hero.title")}
        </h1>

        {!compact && (
          <p className="hero-lead" style={{ fontSize: "1.08rem", color: "var(--text-2)", maxWidth: 680, marginTop: 12, lineHeight: 1.6 }}>
            {t("hero.subtitle")}
          </p>
        )}

        {/* Large 2-Trade Service Choices */}
        {!compact && (
          <div className="service-choices-grid" style={{ marginBlock: "24px 20px" }}>
            <div
              className="service-choice-card"
              role="button"
              tabIndex={0}
              onClick={() => onPost("plumbing")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onPost("plumbing");
              }}
              aria-label="Request plumbing help in Lahore"
            >
              <div className="service-choice-icon">
                <IconWrench size={26} aria-hidden="true" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
                    {t("cat.plumbing_title")}
                  </h3>
                  <span className="pill pill-ok" style={{ fontSize: "0.72rem" }}>
                    {locale === "ur" ? "لاہور پلمبر" : "Lahore"}
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", color: "var(--text-2)", fontSize: "0.88rem", lineHeight: 1.4 }}>
                  {t("cat.plumbing_desc")}
                </p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, color: "var(--emerald-400)", fontWeight: 700, fontSize: "0.85rem" }}>
                  {locale === "ur" ? "پلمبر تلاش کریں ←" : "Find a plumber →"}
                </span>
              </div>
            </div>

            <div
              className="service-choice-card electrical"
              role="button"
              tabIndex={0}
              onClick={() => onPost("electrical")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onPost("electrical");
              }}
              aria-label="Request electrical help in Lahore"
            >
              <div className="service-choice-icon">
                <IconZap size={26} aria-hidden="true" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
                    {t("cat.electrical_title")}
                  </h3>
                  <span className="pill pill-warn" style={{ fontSize: "0.72rem" }}>
                    {locale === "ur" ? "لاہور الیکٹریشن" : "Lahore"}
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", color: "var(--text-2)", fontSize: "0.88rem", lineHeight: 1.4 }}>
                  {t("cat.electrical_desc")}
                </p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, color: "var(--amber-400)", fontWeight: 700, fontSize: "0.85rem" }}>
                  {locale === "ur" ? "الیکٹریشن تلاش کریں ←" : "Find an electrician →"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="hero-actions" style={{ gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => onPost()}
            style={{ padding: "14px 28px", fontSize: "1.05rem", fontWeight: 700 }}
          >
            <IconPlus size={20} aria-hidden="true" />
            <span>{t("hero.cta_post")}</span>
          </button>
          <button
            type="button"
            className="btn btn-lg"
            onClick={onJoin}
            style={{ padding: "14px 24px", fontSize: "0.95rem" }}
          >
            <IconWrench size={18} aria-hidden="true" />
            <span>{user?.is_worker ? t("nav.technician_portal") : t("hero.cta_worker")}</span>
          </button>
        </div>

        {/* Reassurance Callouts */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-2)", fontWeight: 600, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span>{t("hero.perks")}</span>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
              padding: "8px 14px",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "var(--r-sm)",
              fontSize: "0.84rem",
              color: "var(--emerald-300)",
            }}
          >
            <IconLock size={15} aria-hidden="true" style={{ flexShrink: 0 }} />
            <span>
              <strong>{t("hero.privacy_badge")}</strong> {t("hero.privacy_sub")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* HOW IT WORKS (3 CLEAR STEPS)                                     */
/* ---------------------------------------------------------------- */
export function HowItWorks() {
  const { t } = useI18n();

  const steps = [
    {
      num: "1",
      title: t("hiw.step1_title"),
      desc: t("hiw.step1_desc"),
    },
    {
      num: "2",
      title: t("hiw.step2_title"),
      desc: t("hiw.step2_desc"),
    },
    {
      num: "3",
      title: t("hiw.step3_title"),
      desc: t("hiw.step3_desc"),
    },
  ];

  return (
    <section aria-labelledby="how-title" style={{ marginBlock: 24 }}>
      <h2 id="how-title" style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 16px" }}>
        {t("hiw.title")}
      </h2>
      <div className="steps-grid">
        {steps.map((s) => (
          <div key={s.num} className="step-card">
            <span className="step-number-badge" aria-hidden="true">
              {s.num}
            </span>
            <h3 style={{ margin: "0 0 8px", fontSize: "1.05rem", fontWeight: 800 }}>
              {s.title}
            </h3>
            <p style={{ margin: 0, color: "var(--text-2)", fontSize: "0.88rem", lineHeight: 1.5 }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* PROACTIVE TRUST & SAFETY PANEL                                   */
/* 4 explicit verification levels, privacy, and reporting           */
/* ---------------------------------------------------------------- */
export function TrustPanel({ onOpenReport }: { onOpenReport: () => void }) {
  const { t, locale } = useI18n();

  const levels = [
    {
      badge: "📱 " + t("trust.phone_title"),
      desc: t("trust.phone_desc"),
    },
    {
      badge: "🪪 " + t("trust.id_title"),
      desc: t("trust.id_desc"),
    },
    {
      badge: "🔧 " + t("trust.skills_title"),
      desc: t("trust.skills_desc"),
    },
    {
      badge: "⭐ " + t("trust.reviews_title"),
      desc: t("trust.reviews_desc"),
    },
  ];

  return (
    <section
      className="plate"
      style={{
        padding: "24px 26px",
        borderRadius: "var(--r-md)",
        background: "var(--ink-1)",
        border: "1px solid var(--line)",
        marginBlock: 28,
      }}
      aria-labelledby="trust-section-title"
    >
      <div style={{ maxWidth: 760 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--emerald-400)", marginBottom: 6 }}>
          <IconShieldCheck size={18} aria-hidden="true" />
          <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {locale === "ur" ? "لاہور تحفظ اور معیار" : "Trust & Safety Framework"}
          </span>
        </div>
        <h2 id="trust-section-title" style={{ margin: "0 0 6px", fontSize: "1.35rem", fontWeight: 800 }}>
          {t("trust.title")}
        </h2>
        <p style={{ color: "var(--text-2)", fontSize: "0.92rem", lineHeight: 1.5, margin: "0 0 20px" }}>
          {t("trust.subtitle")}
        </p>

        {/* 4 Levels Grid */}
        <div className="trust-grid">
          {levels.map((lvl) => (
            <div key={lvl.badge} className="trust-item-card">
              <div>
                <strong style={{ fontSize: "0.95rem", color: "var(--text)" }}>{lvl.badge}</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.83rem", color: "var(--text-3)", lineHeight: 1.45 }}>
                  {lvl.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Server-Side Privacy Guarantee Callout */}
        <div
          style={{
            marginTop: 18,
            padding: "14px 18px",
            borderRadius: "var(--r-sm)",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <IconLock size={20} style={{ color: "var(--emerald-400)", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <div>
            <strong style={{ fontSize: "0.92rem", color: "var(--emerald-300)" }}>
              {t("trust.privacy_guarantee_title")}
            </strong>
            <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--text-2)", lineHeight: 1.45 }}>
              {t("trust.privacy_guarantee_desc")}
            </p>
          </div>
        </div>

        {/* Accountability & Reporting Button */}
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-3)" }}>
            {locale === "ur"
              ? "کسی بھی غیر مناسب رویے یا غلط کوٹیشن پر ہماری لاہور انتظامیہ کو فوری رپورٹ کریں۔"
              : "Facing an issue, no-show, or overcharging? Our local Lahore team investigates every complaint."}
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onOpenReport}
            style={{ color: "var(--bad)", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <IconAlertCircle size={15} aria-hidden="true" />
            <span>{t("trust.report_button")}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* TECHNICIAN RECRUITMENT SECTION                                    */
/* ---------------------------------------------------------------- */
export function TechnicianRecruitmentSection({ onJoin }: { onJoin: () => void }) {
  const { t, locale } = useI18n();

  return (
    <section
      style={{
        padding: "26px 28px",
        borderRadius: "var(--r-md)",
        background: "linear-gradient(135deg, rgba(5, 150, 105, 0.12) 0%, rgba(16, 23, 38, 0.95) 100%)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        marginBlock: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 18,
      }}
      aria-label="Technician recruitment"
    >
      <div style={{ maxWidth: 580 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: "1.2rem", fontWeight: 800, color: "var(--emerald-200)" }}>
          {t("recruitment.title")}
        </h3>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: "0.9rem", lineHeight: 1.5 }}>
          {t("recruitment.desc")}
        </p>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onJoin}
        style={{ padding: "12px 24px", fontSize: "0.95rem" }}
      >
        <IconWrench size={18} aria-hidden="true" />
        <span>{t("recruitment.btn")}</span>
      </button>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* JOB CARD — Answers the 5 Key Questions                           */
/* 1. What's the issue? 2. Urgency? 3. Trade/Area/Time? 4. Details? 5. Next Action */
/* ---------------------------------------------------------------- */
export function JobCard({
  job,
  onOpen,
  ownJob,
}: {
  job: PublicJobItem;
  onOpen: (j: PublicJobItem) => void;
  ownJob?: boolean;
}) {
  const { locale } = useI18n();

  return (
    <article
      className="job-card"
      data-urgent={job.asap}
      onClick={() => onOpen(job)}
      style={{
        cursor: "pointer",
        padding: 20,
        borderRadius: "var(--r-md)",
        background: "var(--ink-1)",
        border: "1px solid var(--line)",
        transition: "all 0.15s ease",
      }}
    >
      <div className="job-card-top" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <span className="module module-sm" aria-hidden="true" style={{ background: "var(--graphite-2)" }}>
          <TradeIcon category={job.category} />
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <h3 className="job-title" style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>
              {job.title}
            </h3>
            {job.asap && (
              <span className="pill pill-warn" style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
                <IconClock size={12} aria-hidden="true" />
                {locale === "ur" ? "فوری چاہیے" : "Urgent"}
              </span>
            )}
          </div>

          <div className="row" style={{ gap: 8, marginTop: 6, flexWrap: "wrap", fontSize: "0.82rem" }}>
            <span className="pill">{job.category}</span>
            <span className="meta" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <IconMapPin size={13} aria-hidden="true" />
              {job.area}, Lahore
            </span>
            <span className="meta">· {fmtDate(job.created_at)}</span>
            {ownJob && <span className="pill pill-info">{locale === "ur" ? "آپ کا کام" : "Your job"}</span>}
            {job.is_demo && <DemoBadge />}
          </div>
        </div>
      </div>

      <p className="job-desc" style={{ margin: "12px 0", color: "var(--text-2)", fontSize: "0.9rem", lineHeight: 1.5 }}>
        {job.description}
      </p>

      <div
        className="job-card-foot"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          paddingTop: 12,
          borderTop: "1px solid var(--line-soft)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span className="pill pill-ok" style={{ fontWeight: 700 }}>
            {job.bid_count === 0
              ? locale === "ur"
                ? "کوئی بولی نہیں ابھی"
                : "0 quotes received"
              : plural(job.bid_count, locale === "ur" ? "کوٹیشن موصول" : "quote received")}
          </span>
          <span className="meta" style={{ fontSize: "0.8rem" }}>
            {locale === "ur" ? "ترجیحی وقت:" : "Preferred:"} {job.asap ? (locale === "ur" ? "آج فوری" : "Today ASAP") : whenLabel(job)}
          </span>
        </div>

        <button
          type="button"
          className="btn btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(job);
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <span>{ownJob ? (locale === "ur" ? "کوٹیشنز دیکھیں" : "Compare quotes") : (locale === "ur" ? "تفصیل دیکھیں" : "View details")}</span>
          <IconArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------- */
/* MARKETPLACE VIEW WITH SEARCH, FILTERS & ACTIVE EMPTY STATE       */
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
  onPost?: (cat?: "plumbing" | "electrical") => void;
}) {
  const { t, locale } = useI18n();
  const [trade, setTrade] = useState("all");
  const [area, setArea] = useState("all");
  const [q, setQ] = useState("");
  const [asap, setAsap] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const realJobs = useMemo(() => jobs.filter((j) => !j.is_demo), [jobs]);
  const sampleJobs = useMemo(() => jobs.filter((j) => j.is_demo), [jobs]);

  const filtered = useMemo(() => {
    return realJobs.filter((j) => {
      if (trade !== "all" && j.category.toLowerCase() !== trade.toLowerCase()) return false;
      if (area !== "all" && j.area.toLowerCase() !== area.toLowerCase()) return false;
      if (asap && !j.asap) return false;
      if (q.trim()) {
        const query = q.toLowerCase();
        const matches =
          j.title.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.area.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [realJobs, trade, area, asap, q]);

  const activeFilters = trade !== "all" || area !== "all" || asap || q.trim().length > 0;

  const reset = () => {
    setTrade("all");
    setArea("all");
    setQ("");
    setAsap(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Search and Filters Bar */}
      <div
        className="plate"
        style={{
          padding: "16px 20px",
          borderRadius: "var(--r-md)",
          background: "var(--ink-1)",
          border: "1px solid var(--line)",
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", flex: 1 }}>
          <div className="search-bar" role="search" style={{ minWidth: 260, flex: 1, margin: 0 }}>
            <IconSearch size={16} aria-hidden="true" />
            <input
              type="search"
              aria-label={locale === "ur" ? "کام تلاش کریں" : "Search repair jobs"}
              placeholder={
                locale === "ur"
                  ? "مسئلہ یا علاقہ تلاش کریں (جیسے موٹر، گیزر، وائرنگ)..."
                  : "Search Lahore repairs, e.g. geyser, water motor, fan..."
              }
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-icon"
                onClick={() => setQ("")}
                aria-label="Clear search"
              >
                <IconX size={15} />
              </button>
            )}
          </div>

          <select
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "var(--r-sm)", background: "var(--graphite-2)", border: "1px solid var(--line-strong)", fontSize: "0.85rem", color: "var(--text)" }}
          >
            <option value="all">{locale === "ur" ? "تمام کام (پلمبنگ و بجلی)" : "All trades (Plumbing & Electrical)"}</option>
            <option value="plumbing">{locale === "ur" ? "پلمبنگ" : "Plumbing"}</option>
            <option value="electrical">{locale === "ur" ? "الیکٹریکل" : "Electrical"}</option>
          </select>

          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "var(--r-sm)", background: "var(--graphite-2)", border: "1px solid var(--line-strong)", fontSize: "0.85rem", color: "var(--text)" }}
          >
            <option value="all">{locale === "ur" ? "پورے لاہور کے علاقے" : "All Lahore areas"}</option>
            {areas.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", cursor: "pointer", color: "var(--text-2)" }}>
            <input
              type="checkbox"
              checked={asap}
              onChange={(e) => setAsap(e.target.checked)}
            />
            <span>{locale === "ur" ? "صرف فوری کام" : "Urgent only"}</span>
          </label>
        </div>

        {activeFilters && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            <IconRefreshCw size={13} aria-hidden="true" />
            <span>{locale === "ur" ? "فلٹر ہٹائیں" : "Reset"}</span>
          </button>
        )}
      </div>

      {/* Main Jobs Listing or Useful Empty State */}
      {realJobs.length === 0 ? (
        <div
          className="plate"
          style={{
            padding: "36px 28px",
            textAlign: "center",
            borderRadius: "var(--r-md)",
            background: "var(--ink-1)",
            border: "1px solid var(--line)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.12)",
              color: "var(--emerald-400)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
            }}
          >
            <IconWrench size={28} />
          </div>

          <h3 style={{ margin: "0 0 10px", fontSize: "1.3rem", fontWeight: 800 }}>
            {t("empty.no_jobs_title")}
          </h3>
          <p style={{ maxWidth: 540, margin: "0 auto 24px", color: "var(--text-2)", lineHeight: 1.6, fontSize: "0.95rem" }}>
            {t("empty.no_jobs_desc")}
          </p>

          {onPost && (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onPost()}
              style={{ margin: "0 auto 28px" }}
            >
              <IconPlus size={18} aria-hidden="true" />
              <span>{t("empty.post_button")}</span>
            </button>
          )}

          {/* Useful Real Examples and Rates */}
          <div
            style={{
              maxWidth: 620,
              margin: "0 auto",
              textAlign: "left",
              padding: "18px 22px",
              borderRadius: "var(--r-md)",
              background: "var(--graphite-1)",
              border: "1px solid var(--line-soft)",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-1)", marginBottom: 12 }}>
              {t("empty.examples_title")}
            </div>
            <ul style={{ margin: 0, paddingInlineStart: 20, color: "var(--text-2)", fontSize: "0.86rem", lineHeight: 1.8 }}>
              <li>{t("empty.ex_motor")}</li>
              <li>{t("empty.ex_tap")}</li>
              <li>{t("empty.ex_fan")}</li>
              <li>{t("empty.ex_geyser")}</li>
            </ul>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<IconSearch size={24} />}
          title={locale === "ur" ? "کوئی کام ان فلٹرز پر پورا نہیں اترا" : "No jobs match your search"}
          action={
            <button type="button" className="btn btn-primary btn-sm" onClick={reset}>
              {locale === "ur" ? "تمام کام دکھائیں" : "Show all jobs"}
            </button>
          }
        >
          {locale === "ur"
            ? "اپنا علاقہ یا سروس کی قسم تبدیل کر کے دیکھیں۔"
            : "Try selecting another area or trade filter."}
        </EmptyState>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-3)", fontWeight: 600 }}>
            {plural(filtered.length, locale === "ur" ? "ایکٹو کام" : "active job in Lahore")}
          </div>
          {filtered.map((j) => (
            <JobCard key={j.id} job={j} onOpen={onOpenJob} ownJob={ownJobIds.has(j.id)} />
          ))}
        </div>
      )}

      {/* Trust & Safety Panel */}
      <TrustPanel onOpenReport={() => setReportModalOpen(true)} />

      {/* Technician Recruitment Invitation */}
      <TechnicianRecruitmentSection onJoin={() => onPost ? onPost() : null} />

      {/* Synthetic Demonstrations Drawer (For testing and pilot evaluation) */}
      {sampleJobs.length > 0 && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "var(--r-sm)",
            background: "var(--ink-1)",
            border: "1px solid var(--line)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <span className="pill pill-warn" style={{ fontSize: "0.72rem", textTransform: "uppercase" }}>
                {locale === "ur" ? "نمونہ ڈیمو پوسٹس" : "Sample Demonstrations"}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-2)", marginInlineStart: 8 }}>
                {locale === "ur"
                  ? "سسٹم کے کام کرنے کے طریقے کو سمجھنے کے لیے نمونہ پوسٹس دیکھیں"
                  : "Synthetic sample posts illustrating how quotes and jobs function"}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowSamples((v) => !v)}
            >
              {showSamples ? (locale === "ur" ? "چھپائیں" : "Hide sample jobs") : (locale === "ur" ? `دیکھیں (${sampleJobs.length})` : `View ${sampleJobs.length} samples`)}
            </button>
          </div>

          {showSamples && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              {sampleJobs.map((j) => (
                <JobCard key={j.id} job={j} onOpen={onOpenJob} ownJob={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* General Report Modal */}
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
/* JOB DIALOG — Public overview + structured technician quoting     */
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
  const { t, locale } = useI18n();
  const [amount, setAmount] = useState("");
  const [pricingType, setPricingType] = useState<"labour_only" | "parts_estimate" | "inspection_fee">("labour_only");
  const [timing, setTiming] = useState("");
  const [message, setMessage] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  React.useEffect(() => {
    setAmount("");
    setTiming("");
    setMessage("");
    setInclusions("");
    setExclusions("");
    setErrors({});
    setServerError(null);
    setSent(false);
  }, [job?.id]);

  if (!job) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    const n = Number(amount);
    if (!amount.trim()) errs.amount = locale === "ur" ? "مزدوری کی رقم درج کریں۔" : "Enter your quote amount in whole rupees.";
    else if (!Number.isInteger(n) || n < 100) errs.amount = locale === "ur" ? "کم از کم بولی 100 روپے ہے۔" : "Minimum bid is Rs 100.";
    if (!timing.trim()) errs.timing = locale === "ur" ? "آمد کا متوقع وقت بتائیں۔" : "Tell the customer when you can arrive.";
    if (!message.trim() || message.trim().length < 5) errs.message = locale === "ur" ? "مختصر نوٹ درج کریں (کم از کم 5 حروف)۔" : "Add a short message describing your experience.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    const fd = new FormData();
    fd.set("amount", String(Number(amount)));
    fd.set("timingText", timing.trim());
    fd.set("message", message.trim());
    fd.set("inclusions", inclusions.trim() || (pricingType === "labour_only" ? "Labour only" : "Labour + estimated parts"));
    fd.set("exclusions", exclusions.trim());

    try {
      const res = await submitBidAction(job.id, null, fd);
      if (res?.error) {
        setServerError(res.error);
      } else {
        setSent(true);
        onBidSent(res?.ok ?? (locale === "ur" ? "آپ کی کوٹیشن کسٹمر کو بھیج دی گئی ہے۔" : "Your quote has been sent."));
      }
    } catch {
      setServerError(locale === "ur" ? "کوٹیشن جمع کرتے وقت خرابی ہوئی۔ دوبارہ کوشش کریں۔" : "Failed to submit quote. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={Boolean(job)}
      onClose={onClose}
      title={job.title}
      eyebrow={
        <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
          <span className="pill">
            <TradeIcon category={job.category} size={13} /> {job.category}
          </span>
          <StatusBadge status={job.status} />
          {job.asap && <span className="pill pill-warn">{locale === "ur" ? "فوری چاہیے" : "Urgent"}</span>}
          {job.is_demo && <DemoBadge />}
        </div>
      }
    >
      <div className="stack" style={{ gap: 16 }}>
        <dl className="kv" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <dt>{locale === "ur" ? "علاقہ" : "Area"}</dt>
            <dd>{job.area}, Lahore</dd>
            <span className="hint" style={{ fontSize: "0.74rem" }}>
              {locale === "ur" ? "صرف عمومی علاقہ (پتہ مکمل محفوظ ہے)" : "Approximate neighborhood only"}
            </span>
          </div>
          <div>
            <dt>{locale === "ur" ? "مطلوبہ وقت" : "Timing"}</dt>
            <dd>{whenLabel(job)}</dd>
          </div>
          <div>
            <dt>{locale === "ur" ? "کسٹمر کا بجٹ" : "Customer Budget"}</dt>
            <dd>{budgetLabel(job.budget_min, job.budget_max)}</dd>
          </div>
          <div>
            <dt>{locale === "ur" ? "موصول کوٹیشنز" : "Quotes so far"}</dt>
            <dd>{job.bid_count === 0 ? (locale === "ur" ? "پہلا ریٹ بھیجیں" : "0 quotes so far") : plural(job.bid_count, locale === "ur" ? "کوٹیشن" : "quote")}</dd>
          </div>
        </dl>

        <div>
          <h4 style={{ margin: "0 0 6px", fontSize: "0.95rem" }}>
            {locale === "ur" ? "مسئلے کی تفصیل:" : "Problem description:"}
          </h4>
          <p style={{ whiteSpace: "pre-wrap", margin: 0, color: "var(--text-2)", fontSize: "0.92rem", lineHeight: 1.5 }}>
            {job.description}
          </p>
        </div>

        {/* Address Privacy Notice */}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "var(--r-sm)",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            fontSize: "0.82rem",
            color: "var(--emerald-300)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <IconLock size={15} aria-hidden="true" style={{ flexShrink: 0 }} />
          <span>
            {locale === "ur"
              ? "مکان اور گلی کا مکمل پتہ صرف اسی کاریگر کو دیا جاتا ہے جسے کسٹمر منتخب کرتا ہے۔ ادائیگی براہ راست کسٹمر سے طے ہوتی ہے۔"
              : "Exact house and street address is unlocked only for the chosen technician. You settle payment directly upon completion."}
          </span>
        </div>

        {/* Action based on viewer role */}
        {isOwn ? (
          <div className="plate" style={{ padding: 16, textAlign: "center" }}>
            <strong>{locale === "ur" ? "یہ آپ کی پوسٹ کردہ درخواست ہے" : "This is your posted request"}</strong>
            <p className="hint" style={{ margin: "4px 0 14px" }}>
              {locale === "ur"
                ? "کاریگروں کے ریٹس دیکھنے اور منتخب کرنے کے لیے اپنے کسٹمر ڈیش بورڈ پر جائیں۔"
                : "Compare received quotes and hire your technician in your customer dashboard."}
            </p>
            <Link className="btn btn-primary" href={`/jobs/${job.id}`}>
              <span>{locale === "ur" ? `کوٹیشنز دیکھیں (${job.bid_count})` : `Compare quotes (${job.bid_count})`}</span>
              <IconArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        ) : !user ? (
          <div className="plate" style={{ padding: 16, textAlign: "center" }}>
            <strong>{locale === "ur" ? "اس کام پر کوٹیشن بھیجنا چاہتے ہیں؟" : "Want to bid on this job?"}</strong>
            <p className="hint" style={{ margin: "4px 0 14px" }}>
              {locale === "ur"
                ? "لاگ ان کریں اور بطور کاریگر اپنا ریٹ بھیجیں۔"
                : "Sign in with your phone to submit your quote."}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button type="button" className="btn btn-primary" onClick={onSignIn}>
                {locale === "ur" ? "لاگ ان کریں" : "Sign in to bid"}
              </button>
              <button type="button" className="btn" onClick={onJoin}>
                {locale === "ur" ? "بطور کاریگر رجسٹریشن" : "Join as technician"}
              </button>
            </div>
          </div>
        ) : !user.is_worker ? (
          <div className="plate" style={{ padding: 16, textAlign: "center" }}>
            <strong>{locale === "ur" ? "کاریگر پروفائل بنائیں" : "Set up a technician profile to quote"}</strong>
            <p className="hint" style={{ margin: "4px 0 14px" }}>
              {locale === "ur"
                ? "اپنا ہنر اور لاہور کے علاقے منتخب کریں تاکہ آپ کاموں پر ریٹ بھیج سکیں۔"
                : "Select your trade and service areas to start receiving matching repair jobs."}
            </p>
            <Link className="btn btn-primary" href="/worker/profile">
              <span>{locale === "ur" ? "پروفائل بنائیں" : "Create technician profile"}</span>
              <IconArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        ) : sent ? (
          <div className="plate" style={{ padding: 20, textAlign: "center", background: "var(--ok-soft)" }}>
            <IconCheck size={28} style={{ color: "var(--ok)", margin: "0 auto 8px" }} />
            <h4 style={{ margin: "0 0 6px" }}>{locale === "ur" ? "کوٹیشن بھیج دی گئی ہے" : "Quote sent to customer"}</h4>
            <p style={{ margin: "0 0 14px", color: "var(--text-2)", fontSize: "0.86rem" }}>
              {locale === "ur"
                ? "کسٹمر آپ کا ریٹ اور تجربہ دیکھ سکے گا۔ جب وہ آپ کو منتخب کریں گے، آپ کو الرٹ موصول ہو جائے گا۔"
                : "The customer will review your bid. When accepted, you will receive full address details."}
            </p>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              {locale === "ur" ? "ٹھیک ہے" : "Done"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleBidSubmit} className="stack" style={{ gap: 14 }}>
            <h4 style={{ margin: 0, fontSize: "1.05rem" }}>
              {locale === "ur" ? "اپنا ریٹ اور وقت بھیجیں" : "Submit your quote"}
            </h4>

            {serverError && (
              <div className="notice notice-bad" style={{ fontSize: "0.85rem" }}>
                <IconAlertCircle size={15} />
                <span>{serverError}</span>
              </div>
            )}

            <div className="grid grid-2" style={{ gap: 12 }}>
              <Field
                id="bid-amount"
                label={locale === "ur" ? "مزدوری کی رقم (روپے)" : "Labour price (PKR)"}
                error={errors.amount}
                hint={locale === "ur" ? "مکمل روپے (سامان علیحدہ طے ہوتا ہے)" : "Whole PKR. Parts agreed separately."}
              >
                {(p) => (
                  <input
                    {...p}
                    type="number"
                    min={100}
                    step={50}
                    placeholder="e.g. 1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ padding: "8px 12px" }}
                    required
                  />
                )}
              </Field>

              <Field
                id="bid-timing"
                label={locale === "ur" ? "کس وقت آ سکتے ہیں؟" : "When can you arrive?"}
                error={errors.timing}
                hint={locale === "ur" ? "مثلاً: آج شام 4 سے 6 بجے" : "e.g. Today between 4 and 6 PM"}
              >
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    maxLength={120}
                    placeholder="Today 4 - 6 PM"
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                    style={{ padding: "8px 12px" }}
                    required
                  />
                )}
              </Field>
            </div>

            <Field
              id="bid-message"
              label={locale === "ur" ? "کسٹمر کے لیے نوٹ / تجربہ:" : "Message to customer:"}
              error={errors.message}
              hint={locale === "ur" ? "اپنے اوزار اور کام کی ضمانت کا ذکر کریں۔" : "Mention your tools and guarantee if applicable."}
            >
              {(p) => (
                <textarea
                  {...p}
                  rows={2}
                  maxLength={500}
                  placeholder={
                    locale === "ur"
                      ? "مثلاً: مکمل ٹول کٹ موجود ہے۔ تسلی بخش کام کی گارنٹی ہے۔"
                      : "e.g. Experienced with pipeline and fittings. 30 days workmanship guarantee."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ padding: "8px 12px" }}
                  required
                />
              )}
            </Field>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: "100%", padding: "10px" }}
            >
              {submitting
                ? locale === "ur"
                  ? "بھیجا جا رہا ہے..."
                  : "Sending..."
                : locale === "ur"
                ? "کوٹیشن بھیجیں"
                : "Send quote"}
            </button>
          </form>
        )}
      </div>
    </Dialog>
  );
}
