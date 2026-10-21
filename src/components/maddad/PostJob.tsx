"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconCheck,
  IconClock,
  IconLock,
  IconMapPin,
  IconPlus,
  IconRefreshCw,
  IconShieldCheck,
  IconWrench,
  IconZap,
  IconArrowLeft,
  IconArrowRight,
  IconAlertCircle,
  IconEye,
  IconFileText,
  IconCalendar,
} from "../icons";
import { createAndPublishJobAction } from "@/app/actions";
import type { AppUser, AreaOption, CategoryOption } from "./types";
import { Field, looksLikePhone, pkr } from "./shared";
import { useI18n } from "./I18nContext";

interface PostJobProps {
  user: AppUser | null;
  categories: CategoryOption[];
  areas: AreaOption[];
  initialCategory?: "plumbing" | "electrical" | null;
  onNeedAuth: () => void;
  onSuccess: (jobId: string) => void;
  onViewMarketplace: () => void;
}

export function PostJobView({
  user,
  categories,
  areas,
  initialCategory,
  onNeedAuth,
  onSuccess,
  onViewMarketplace,
}: PostJobProps) {
  const { t, locale } = useI18n();

  // Find category ID based on slug or default
  const defaultPlumbingId = String(categories.find((c) => c.slug === "plumbing")?.id || categories[0]?.id || "1");
  const defaultElectricalId = String(categories.find((c) => c.slug === "electrical")?.id || categories[1]?.id || "2");

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTrade, setSelectedTrade] = useState<"plumbing" | "electrical">(
    initialCategory === "electrical" ? "electrical" : "plumbing"
  );
  const [selectedProblem, setSelectedProblem] = useState<string>("");
  const [areaId, setAreaId] = useState<string>(areas[0]?.id ? String(areas[0].id) : "1");
  const [urgency, setUrgency] = useState<"asap" | "today" | "tomorrow" | "flexible">("asap");
  const [landmark, setLandmark] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [budgetMin, setBudgetMin] = useState<string>("1500");
  const [budgetMax, setBudgetMax] = useState<string>("2500");
  const [contactPhone, setContactPhone] = useState<string>(user?.phone || "");
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const plumbingProblems = [
    { id: "pipe_leak", en: "Leaking tap or pipe", ur: "نل یا پائپ لیکیج" },
    { id: "drain", en: "Blocked drain / sink", ur: "نالی یا سنک بند" },
    { id: "motor", en: "Water motor not working", ur: "پانی کی موٹر بند / خرابی" },
    { id: "geyser", en: "Geyser problem / no hot water", ur: "گیزر خراب / پانی گرم نہیں" },
    { id: "no_water", en: "No water in tank / low pressure", ur: "ٹینک میں پانی نہیں / کم پریشر" },
    { id: "other_plumbing", en: "Other plumbing issue", ur: "دیگر پلمبنگ کا مسئلہ" },
  ];

  const electricalProblems = [
    { id: "fan_light", en: "Fan or light not working", ur: "پنکھا یا لائٹ خراب ہے" },
    { id: "spark_breaker", en: "Switch or breaker spark", ur: "سوئچ یا بریکر سے چنگاری" },
    { id: "short_circuit", en: "Short circuit / frequent tripping", ur: "شارٹ سرکٹ / بار بار ٹرپنگ" },
    { id: "wiring", en: "New wiring or socket fitting", ur: "نئی وائرنگ یا بورڈ فٹنگ" },
    { id: "ups_inverter", en: "UPS or inverter problem", ur: "یو پی ایس یا انورٹر کی خرابی" },
    { id: "other_electrical", en: "Other electrical issue", ur: "دیگر بجلی کا مسئلہ" },
  ];

  const currentProblems = selectedTrade === "plumbing" ? plumbingProblems : electricalProblems;

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!selectedProblem) {
      errs.problem =
        locale === "ur"
          ? "براہ کرم سب سے قریبی مسئلہ منتخب کریں تاکہ کاریگر سمجھ سکے۔"
          : "Please choose the problem closest to your issue.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!areaId) {
      errs.area = locale === "ur" ? "براہ کرم لاہور کا علاقہ منتخب کریں۔" : "Please select your Lahore neighbourhood.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    const problemObj = currentProblems.find((p) => p.id === selectedProblem);
    const combinedDesc = description.trim() || (locale === "ur" ? problemObj?.ur : problemObj?.en) || "Home repair needed";

    if (combinedDesc.length < 15) {
      errs.description =
        locale === "ur"
          ? "براہ کرم مسئلے کی تھوڑی اور وضاحت لکھیں (کم از کم 15 حروف)۔"
          : "Please describe the problem in a few more words (at least 15 characters).";
    }

    if (budgetMin && budgetMax && Number(budgetMax) < Number(budgetMin)) {
      errs.budget =
        locale === "ur"
          ? "زیادہ سے زیادہ بجٹ کم از کم بجٹ سے زیادہ ہونا چاہیے۔"
          : "Maximum budget should be greater than minimum budget.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Final Submit Action
  const handleSubmitJob = async () => {
    if (!user) {
      onNeedAuth();
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const problemObj = currentProblems.find((p) => p.id === selectedProblem);
    const resolvedTitle = `${selectedTrade === "plumbing" ? "Plumbing" : "Electrical"}: ${problemObj?.en || "Repair needed"}`;
    const resolvedDesc = description.trim()
      ? `${description.trim()} (${problemObj?.en || ""})`
      : `${problemObj?.en || "Repair needed in Lahore"}. Needs inspection and repair by verified technician.`;

    const activeCatId = selectedTrade === "plumbing" ? defaultPlumbingId : defaultElectricalId;

    const fd = new FormData();
    fd.set("categoryId", activeCatId);
    fd.set("areaId", areaId);
    fd.set("title", resolvedTitle);
    fd.set("description", resolvedDesc);
    fd.set("budgetMin", budgetMin || "1000");
    fd.set("budgetMax", budgetMax || "3000");
    fd.set("asap", urgency === "asap" ? "true" : "false");
    fd.set("addressText", landmark.trim() || "Near neighbourhood main road (Exact address shared on hire)");
    fd.set("contactNote", "Contact directly upon hire");

    try {
      const res = await createAndPublishJobAction(null, fd);
      if (res?.error) {
        setServerError(res.error);
      } else if (res?.jobId) {
        setCreatedJobId(res.jobId);
        onSuccess(res.jobId);
      } else {
        setServerError(locale === "ur" ? "درخواست جمع نہیں ہو سکی۔ دوبارہ کوشش کریں۔" : "Failed to create job.");
      }
    } catch {
      setServerError(locale === "ur" ? "درخواست جمع کرتے وقت خرابی ہوئی۔" : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", paddingBottom: 40 }}>
      {/* Progress Header */}
      <div style={{ marginBottom: 20 }}>
        <button
          type="button"
          onClick={onViewMarketplace}
          className="btn btn-ghost btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12, paddingInlineStart: 0 }}
        >
          <IconArrowLeft size={16} aria-hidden="true" />
          <span>{locale === "ur" ? "مارکیٹ پر واپس جائیں" : "Back to marketplace"}</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span className="pill pill-ok" style={{ fontWeight: 800 }}>
            {locale === "ur" ? `مرحلہ ${step} از 4` : `Step ${step} of 4`}
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-3)" }}>
            {step === 1
              ? locale === "ur" ? "مسئلہ منتخب کریں" : "Select problem"
              : step === 2
              ? locale === "ur" ? "علاقہ اور وقت" : "Area & timing"
              : step === 3
              ? locale === "ur" ? "تفصیل اور بجٹ" : "Details & budget"
              : locale === "ur" ? "جائزہ اور پوسٹ" : "Review & publish"}
          </span>
        </div>

        {/* Step indicator bar */}
        <div style={{ display: "flex", gap: 6, height: 6, borderRadius: 3, overflow: "hidden", background: "var(--graphite-2)" }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                background: s <= step ? "var(--emerald-500)" : "transparent",
                transition: "background 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>

      {serverError && (
        <div className="notice notice-bad" style={{ marginBottom: 16 }}>
          <IconAlertCircle size={18} />
          <span>{serverError}</span>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* STEP 1: CHOOSE PROBLEM                                       */}
      {/* ------------------------------------------------------------ */}
      {step === 1 && (
        <div className="plate" style={{ padding: 24, borderRadius: "var(--r-md)", background: "var(--ink-1)", border: "1px solid var(--line)" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.35rem", fontWeight: 800 }}>
            {t("post.step1_title")}
          </h2>
          <p style={{ margin: "0 0 20px", color: "var(--text-2)", fontSize: "0.92rem" }}>
            {t("post.step1_sub")}
          </p>

          {/* Trade Selector (Plumbing vs Electrical) */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: 8 }}>
              {t("post.choose_trade")}
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button
                type="button"
                className={`service-choice-card ${selectedTrade === "plumbing" ? "selected" : ""}`}
                onClick={() => {
                  setSelectedTrade("plumbing");
                  setSelectedProblem("");
                }}
                style={{ padding: "14px 16px" }}
              >
                <div className="service-choice-icon" style={{ width: 38, height: 38 }}>
                  <IconWrench size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>{t("cat.plumbing_title")}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 2 }}>{t("cat.plumbing_desc")}</div>
                </div>
              </button>

              <button
                type="button"
                className={`service-choice-card electrical ${selectedTrade === "electrical" ? "selected" : ""}`}
                onClick={() => {
                  setSelectedTrade("electrical");
                  setSelectedProblem("");
                }}
                style={{ padding: "14px 16px" }}
              >
                <div className="service-choice-icon" style={{ width: 38, height: 38 }}>
                  <IconZap size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>{t("cat.electrical_title")}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 2 }}>{t("cat.electrical_desc")}</div>
                </div>
              </button>
            </div>
          </div>

          {/* Electrical Safety Notice */}
          {selectedTrade === "electrical" && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "var(--r-sm)",
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                marginBottom: 20,
                fontSize: "0.85rem",
                color: "var(--amber-300)",
                lineHeight: 1.5,
              }}
            >
              <strong>{t("post.electrical_safety_title")}</strong>
              <div style={{ marginTop: 4, color: "var(--text-2)" }}>
                {t("post.electrical_safety_body")}
              </div>
            </div>
          )}

          {/* Problem Choice Chips */}
          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: 8 }}>
              {t("post.problem_label")}
            </label>
            {errors.problem && (
              <p style={{ color: "var(--bad)", fontSize: "0.82rem", margin: "0 0 8px" }}>
                {errors.problem}
              </p>
            )}
            <div className="problem-chips-grid">
              {currentProblems.map((prob) => {
                const isSelected = selectedProblem === prob.id;
                return (
                  <button
                    key={prob.id}
                    type="button"
                    className={`problem-chip-btn ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setSelectedProblem(prob.id);
                      setErrors({});
                    }}
                  >
                    {isSelected && <IconCheck size={16} aria-hidden="true" />}
                    <span>{locale === "ur" ? prob.ur : prob.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
            >
              <span>{t("post.next_btn")}</span>
              <IconArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* STEP 2: AREA & TIMING                                        */}
      {/* ------------------------------------------------------------ */}
      {step === 2 && (
        <div className="plate" style={{ padding: 24, borderRadius: "var(--r-md)", background: "var(--ink-1)", border: "1px solid var(--line)" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.35rem", fontWeight: 800 }}>
            {locale === "ur" ? "لاہور کا علاقہ اور وقت منتخب کریں" : "Where and when do you need help?"}
          </h2>
          <p style={{ margin: "0 0 20px", color: "var(--text-2)", fontSize: "0.92rem" }}>
            {locale === "ur"
              ? "صرف قریبی کاریگروں کو مطلع کیا جائے گا تاکہ وہ جلدی پہنچ سکیں۔"
              : "Only nearby technicians covering this area will be invited to quote."}
          </p>

          <Field id="post-area" label={t("post.area_label")} error={errors.area}>
            {(p) => (
              <select
                {...p}
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                style={{ padding: "10px 14px", fontSize: "0.95rem" }}
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}, Lahore
                  </option>
                ))}
              </select>
            )}
          </Field>

          {/* Urgency Selector */}
          <div style={{ marginTop: 18 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: 8 }}>
              {t("post.urgency_label")}
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { id: "asap", label: t("post.urgency_asap"), icon: <IconClock size={16} /> },
                { id: "today", label: t("post.urgency_today"), icon: <IconCalendar size={16} /> },
                { id: "tomorrow", label: t("post.urgency_tomorrow"), icon: <IconCalendar size={16} /> },
                { id: "flexible", label: t("post.urgency_anytime"), icon: <IconCheck size={16} /> },
              ].map((u) => {
                const isSelected = urgency === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    className={`problem-chip-btn ${isSelected ? "active" : ""}`}
                    onClick={() => setUrgency(u.id as any)}
                    style={{ padding: "12px 14px", justifyContent: "flex-start" }}
                  >
                    {u.icon}
                    <span>{u.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Approximate Landmark Note with Privacy Reassurance */}
          <div style={{ marginTop: 20 }}>
            <Field
              id="post-landmark"
              label={t("post.landmark_label")}
              hint={t("post.landmark_hint")}
            >
              {(p) => (
                <input
                  {...p}
                  type="text"
                  placeholder={t("post.landmark_placeholder")}
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  style={{ padding: "10px 14px", fontSize: "0.92rem" }}
                />
              )}
            </Field>
          </div>

          <div
            style={{
              padding: "10px 14px",
              borderRadius: "var(--r-sm)",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              marginTop: 18,
              fontSize: "0.84rem",
              color: "var(--emerald-300)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <IconLock size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
            <span>
              <strong>{t("hero.privacy_badge")}</strong> {t("post.landmark_hint")}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
              {t("post.back_btn")}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                if (validateStep2()) setStep(3);
              }}
            >
              <span>{t("post.next_btn")}</span>
              <IconArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* STEP 3: SHORT DESCRIPTION & BUDGET                           */}
      {/* ------------------------------------------------------------ */}
      {step === 3 && (
        <div className="plate" style={{ padding: 24, borderRadius: "var(--r-md)", background: "var(--ink-1)", border: "1px solid var(--line)" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.35rem", fontWeight: 800 }}>
            {locale === "ur" ? "مختصر تفصیل اور بجٹ" : "Describe the job in simple words"}
          </h2>
          <p style={{ margin: "0 0 20px", color: "var(--text-2)", fontSize: "0.92rem" }}>
            {locale === "ur"
              ? "کسی تکنیکی اصطلاح کی ضرورت نہیں، بس عام الفاظ میں بتائیں کہ کیا مسئلہ پیش آ رہا ہے۔"
              : "No technical jargon needed. Tell technicians what is happening so they can quote accurately."}
          </p>

          <Field
            id="post-desc"
            label={t("post.details_label")}
            error={errors.description}
            hint={
              locale === "ur"
                ? "مثلاً: واش روم کا نل مسلسل ٹپک رہا ہے، یا پنکھا گھومتے وقت آواز دے رہا ہے۔"
                : "e.g. Water is leaking under the kitchen sink, or the fan switch sparked when turned on."
            }
          >
            {(p) => (
              <textarea
                {...p}
                rows={4}
                placeholder={t("post.details_placeholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ padding: "10px 14px", fontSize: "0.92rem" }}
              />
            )}
          </Field>

          {/* Expected Budget */}
          <div style={{ marginTop: 18 }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, marginBottom: 8 }}>
              {t("post.budget_label")}
            </label>
            {errors.budget && (
              <p style={{ color: "var(--bad)", fontSize: "0.82rem", margin: "0 0 6px" }}>
                {errors.budget}
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-3)", display: "block", marginBottom: 4 }}>
                  {locale === "ur" ? "کم از کم (روپے)" : "Minimum (PKR)"}
                </span>
                <input
                  type="number"
                  min={500}
                  step={100}
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  style={{ padding: "8px 12px", width: "100%" }}
                />
              </div>
              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-3)", display: "block", marginBottom: 4 }}>
                  {locale === "ur" ? "زیادہ سے زیادہ (روپے)" : "Maximum (PKR)"}
                </span>
                <input
                  type="number"
                  min={500}
                  step={100}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  style={{ padding: "8px 12px", width: "100%" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
              {t("post.back_btn")}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                if (validateStep3()) setStep(4);
              }}
            >
              <span>{locale === "ur" ? "جائزہ دیکھیں →" : "Review request →"}</span>
              <IconArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------ */}
      {/* STEP 4: REVIEW & PUBLISH                                     */}
      {/* ------------------------------------------------------------ */}
      {step === 4 && (
        <div className="plate" style={{ padding: 24, borderRadius: "var(--r-md)", background: "var(--ink-1)", border: "1px solid var(--line)" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.35rem", fontWeight: 800 }}>
            {t("post.summary_title")}
          </h2>
          <p style={{ margin: "0 0 20px", color: "var(--text-2)", fontSize: "0.92rem" }}>
            {t("post.free_notice")}
          </p>

          {/* Plain Language Summary Card */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "var(--r-md)",
              background: "var(--graphite-1)",
              border: "1px solid var(--line-strong)",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <span className="pill pill-ok" style={{ textTransform: "capitalize", marginBottom: 6 }}>
                  {selectedTrade}
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 800 }}>
                  {currentProblems.find((p) => p.id === selectedProblem)?.en || "Repair needed"}
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setStep(1)}
                style={{ color: "var(--emerald-400)" }}
              >
                {locale === "ur" ? "تبدیل کریں" : "Edit"}
              </button>
            </div>

            <div style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.5, marginBottom: 14 }}>
              {description.trim() || "Inspection and repair requested."}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 12, borderTop: "1px solid var(--line-soft)", fontSize: "0.85rem" }}>
              <div>
                <span style={{ color: "var(--text-3)" }}>{locale === "ur" ? "علاقہ:" : "Area:"}</span>{" "}
                <strong>{areas.find((a) => String(a.id) === areaId)?.name || "Lahore"}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-3)" }}>{locale === "ur" ? "وقت:" : "Timing:"}</span>{" "}
                <strong>{urgency === "asap" ? "Urgent (ASAP)" : urgency}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-3)" }}>{locale === "ur" ? "بجٹ:" : "Budget:"}</span>{" "}
                <strong>Rs {budgetMin} – {budgetMax}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-3)" }}>{locale === "ur" ? "پتہ کی رازداری:" : "Address:"}</span>{" "}
                <strong style={{ color: "var(--emerald-300)" }}>{locale === "ur" ? "مکمل محفوظ" : "Hidden until hire"}</strong>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--r-sm)",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              marginBottom: 24,
              fontSize: "0.85rem",
              color: "var(--emerald-300)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <IconShieldCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
            <span>
              <strong>{locale === "ur" ? "کوئی پیشگی فیس نہیں:" : "Zero upfront charges:"}</strong>{" "}
              {locale === "ur"
                ? "آپ صرف اس کاریگر کو براہ راست مزدوری ادا کرتے ہیں جس کا کام آپ کی تسلی کے مطابق مکمل ہو۔"
                : "You pay your chosen technician directly upon satisfactory completion of work."}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(3)}>
              {t("post.back_btn")}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleSubmitJob}
              disabled={submitting}
              style={{ padding: "14px 28px", fontWeight: 800 }}
            >
              {submitting
                ? locale === "ur"
                  ? "پوسٹ کیا جا رہا ہے..."
                  : "Posting..."
                : t("post.submit_btn")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
