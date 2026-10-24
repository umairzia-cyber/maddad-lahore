"use client";

import React, { useState, useEffect, useRef } from "react";
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
  IconTag,
  IconPackage,
  IconBriefcase,
  IconSmartphone,
} from "../icons";
import { createAndPublishJobAction } from "@/app/actions";
import { detectSmartCategory, DetectedCategoryResult } from "@/lib/smartCategory";
import type { AppUser, AreaOption, CategoryOption } from "./types";
import { Field, looksLikePhone, pkr } from "./shared";
import { useI18n } from "./I18nContext";

interface PostJobProps {
  user: AppUser | null;
  categories: CategoryOption[];
  areas: AreaOption[];
  initialCategory?: string | null;
  onNeedAuth: () => void;
  onSuccess: (jobId: string) => void;
  onViewMarketplace: () => void;
}

const GUEST_DRAFT_KEY = "maddad_guest_draft_job_v1";
const POST_AFTER_AUTH_KEY = "maddad_post_after_auth";

export function PostJobView({
  user,
  categories,
  areas,
  initialCategory,
  onNeedAuth,
  onSuccess,
  onViewMarketplace,
}: PostJobProps) {
  const { locale } = useI18n();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Listing Type
  const [listingType, setListingType] = useState<"service_request" | "service_offer" | "job_opportunity">("service_request");

  // Step 2: Details
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id ? String(categories[0].id) : "1");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [autoDetected, setAutoDetected] = useState<DetectedCategoryResult | null>(null);
  const [femaleProviderOnly, setFemaleProviderOnly] = useState<boolean>(false);

  // Step 3: Pricing & Terms
  const [pricingModel, setPricingModel] = useState<"fixed" | "negotiable" | "budget_range" | "quote_requested" | "contact_for_price">("fixed");
  const [price, setPrice] = useState<string>("5000");
  const [budgetMin, setBudgetMin] = useState<string>("1500");
  const [budgetMax, setBudgetMax] = useState<string>("3000");
  const [urgency, setUrgency] = useState<"asap" | "today" | "tomorrow" | "flexible">("flexible");

  // Step 4: Location & Contact Privacy
  const [areaId, setAreaId] = useState<string>(areas[0]?.id ? String(areas[0].id) : "1");
  const [landmark, setLandmark] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>(user?.phone || "");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Draft recovery states
  const isDraftHydrated = useRef(false);
  const [draftRestored, setDraftRestored] = useState(false);

  // Restore draft from sessionStorage on mount (guest preservation across auth)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(GUEST_DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && (d.title || d.description || d.landmark)) {
          if (d.listingType) setListingType(d.listingType);
          if (d.categoryId) setCategoryId(d.categoryId);
          if (d.title) setTitle(d.title);
          if (d.description) setDescription(d.description);
          if (typeof d.femaleProviderOnly === "boolean") setFemaleProviderOnly(d.femaleProviderOnly);
          if (d.pricingModel) setPricingModel(d.pricingModel);
          if (d.price) setPrice(d.price);
          if (d.budgetMin) setBudgetMin(d.budgetMin);
          if (d.budgetMax) setBudgetMax(d.budgetMax);
          if (d.urgency) setUrgency(d.urgency);
          if (d.areaId) setAreaId(d.areaId);
          if (d.landmark) setLandmark(d.landmark);
          if (d.contactPhone && (!user?.phone || user.phone === "0300 0000000")) {
            setContactPhone(d.contactPhone);
          }
          if (d.step && [1, 2, 3, 4].includes(d.step)) {
            setStep(d.step);
          }
          setDraftRestored(true);
        }
      }
    } catch (e) {
      console.warn("Failed to restore guest draft:", e);
    } finally {
      isDraftHydrated.current = true;
    }
  }, []);

  // Keep contactPhone synced if user logs in
  useEffect(() => {
    if (user?.phone && (!contactPhone || contactPhone === "0300 0000000")) {
      setContactPhone(user.phone);
    }
  }, [user]);

  // Auto-save draft changes to sessionStorage so no inputs are lost
  useEffect(() => {
    if (typeof window === "undefined" || !isDraftHydrated.current) return;
    if (!title && !description && !landmark) return;
    try {
      const draftData = {
        step,
        listingType,
        categoryId,
        title,
        description,
        femaleProviderOnly,
        pricingModel,
        price,
        budgetMin,
        budgetMax,
        urgency,
        areaId,
        landmark,
        contactPhone,
        updatedAt: Date.now(),
      };
      sessionStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify(draftData));
    } catch {
      // Ignore quota errors
    }
  }, [
    step,
    listingType,
    categoryId,
    title,
    description,
    femaleProviderOnly,
    pricingModel,
    price,
    budgetMin,
    budgetMax,
    urgency,
    areaId,
    landmark,
    contactPhone,
  ]);

  const handleClearDraft = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(GUEST_DRAFT_KEY);
      sessionStorage.removeItem(POST_AFTER_AUTH_KEY);
    }
    setDraftRestored(false);
    setStep(1);
    setTitle("");
    setDescription("");
    setLandmark("");
    setPrice("5000");
    setBudgetMin("1500");
    setBudgetMax("3000");
    setUrgency("flexible");
    setPricingModel("fixed");
    setListingType("service_request");
    setFemaleProviderOnly(false);
    setAutoDetected(null);
    setErrors({});
  };

  // Pre-select category if passed from Hero pills
  useEffect(() => {
    if (initialCategory) {
      const match = categories.find((c) => c.slug.toLowerCase().includes(initialCategory.toLowerCase()));
      if (match) {
        setCategoryId(String(match.id));
        if (initialCategory === "plumbing" || initialCategory === "electrical") {
          setListingType("service_request");
          setPricingModel("quote_requested");
        }
      }
    }
  }, [initialCategory, categories]);

  // Real-time multilingual smart category & female preference detection
  useEffect(() => {
    const combined = `${title} ${description}`.trim();
    if (combined.length >= 3) {
      const res = detectSmartCategory(combined);
      setAutoDetected(res);
      if (res?.femaleProviderSuggested) {
        setFemaleProviderOnly(true);
      }
    } else {
      setAutoDetected(null);
    }
  }, [title, description]);

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 4) {
      errs.title = locale === "ur" ? "عنوان کم از کم 4 حروف کا ہونا چاہیے۔" : "Title must be at least 4 characters.";
    }
    if (!description.trim() || description.trim().length < 10) {
      errs.description = locale === "ur" ? "تفصیل کم از کم 10 حروف کی ہونی چاہیے۔" : "Description must be at least 10 characters.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (pricingModel === "fixed" || pricingModel === "negotiable") {
      const p = Number(price);
      if (!p || p < 50) {
        errs.price = locale === "ur" ? "براہ کرم درست رقم درج کریں۔" : "Please enter a valid price (min Rs 50).";
      }
    } else if (pricingModel === "budget_range") {
      const min = Number(budgetMin);
      const max = Number(budgetMax);
      if (!min || !max || min > max) {
        errs.price = "Minimum budget cannot exceed maximum budget.";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs: Record<string, string> = {};
    if (!contactPhone.trim() || contactPhone.trim().length < 10) {
      errs.phone = locale === "ur" ? "درست پاکستانی موبائل نمبر درج کریں۔" : "Enter a valid Pakistani mobile number.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinalPublish = async () => {
    if (!validateStep4()) return;
    if (!user) {
      if (typeof window !== "undefined") {
        try {
          const draftData = {
            step: 4,
            listingType,
            categoryId,
            title,
            description,
            femaleProviderOnly,
            pricingModel,
            price,
            budgetMin,
            budgetMax,
            urgency,
            areaId,
            landmark,
            contactPhone,
            updatedAt: Date.now(),
          };
          sessionStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify(draftData));
          sessionStorage.setItem(POST_AFTER_AUTH_KEY, "true");
        } catch {
          // ignore
        }
      }
      onNeedAuth();
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("description", description.trim());
    fd.set("categoryId", categoryId);
    fd.set("areaId", areaId);
    fd.set("landmark", landmark.trim());
    fd.set("addressText", landmark.trim() ? `Near ${landmark.trim()}` : "Lahore Neighborhood");
    fd.set("listingType", listingType);
    fd.set("pricingModel", pricingModel);
    fd.set("asap", urgency === "asap" ? "true" : "false");
    fd.set("preferredTiming", urgency);

    if (pricingModel === "fixed" || pricingModel === "negotiable") {
      fd.set("price", price);
      fd.set("budgetMin", price);
      fd.set("budgetMax", price);
    } else if (pricingModel === "budget_range") {
      fd.set("budgetMin", budgetMin);
      fd.set("budgetMax", budgetMax);
    }

    // Resolve category name
    const catName = categories.find((c) => String(c.id) === categoryId)?.name || "Services";
    fd.set("categoryName", catName);

    if (femaleProviderOnly) {
      fd.set("femaleProviderOnly", "true");
      const currentDesc = String(fd.get("description") || "");
      if (!currentDesc.includes("خاتون کاریگر") && !currentDesc.includes("Female Professional")) {
        fd.set("description", `[👩‍🦰 Female Professional Requested / خاتون پرووائیڈر] ${currentDesc}`);
      }
    }

    try {
      const res = await createAndPublishJobAction(null, fd);
      if (res?.error) {
        setServerError(res.error);
      } else {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(GUEST_DRAFT_KEY);
          sessionStorage.removeItem(POST_AFTER_AUTH_KEY);
        }
        if (res?.jobId) {
          onSuccess(res.jobId);
        } else {
          onSuccess("created");
        }
      }
    } catch (e: any) {
      setServerError(e?.message || "Failed to publish listing. Please check required fields.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategoryName = categories.find((c) => String(c.id) === categoryId)?.name || "Selected Category";
  const selectedAreaName = areas.find((a) => String(a.id) === areaId)?.name || "Lahore";

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 12px" }}>
      <div className="card" style={{ padding: "clamp(24px, 3.5vw, 40px)", background: "var(--graphite-1)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
        {/* Draft Restored Banner */}
        {draftRestored && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 16px",
              borderRadius: "var(--r-md)",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IconShieldCheck size={20} style={{ color: "var(--ok)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.88rem", color: "var(--text)" }}>
                {locale === "ur"
                  ? "آپ کی محفوظ کردہ درخواست بحال کر دی گئی ہے۔ آپ جائزہ لے کر شائع کر سکتے ہیں۔"
                  : "Your saved request draft has been restored! Review your details and publish."}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                onClick={handleClearDraft}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "var(--r-sm)",
                  padding: "4px 10px",
                  color: "var(--text-3)",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                {locale === "ur" ? "ڈرافٹ صاف کریں" : "Clear Draft"}
              </button>
              <button
                type="button"
                onClick={() => setDraftRestored(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-3)",
                  fontSize: "1rem",
                  cursor: "pointer",
                  padding: "2px 6px",
                }}
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Wizard Progress Indicator */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--violet-500)" }}>
              Step {step} of 4: {step === 1 ? "Ad Category" : step === 2 ? "Listing Details" : step === 3 ? "Pricing & Terms" : "Location & Privacy"}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onViewMarketplace}
              style={{ fontSize: "0.82rem", color: "var(--text-3)" }}
            >
              Cancel
            </button>
          </div>
          <div style={{ height: 4, width: "100%", background: "var(--graphite-2)", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${(step / 4) * 100}%`,
                background: "var(--violet-500)",
                transition: "width 0.25s ease",
              }}
            />
          </div>
        </div>

        {/* STEP 1: LISTING TYPE */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", fontWeight: 700, margin: "0 0 8px" }}>
              {locale === "ur" ? "آپ کیا پوسٹ کرنا چاہتے ہیں؟" : "What would you like to post?"}
            </h2>
            <p style={{ color: "var(--text-2)", fontSize: "0.95rem", margin: "0 0 24px" }}>
              {locale === "ur"
                ? "منتخب کریں کہ کیا آپ کو کسی سروس کی ضرورت ہے، آپ اپنی سروس پیش کر رہے ہیں، یا ملازم ہائر کر رہے ہیں۔"
                : "Choose whether you need a service, offer professional skills, or are hiring."}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>

              {/* Type 2: Service Request */}
              <div
                onClick={() => setListingType("service_request")}
                style={{
                  padding: "20px",
                  borderRadius: "var(--r-md)",
                  border: listingType === "service_request" ? "2px solid var(--violet-500)" : "1px solid var(--line)",
                  background: listingType === "service_request" ? "var(--violet-soft)" : "var(--graphite-2)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <IconWrench size={20} style={{ color: "var(--violet-500)" }} />
                  <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text)" }}>
                    {locale === "ur" ? "سروس یا کاریگر چاہیے" : "Request a Service"}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                  {locale === "ur"
                    ? "گھر کے لیے پلمبر، الیکٹریشن، اے سی ٹیکنیشن، پینٹر یا صفائی کی سروس۔"
                    : "Need a plumber, electrician, AC mechanic, painter, or carpenter in your area."}
                </p>
              </div>

              {/* Type 3: Service Offer */}
              <div
                onClick={() => setListingType("service_offer")}
                style={{
                  padding: "20px",
                  borderRadius: "var(--r-md)",
                  border: listingType === "service_offer" ? "2px solid var(--violet-500)" : "1px solid var(--line)",
                  background: listingType === "service_offer" ? "var(--violet-soft)" : "var(--graphite-2)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <IconCheck size={20} style={{ color: "var(--ok)" }} />
                  <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text)" }}>
                    {locale === "ur" ? "اپنی سروس پیش کریں" : "Offer a Service"}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                  {locale === "ur"
                    ? "فری لانس کاریگر، ہوم ٹیوٹرز، ٹیلرنگ، گاڑیوں کی صفائی، کیٹرنگ سروسز۔"
                    : "Independent technicians, home tutors, tailors, contractors, and freelance pros."}
                </p>
              </div>

              {/* Type 4: Job Opportunity */}
              <div
                onClick={() => setListingType("job_opportunity")}
                style={{
                  padding: "20px",
                  borderRadius: "var(--r-md)",
                  border: listingType === "job_opportunity" ? "2px solid var(--violet-500)" : "1px solid var(--line)",
                  background: listingType === "job_opportunity" ? "var(--violet-soft)" : "var(--graphite-2)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <IconBriefcase size={20} style={{ color: "var(--violet-500)" }} />
                  <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text)" }}>
                    {locale === "ur" ? "ملازمت اور ہائرنگ" : "Job & Hiring"}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                  {locale === "ur"
                    ? "ڈرائیور، گھریلو ملازمین، دکان کے سیلز عملہ، رائیڈرز اور کک۔"
                    : "Hiring drivers, domestic staff, retail workers, delivery riders, or office help."}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(2)}
                style={{ padding: "10px 24px" }}
              >
                <span>Continue to Details</span>
                <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS & DESCRIPTION */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", fontWeight: 700, margin: "0 0 8px" }}>
              {locale === "ur" ? "اشتہار کی تفصیلات درج کریں" : "Listing Details & Description"}
            </h2>
            <p style={{ color: "var(--text-2)", fontSize: "0.95rem", margin: "0 0 24px" }}>
              Provide clear and accurate details to get quick, relevant responses.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 28 }}>
              {/* Smart Category Auto-Detection Banner */}
              {autoDetected && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "var(--r-sm)",
                    background: "rgba(139, 92, 246, 0.12)",
                    border: "1px solid var(--violet-line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span>✨</span>
                    <span>
                      <strong>Smart Category Detected:</strong> {autoDetected.categoryName} {autoDetected.categoryNameUr ? `(${autoDetected.categoryNameUr})` : ""}
                    </span>
                    <span style={{ fontSize: "0.74rem", color: "var(--text-3)" }}>
                      via &ldquo;{autoDetected.matchedKeywords.slice(0, 3).join(", ")}&rdquo;
                    </span>
                  </div>
                  {categoryId !== String(autoDetected.categoryId) ? (
                    <button
                      type="button"
                      onClick={() => setCategoryId(String(autoDetected.categoryId))}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "3px 10px", fontSize: "0.78rem" }}
                    >
                      {locale === "ur" ? "یہ کیٹگری منتخب کریں" : "Apply Category"}
                    </button>
                  ) : (
                    <span style={{ color: "var(--emerald-400)", fontWeight: 700, fontSize: "0.78rem" }}>
                      ✓ Applied
                    </span>
                  )}
                </div>
              )}

              {/* Category selector */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-2)", fontSize: "0.92rem" }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.name_ur ? `(${c.name_ur})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                  Listing Title
                </label>
                <input
                  type="text"
                  placeholder={
                    listingType === "service_request"
                      ? "e.g. Need Plumber for Leaking Bathroom Motor in Gulberg"
                      : listingType === "service_offer"
                      ? "e.g. Professional AC Installation & Gas Refill Services"
                      : "e.g. Hiring Experienced Office Electrician / Maintenance Staff"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", fontSize: "0.92rem" }}
                />
                {errors.title && <span style={{ color: "var(--bad)", fontSize: "0.8rem", marginTop: 4, display: "block" }}>{errors.title}</span>}
              </div>

              {/* Detailed Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the issue, work scope, preferred schedule, or job requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", fontSize: "0.92rem" }}
                />
                {errors.description && <span style={{ color: "var(--bad)", fontSize: "0.8rem", marginTop: 4, display: "block" }}>{errors.description}</span>}
              </div>

              {/* Female Service Professional Only Toggle */}
              {(categoryId === "9" || categoryId === "10" || autoDetected?.femaleProviderSuggested || femaleProviderOnly) && (
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--r-sm)",
                    background: femaleProviderOnly ? "rgba(236, 72, 153, 0.12)" : "var(--graphite-2)",
                    border: femaleProviderOnly ? "1px solid rgba(236, 72, 153, 0.45)" : "1px solid var(--line)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <input
                    type="checkbox"
                    id="femaleProviderOnly"
                    checked={femaleProviderOnly}
                    onChange={(e) => setFemaleProviderOnly(e.target.checked)}
                    style={{ marginTop: 3, cursor: "pointer", width: 17, height: 17 }}
                  />
                  <div>
                    <label
                      htmlFor="femaleProviderOnly"
                      style={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: femaleProviderOnly ? "#f472b6" : "var(--text)",
                        cursor: "pointer",
                        display: "block",
                      }}
                    >
                      👩‍🦰 {locale === "ur" ? "صرف خاتون کاریگر / بیوٹیشن (Female Professional Only)" : "Female Service Professional Only"}
                    </label>
                    <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--text-3)", lineHeight: 1.4 }}>
                      {locale === "ur"
                        ? "یہ درخواست صرف تصدیق شدہ خواتین کاریگروں اور ہوم سیلون پروفیشنلز کو بھیجی جائے گی۔"
                        : "Recommended for home salon, mehndi, and domestic maid requests. Only verified female professionals in your radius will be alerted."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                <IconArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
              >
                <span>Continue to Pricing</span>
                <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PRICING & TERMS */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", fontWeight: 700, margin: "0 0 8px" }}>
              {locale === "ur" ? "قیمت اور شرائط طے کریں" : "Pricing & Terms"}
            </h2>
            <p style={{ color: "var(--text-2)", fontSize: "0.95rem", margin: "0 0 24px" }}>
              Set your expectations clearly so interested buyers or providers know what to expect.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 28 }}>
              {/* Pricing Model selection */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                  Pricing Model
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setPricingModel("fixed")}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--r-sm)",
                      border: pricingModel === "fixed" ? "2px solid var(--violet-500)" : "1px solid var(--line)",
                      background: pricingModel === "fixed" ? "var(--violet-soft)" : "var(--graphite-2)",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                    }}
                  >
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingModel("negotiable")}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--r-sm)",
                      border: pricingModel === "negotiable" ? "2px solid var(--violet-500)" : "1px solid var(--line)",
                      background: pricingModel === "negotiable" ? "var(--violet-soft)" : "var(--graphite-2)",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                    }}
                  >
                    Negotiable
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingModel("quote_requested")}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--r-sm)",
                      border: pricingModel === "quote_requested" ? "2px solid var(--violet-500)" : "1px solid var(--line)",
                      background: pricingModel === "quote_requested" ? "var(--violet-soft)" : "var(--graphite-2)",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                    }}
                  >
                    Request Quotes
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingModel("budget_range")}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--r-sm)",
                      border: pricingModel === "budget_range" ? "2px solid var(--violet-500)" : "1px solid var(--line)",
                      background: pricingModel === "budget_range" ? "var(--violet-soft)" : "var(--graphite-2)",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                    }}
                  >
                    Budget Range
                  </button>
                </div>
              </div>

              {/* Price inputs based on model */}
              {(pricingModel === "fixed" || pricingModel === "negotiable") && (
                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                    Price (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", fontSize: "0.95rem" }}
                  />
                  {errors.price && <span style={{ color: "var(--bad)", fontSize: "0.8rem", marginTop: 4, display: "block" }}>{errors.price}</span>}
                </div>
              )}

              {pricingModel === "budget_range" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                      Minimum (PKR)
                    </label>
                    <input
                      type="number"
                      placeholder="1500"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                      Maximum (PKR)
                    </label>
                    <input
                      type="number"
                      placeholder="3500"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}
                    />
                  </div>
                </div>
              )}

              {/* Timing */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                  Timing Preference
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { id: "flexible", label: "Flexible Schedule" },
                    { id: "asap", label: "⚡ Immediate / ASAP" },
                    { id: "today", label: "Today" },
                    { id: "tomorrow", label: "Tomorrow / Weekend" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setUrgency(t.id as any)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "var(--r-pill)",
                        border: urgency === t.id ? "1px solid var(--violet-500)" : "1px solid var(--line)",
                        background: urgency === t.id ? "var(--violet-soft)" : "transparent",
                        color: urgency === t.id ? "var(--violet-700)" : "var(--text-2)",
                        fontWeight: 600,
                        fontSize: "0.84rem",
                        cursor: "pointer",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                <IconArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (validateStep3()) setStep(4);
                }}
              >
                <span>Continue to Location</span>
                <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION & PRIVACY */}
        {step === 4 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", fontWeight: 700, margin: "0 0 8px" }}>
              {locale === "ur" ? "مقام اور رازداری کا تحفظ" : "Location & Privacy Protection"}
            </h2>
            <p style={{ color: "var(--text-2)", fontSize: "0.95rem", margin: "0 0 24px" }}>
              Only your approximate Lahore neighborhood is public. Exact street addresses stay strictly locked until mutual agreement.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 28 }}>
              {/* Lahore Area */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                  Lahore Neighbourhood / Area
                </label>
                <select
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--graphite-2)", fontSize: "0.92rem" }}
                >
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              {/* Private Landmark / House info */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                  Street / Landmark (Strictly Private)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Siddique Trade Center, Main Boulevard"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", fontSize: "0.92rem" }}
                />
                <span style={{ fontSize: "0.8rem", color: "var(--text-3)", marginTop: 4, display: "block" }}>
                  🔒 Kept private. Only shared with the single person you agree to deal with.
                </span>
              </div>

              {/* Contact Phone */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                  Contact Mobile Number (Pakistani SIM)
                </label>
                <input
                  type="tel"
                  placeholder="0300 1234567"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", fontSize: "0.92rem" }}
                />
                {errors.phone && <span style={{ color: "var(--bad)", fontSize: "0.8rem", marginTop: 4, display: "block" }}>{errors.phone}</span>}
              </div>

              {/* Summary Review Card */}
              <div style={{ padding: 16, background: "var(--graphite-2)", borderRadius: "var(--r-md)", border: "1px solid var(--line-soft)" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", marginBottom: 6 }}>
                  Summary Preview
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text)", marginBottom: 4 }}>
                  {title || "Untitled Listing"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
                  {selectedCategoryName} · {selectedAreaName}, Lahore · {pricingModel === "fixed" ? pkr(Number(price)) : pricingModel}
                </div>
              </div>

              {serverError && (
                <div style={{ padding: "12px 14px", background: "rgba(155, 44, 44, 0.08)", border: "1px solid var(--bad)", borderRadius: "var(--r-sm)", color: "var(--bad)", fontSize: "0.88rem" }}>
                  {serverError}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(3)} disabled={submitting}>
                <IconArrowLeft size={16} />
                <span>{locale === "ur" ? "پیچھے" : "Back"}</span>
              </button>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleFinalPublish}
                  disabled={submitting}
                  style={{ padding: "10px 28px" }}
                >
                  <span>
                    {submitting
                      ? (locale === "ur" ? "شائع ہو رہا ہے..." : "Publishing...")
                      : (!user
                          ? (locale === "ur" ? "لاگ اِن کر کے شائع کریں" : "Sign In & Publish")
                          : (locale === "ur" ? "درخواست شائع کریں" : "Publish Listing"))}
                  </span>
                  <IconCheck size={16} />
                </button>
                {!user && (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                    {locale === "ur"
                      ? "ڈرافٹ خودکار محفوظ ہو جائے گا اور لاگ اِن کے بعد ضائع نہیں ہوگا"
                      : "Draft is preserved safely across phone sign-in"}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
