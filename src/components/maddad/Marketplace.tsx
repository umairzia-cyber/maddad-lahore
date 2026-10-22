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
/* 2. DIRECT HERO WITH 2-TRADE SERVICES & DOCUMENTARY PHOTOGRAPHY   */
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
  const { locale, toggleLocale } = useI18n();

  return (
    <>
      <section className={`hero ${compact ? "hero-compact" : ""}`} aria-labelledby="hero-title">
      <div className="hero-split">
        {/* Left: Direct Copy & Actions */}
        <div className="hero-copy">
          <span className="hero-eyebrow">
            {locale === "ur" ? "لاہور لوکل سروس نیٹ ورک" : "Lahore Household Repair Network"}
          </span>

          <h1 id="hero-title" className="hero-title">
            {locale === "ur" ? "گھر میں مرمت یا کاریگر کی ضرورت؟" : "Need a repair at home?"}
          </h1>

          {!compact && (
            <p className="hero-lead">
              {locale === "ur"
                ? "اپنا مسئلہ بتائیں اور لاہور کے تصدیق شدہ پلمبرز اور الیکٹریشنز سے براہ راست ریٹس وصول کریں۔ اپنی مرضی کا کاریگر منتخب کریں اور تسلی بخش کام کے بعد براہ راست ادائیگی کریں۔"
                : "Describe what needs fixing in your Lahore home. Verified local plumbers and electricians send clear labour quotes with arrival times. Compare options, choose who you trust, and pay them directly upon completion."}
            </p>
          )}

          {/* Primary Action Button & Technician Link */}
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onPost()}
            >
              <IconPlus size={18} aria-hidden="true" />
              <span>{locale === "ur" ? "مرمت کی درخواست دیں (مفت)" : "Post a repair request (Free)"}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onJoin}
            >
              <IconWrench size={16} aria-hidden="true" />
              <span>{user?.is_worker ? (locale === "ur" ? "کاریگر پورٹل" : "Technician Portal") : (locale === "ur" ? "بطور کاریگر شامل ہوں" : "Find work as a technician")}</span>
            </button>
          </div>

          <div className="hero-reassurance">
            <span>
              {locale === "ur"
                ? "مفت پوسٹنگ · ریٹس کا موازنہ · آپ کے گھر کا پتہ کاریگر منتخب کرنے تک خفیہ رہتا ہے"
                : "Free to post · Compare quotes · Your street address stays private until you hire"}
            </span>
          </div>
        </div>

        {/* Right: Authentic Documentary Photography */}
        {!compact && (
          <div className="hero-photo-frame">
            <Image
              src="/images/plumber-lahore.jpg"
              alt="Experienced plumber working on domestic pipe fittings in Lahore"
              width={600}
              height={450}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <div className="hero-photo-caption">
              {locale === "ur"
                ? "لاہور کے 15 علاقوں میں مقامی پلمبنگ اور الیکٹریکل سروسز: گلبرگ، ڈی ایچ اے، جوہر ٹاؤن، کینٹ، ماڈل ٹاؤن"
                : "Serving homes across 15 Lahore areas: Gulberg, DHA Defence, Johar Town, Cantt, Model Town & more."}
            </div>
          </div>
        )}
      </div>
    </section>

    {/* 3. TWO CLEAR SERVICE OPTIONS: PLUMBING & ELECTRICAL */}
    {!compact && (
      <section className="services-section" aria-label="Repair services">
        <div className="services-grid">
          {/* Plumbing Option */}
          <div
            className="service-card"
            role="button"
            tabIndex={0}
            onClick={() => onPost("plumbing")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onPost("plumbing");
            }}
            aria-label="Request plumbing help in Lahore"
          >
            <div>
              <div className="service-card-top">
                <h3 className="service-card-title">
                  {locale === "ur" ? "پلمبنگ سروس" : "Plumbing"}
                </h3>
                <span className="service-card-urdu">پلمبر</span>
              </div>
              <p className="service-card-desc">
                {locale === "ur"
                  ? "پانی کی موٹر، گیزر کی مرمت، نل اور مکسر کی تبدیلی، پائپ لائن لیکیج اور سینیٹری فٹنگز۔"
                  : "Water motors, instant & storage geysers, leaking taps, mixer replacement, pipeline joints & drainage."}
              </p>
              <div className="service-card-examples">
                <strong>{locale === "ur" ? "عام کام:" : "Typical jobs:"}</strong>{" "}
                {locale === "ur"
                  ? "موٹر کیپیسٹر تبدیلی، واش روم نل فٹنگ، گیزر سروس، کچن سنک لیکیج"
                  : "Motor capacitor repair, tap/mixer fitting, geyser servicing, kitchen sink pipe leaks"}
              </div>
            </div>
            <span className="service-card-link">
              <span>{locale === "ur" ? "پلمبر کی درخواست دیں →" : "Request a plumber →"}</span>
            </span>
          </div>

          {/* Electrical Option */}
          <div
            className="service-card"
            role="button"
            tabIndex={0}
            onClick={() => onPost("electrical")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onPost("electrical");
            }}
            aria-label="Request electrical help in Lahore"
          >
            <div>
              <div className="service-card-top">
                <h3 className="service-card-title">
                  {locale === "ur" ? "الیکٹریکل سروس" : "Electrical"}
                </h3>
                <span className="service-card-urdu">الیکٹریشن</span>
              </div>
              <p className="service-card-desc">
                {locale === "ur"
                  ? "شارٹ سرکٹ ٹریسنگ، سوئچ بورڈ اور بریکر تبدیلی، سیلنگ فین مرمت و انسٹالیشن، وائرنگ اور لائٹس۔"
                  : "Short circuit repair, main breaker trips, switchboard replacement, ceiling fan wiring, lights & fixtures."}
              </p>
              <div className="service-card-examples">
                <strong>{locale === "ur" ? "عام کام:" : "Typical jobs:"}</strong>{" "}
                {locale === "ur"
                  ? "سیلنگ فین وائرنگ، مین بریکر ٹرپ، نیا سوئچ بورڈ، ایس ایم ڈی لائٹ فٹنگ"
                  : "Ceiling fan installation, main breaker replacement, switchboard rewiring, light fixtures"}
              </div>
            </div>
            <span className="service-card-link">
              <span>{locale === "ur" ? "الیکٹریشن کی درخواست دیں →" : "Request an electrician →"}</span>
            </span>
          </div>
        </div>
      </section>
    )}
  </>
);
}

/** Legacy stub export to preserve any existing component imports without breaking */
export function HowItWorks() {
  return null;
}

/* ---------------------------------------------------------------- */
/* 5. VERIFIABLE SAFEGUARDS (TRUST & PRIVACY)                       */
/* Only verified claims: Address privacy, OTP, CNIC check, 0% cut   */
/* ---------------------------------------------------------------- */
export function TrustPanel({ onOpenReport }: { onOpenReport: () => void }) {
  const { locale } = useI18n();

  return (
    <section className="trust-panel" aria-labelledby="trust-section-title">
      <div>
        <span className="hero-eyebrow">
          {locale === "ur" ? "تحفظ اور رازداری" : "Safety & Privacy"}
        </span>
        <h2 id="trust-section-title" style={{ margin: "4px 0 8px", fontSize: "1.45rem" }}>
          {locale === "ur" ? "آپ کے گھر کے لیے تصدیق شدہ حفاظتی اصول" : "Verifiable Safeguards for Your Home"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: 900, margin: 0 }}>
          {locale === "ur"
            ? "مددگار پر کوئی مبہم یا غیر تصدیق شدہ دعویٰ نہیں کیا جاتا۔ ہمارے سسٹم میں درج ذیل حقیقی حفاظتی اقدامات نافذ ہیں:"
            : "We rely on strict, verifiable controls rather than generic marketing claims. Here is how your home and information are protected:"}
        </p>

        <div className="trust-facts-grid">
          <div className="trust-fact">
            <div className="trust-fact-title">
              {locale === "ur" ? "گھر کا پتہ مکمل طور پر محفوظ" : "Address Privacy by Design"}
            </div>
            <div className="trust-fact-desc">
              {locale === "ur"
                ? "بولی دینے والے کاریگر صرف آپ کا عام علاقہ دیکھ سکتے ہیں۔ آپ کا مکمل پتہ اور فون نمبر صرف اس ایک کاریگر کو ظاہر ہوتا ہے جس کی بولی آپ قبول کرتے ہیں۔"
                : "Bidders only see your general neighbourhood (e.g. Johar Town, Gulberg). Your exact house number and phone are unlocked strictly for the single technician whose quote you accept."}
            </div>
          </div>

          <div className="trust-fact">
            <div className="trust-fact-title">
              {locale === "ur" ? "فون اور واٹس ایپ تصدیق" : "Phone & WhatsApp Verification"}
            </div>
            <div className="trust-fact-desc">
              {locale === "ur"
                ? "ہر کسٹمر اور کاریگر کام پوسٹ کرنے یا بولی دینے سے پہلے 6 ہندسوں کے ون ٹائم پن کوڈ (OTP) کے ذریعے اپنے پاکستانی موبائل نمبر کی تصدیق کرتا ہے۔"
                : "Every customer and technician confirms an active Pakistani mobile number with 6-digit OTP verification via WhatsApp or SMS before posting or submitting bids."}
            </div>
          </div>

          <div className="trust-fact">
            <div className="trust-fact-title">
              {locale === "ur" ? "شناختی دستاویزات کی دستی جانچ" : "Manual CNIC Document Review"}
            </div>
            <div className="trust-fact-desc">
              {locale === "ur"
                ? "کاریگر اپنے شناختی کارڈ کی کاپی جمع کروا سکتے ہیں جس کا ہماری لاہور موڈریشن ٹیم دستی معائنہ کرتی ہے۔ (یہ نادرا کا خودکار ریکارڈ چیک نہیں ہے)۔"
                : "Technicians may submit CNIC documentation for visual inspection by human moderators before receiving badge approval (non-NADRA)."}
            </div>
          </div>

          <div className="trust-fact">
            <div className="trust-fact-title">
              {locale === "ur" ? "براہ راست ادائیگی · کوئی کمیشن نہیں" : "Direct Settlement · Zero Commission"}
            </div>
            <div className="trust-fact-desc">
              {locale === "ur"
                ? "کسٹمر اور کاریگر تسلی بخش کام کے بعد آپس میں طے شدہ طریقہ (کیش، جاز کیش، ایزی پیسہ) سے لین دین کرتے ہیں۔ مددگار رقم اپنے پاس نہیں روکتا اور نہ ہی کاریگر سے کمیشن کاٹتا ہے۔"
                : "Customers settle directly with technicians via cash, JazzCash, or EasyPaisa upon satisfactory completion. Maddadgaar holds no funds, has no escrow wallet, and takes zero commission."}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--line-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-subtle)" }}>
            {locale === "ur"
              ? "کسی بھی غیر مناسب رویے یا غلط کوٹیشن پر ہماری لاہور انتظامیہ کو فوری مطلع کریں۔"
              : "Facing an issue, no-show, or overcharging? Our local Lahore moderation team reviews every report."}
          </p>
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
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 6. TECHNICIAN RECRUITMENT SECTION                                */
/* ---------------------------------------------------------------- */
export function TechnicianRecruitmentSection({ onJoin }: { onJoin: () => void }) {
  const { locale } = useI18n();

  return (
    <section className="recruitment-banner" aria-label="Technician recruitment">
      <div className="recruitment-content">
        <span className="hero-eyebrow">
          {locale === "ur" ? "لاہور کے کاریگروں کے لیے" : "For Independent Tradespeople"}
        </span>
        <h2 style={{ margin: "4px 0 8px", fontSize: "1.45rem" }}>
          {locale === "ur"
            ? "کیا آپ لاہور میں پلمبر یا الیکٹریشن ہیں؟"
            : "Are you a skilled electrician or plumber in Lahore?"}
        </h2>
        <p style={{ margin: "0 0 20px", color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
          {locale === "ur"
            ? "اپنے قریبی علاقے کے کسٹمرز سے براہ راست جڑیں۔ اپنی مرضی کا ریٹ کوٹ کریں اور اپنی پوری کمائی بغیر کسی کٹوتی کے خود رکھیں۔"
            : "Connect directly with homeowners in your neighborhood. Submit price quotes, build your local reputation, and keep 100% of your earnings with zero platform cuts or hidden deductions."}
        </p>
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onJoin}
          >
            <IconWrench size={16} aria-hidden="true" />
            <span>{locale === "ur" ? "بطور کاریگر رجسٹریشن کریں" : "Register as a Technician"}</span>
          </button>
        </div>
      </div>
      <div className="recruitment-photo">
        <Image
          src="/images/electrician-lahore.jpg"
          alt="Professional electrician servicing a circuit breaker board in Lahore"
          width={500}
          height={380}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 4. INDICATIVE LABOUR PRICE GUIDE                                 */
/* Clearly labelled as indicative benchmarks, not guaranteed         */
/* ---------------------------------------------------------------- */
export function IndicativeRateGuide({ onPost }: { onPost?: () => void }) {
  const { locale } = useI18n();

  const rates = [
    {
      jobEn: "Water pump / motor capacitor replacement or servicing",
      jobUr: "پانی کی موٹر کیپیسٹر تبدیلی یا سروسنگ",
      trade: "plumbing",
      range: "Rs 1,200 – 2,200",
    },
    {
      jobEn: "Washroom mixer or kitchen sink leaking tap repair / replacement",
      jobUr: "واش روم مکسر یا کچن سنک نل لیکیج مرمت و تبدیلی",
      trade: "plumbing",
      range: "Rs 800 – 1,500",
    },
    {
      jobEn: "Instant or storage geyser repair, thermostat, or descaling",
      jobUr: "انسٹنٹ یا اسٹوریج گیزر مرمت، تھرموسٹیٹ یا صفائی",
      trade: "plumbing",
      range: "Rs 1,800 – 3,000",
    },
    {
      jobEn: "Ceiling fan installation, rewiring, or capacitor replacement",
      jobUr: "سیلنگ فین انسٹالیشن، وائرنگ یا کیپیسٹر تبدیلی",
      trade: "electrical",
      range: "Rs 1,000 – 1,800",
    },
    {
      jobEn: "Distribution board circuit breaker replacement or short trip check",
      jobUr: "مین ڈسٹری بیوشن بورڈ بریکر تبدیلی یا ٹرپنگ فالٹ ٹریسنگ",
      trade: "electrical",
      range: "Rs 1,200 – 2,500",
    },
    {
      jobEn: "Room switchboard replacement or ceiling light fixture fitting",
      jobUr: "کمرے کا سوئچ بورڈ یا سیلنگ لائٹ فٹنگ",
      trade: "electrical",
      range: "Rs 800 – 1,600",
    },
  ];

  return (
    <div className="rate-guide-box" aria-labelledby="rate-guide-title">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="rate-guide-disclaimer-badge">
            {locale === "ur" ? "صرف تخمینی ریٹس · کوئی گارنٹی نہیں" : "Indicative Benchmarks · Not Guaranteed"}
          </span>
          <h2 id="rate-guide-title" style={{ margin: "4px 0 8px", fontSize: "1.35rem" }}>
            {locale === "ur" ? "لاہور میں مرمت کے تخمینی لیبر ریٹس" : "Indicative Repair Labour Rates in Lahore"}
          </h2>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem", maxWidth: 900, lineHeight: 1.6 }}>
            {locale === "ur"
              ? "لاہور کے عام رہائشی کاموں کے تخمینی لیبر ریٹس۔ حتمی قیمت کاریگر موقع دیکھ کر آپ کے ساتھ طے کرتا ہے۔"
              : "Common household repair benchmarks across Lahore neighbourhoods. Final labour rates are quoted directly by independent technicians based on actual inspection."}
          </p>
        </div>

        {onPost && (
          <button type="button" className="btn btn-primary btn-sm" onClick={onPost}>
            <IconPlus size={15} aria-hidden="true" />
            <span>{locale === "ur" ? "کوٹیشن کے لیے پوسٹ کریں" : "Post to get exact quotes"}</span>
          </button>
        )}
      </div>

      <div className="rate-guide-table-wrap">
        <table className="rate-guide-table">
          <thead>
            <tr>
              <th>{locale === "ur" ? "کام کی تفصیل" : "Common Repair"}</th>
              <th style={{ width: 140 }}>{locale === "ur" ? "شعبہ" : "Trade"}</th>
              <th style={{ width: 180, textAlign: "right" }}>{locale === "ur" ? "تخمینی لیبر (روپے)" : "Typical Labour"}</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r, i) => (
              <tr key={i}>
                <td>
                  <strong>{locale === "ur" ? r.jobUr : r.jobEn}</strong>
                </td>
                <td>
                  <span className={`pill ${r.trade === "plumbing" ? "pill-info" : "pill-warn"}`} style={{ fontSize: "0.75rem" }}>
                    <TradeIcon category={r.trade} size={12} />
                    <span>{r.trade === "plumbing" ? (locale === "ur" ? "پلمبنگ" : "Plumbing") : (locale === "ur" ? "الیکٹریکل" : "Electrical")}</span>
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="rate-price-tag">{r.range}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rate-note">
        <strong>{locale === "ur" ? "اہم وضاحت:" : "Important note:"}</strong>{" "}
        {locale === "ur"
          ? "درج بالا ریٹس صرف کاریگر کی اجرت (لیبر) کے تخمینہ کے لیے ہیں۔ اگر سامان (کیپیسٹر، پائپ، بریکر، والو) تبدیل ہونا ہو تو وہ کسٹمر خود فراہم کرتا ہے یا کاریگر مارکیٹ رسید کے مطابق الگ چارج کرتا ہے۔ مددگار قیمت طے نہیں کرتا اور نہ ہی کمیشن کاٹتا ہے۔"
          : "These figures reflect labour charges only. Replacement parts (pipes, valves, breakers, wire, capacitors) are purchased separately by you or reimbursed with shop receipts. Maddadgaar does not set prices or take any commission."}
      </div>
    </div>
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
    >
      <div className="job-card-top" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <span className="module module-sm" aria-hidden="true" style={{ background: "var(--bg-surface)", color: "var(--accent-olive)" }}>
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
  const [showRateGuide, setShowRateGuide] = useState(false);
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
      <div className="filter-toolbar">
        <div className="filter-toolbar-inputs">
          <div className="search-bar" role="search">
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
            aria-label={locale === "ur" ? "شعبہ منتخب کریں" : "Filter by trade"}
          >
            <option value="all">{locale === "ur" ? "تمام کام (پلمبنگ و بجلی)" : "All trades (Plumbing & Electrical)"}</option>
            <option value="plumbing">{locale === "ur" ? "پلمبنگ" : "Plumbing"}</option>
            <option value="electrical">{locale === "ur" ? "الیکٹریکل" : "Electrical"}</option>
          </select>

          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            aria-label={locale === "ur" ? "علاقہ منتخب کریں" : "Filter by area"}
          >
            <option value="all">{locale === "ur" ? "پورے لاہور کے علاقے" : "All Lahore areas"}</option>
            {areas.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.85rem", cursor: "pointer", color: "var(--text-muted)", fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={asap}
              onChange={(e) => setAsap(e.target.checked)}
              style={{ width: "auto" }}
            />
            <span>{locale === "ur" ? "صرف فوری کام" : "Urgent only"}</span>
          </label>
        </div>

        {activeFilters && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            <IconRefreshCw size={13} aria-hidden="true" />
            <span>{locale === "ur" ? "فلٹر ہٹائیں" : "Reset filters"}</span>
          </button>
        )}
      </div>

      {/* 4. CONCISE LIVE-JOBS OR INDICATIVE REPAIR RATES */}
      {realJobs.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="empty-banner">
            <div>
              <div className="empty-banner-title">
                {locale === "ur" ? "لاہور میں کوئی پبلک کام کی درخواست زیر التواء نہیں" : "No active job requests right now in Lahore"}
              </div>
              <div className="empty-banner-desc">
                {locale === "ur"
                  ? "لاہور میں پلمبنگ یا الیکٹریکل کام کی درخواست دیں، یا نیچے تخمینی ریٹس دیکھیں۔"
                  : "Post your repair request to receive quotes directly from verified local technicians, or reference the indicative Lahore price guide below."}
              </div>
            </div>
            {onPost && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onPost()}
              >
                <IconPlus size={16} aria-hidden="true" />
                <span>{locale === "ur" ? "مرمت کی درخواست دیں" : "Post a repair request"}</span>
              </button>
            )}
          </div>

          <IndicativeRateGuide onPost={() => onPost && onPost()} />
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", fontWeight: 600 }}>
              {plural(filtered.length, locale === "ur" ? "ایکٹو کام" : "active job in Lahore")}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowRateGuide((v) => !v)}
              style={{ fontSize: "0.82rem" }}
            >
              {showRateGuide ? (locale === "ur" ? "ریٹ گائیڈ چھپائیں" : "Hide rate guide") : (locale === "ur" ? "تخمینی ریٹ گائیڈ دیکھیں" : "View indicative price guide")}
            </button>
          </div>

          {showRateGuide && <IndicativeRateGuide onPost={() => onPost && onPost()} />}

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
