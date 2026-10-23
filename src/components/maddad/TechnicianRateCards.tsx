"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  IconStar,
  IconShieldCheck,
  IconMapPin,
  IconClock,
  IconPhone,
  IconArrowRight,
  IconCheck,
  IconZap,
  IconWrench,
} from "../icons";
import { pkr } from "./shared";
import { useI18n } from "./I18nContext";
import type { AppUser, AreaOption } from "./types";

export interface ServiceRateCardItem {
  id: string;
  serviceTitle: string;
  serviceTitleUr: string;
  fixedPricePkr: number;
  unit: string;
  estimatedDuration: string;
}

export interface VerifiedProviderCard {
  id: string;
  name: string;
  nameUr: string;
  trade: string;
  tradeUr: string;
  categorySlug: string;
  categoryName: string;
  phone: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  isVerified: boolean;
  isFemaleProvider?: boolean;
  primaryArea: string;
  areasServed: string[];
  startingRatePkr: number;
  bio: string;
  bioUr: string;
  responseTime: string;
  rateCards: ServiceRateCardItem[];
}

export const VERIFIED_PROVIDERS: VerifiedProviderCard[] = [
  {
    id: "provider-akram-plumb",
    name: "Muhammad Akram",
    nameUr: "محمد اکرم",
    trade: "Plumbing & Sanitary Specialist",
    tradeUr: "ماہر پلمبر و سینیٹری",
    categorySlug: "plumbing",
    categoryName: "Plumbing",
    phone: "0300 7778899",
    rating: 4.9,
    reviewCount: 38,
    experienceYears: 14,
    isVerified: true,
    primaryArea: "Gulberg",
    areasServed: ["Gulberg", "Model Town", "Garden Town", "Faisal Town"],
    startingRatePkr: 500,
    bio: "Certified sanitary master specializing in underground leakage detection, water motor repair, and imported mixer/commode fittings.",
    bioUr: "انڈر گراؤنڈ لیکیج، واٹر موٹر، گیزر اور امپورٹڈ سینیٹری فٹنگ کے 14 سالہ تجربہ کار استاد۔",
    responseTime: "Arrives in 30-45 mins",
    rateCards: [
      { id: "rc-1", serviceTitle: "Tap / Mixer Replacement", serviceTitleUr: "نلکا یا مکسر تبدیلی", fixedPricePkr: 800, unit: "per fixture", estimatedDuration: "30 mins" },
      { id: "rc-2", serviceTitle: "Water Motor / Donkey Pump Service", serviceTitleUr: "واٹر موٹر و پمپ سروس", fixedPricePkr: 1200, unit: "per motor", estimatedDuration: "1 hour" },
      { id: "rc-3", serviceTitle: "Geyser Installation (Gas/Electric)", serviceTitleUr: "گیزر فٹنگ و تنصیب", fixedPricePkr: 2000, unit: "per geyser", estimatedDuration: "1.5 hours" },
      { id: "rc-4", serviceTitle: "Drainage / Pipe Unclogging", serviceTitleUr: "بند پائپ و نکاسی صفائی", fixedPricePkr: 1500, unit: "per line", estimatedDuration: "45 mins" },
    ],
  },
  {
    id: "provider-rashid-elec",
    name: "Rashid Mehmood",
    nameUr: "راشد محمود",
    trade: "Licensed Electrician & UPS Tech",
    tradeUr: "لائسنس یافتہ الیکٹریشن و یو پی ایس",
    categorySlug: "electrical",
    categoryName: "Electrical",
    phone: "0300 4445566",
    rating: 4.8,
    reviewCount: 44,
    experienceYears: 11,
    isVerified: true,
    primaryArea: "Johar Town",
    areasServed: ["Johar Town", "Faisal Town", "Wapda Town", "Township"],
    startingRatePkr: 500,
    bio: "Domestic and commercial electrician. Specializes in distribution board breakers, UPS inverter wiring, short-circuit troubleshooting, and energy audits.",
    bioUr: "ڈی بی باکس بریکر، یو پی ایس انورٹر وائرنگ اور شارٹ سرکٹ فالٹ ٹریسنگ میں 11 سالہ تجربہ۔",
    responseTime: "Arrives in 35-50 mins",
    rateCards: [
      { id: "rc-5", serviceTitle: "Ceiling Fan / Bracket Fan Installation", serviceTitleUr: "چھت یا دیوار پنکھا فٹنگ", fixedPricePkr: 500, unit: "per fan", estimatedDuration: "30 mins" },
      { id: "rc-6", serviceTitle: "Main DB Breaker / Switchboard Repair", serviceTitleUr: "مین ڈی بی بریکر مرمت", fixedPricePkr: 1000, unit: "per board", estimatedDuration: "45 mins" },
      { id: "rc-7", serviceTitle: "UPS & Inverter Full Wiring Setup", serviceTitleUr: "یو پی ایس انورٹر مکمل وائرنگ", fixedPricePkr: 1500, unit: "complete setup", estimatedDuration: "1.5 hours" },
      { id: "rc-8", serviceTitle: "Short Circuit Fault Detection", serviceTitleUr: "شارٹ سرکٹ فالٹ ٹریسنگ", fixedPricePkr: 1200, unit: "per circuit", estimatedDuration: "1 hour" },
    ],
  },
  {
    id: "provider-zainab-salon",
    name: "Zainab Bibi",
    nameUr: "زینب بی بی",
    trade: "Bridal Mehndi & Home Beautician",
    tradeUr: "برائیڈل مہندی و ہوم بیوٹیشن",
    categorySlug: "beauty-salon",
    categoryName: "Home Salon & Beauty",
    phone: "0300 8889900",
    rating: 5.0,
    reviewCount: 52,
    experienceYears: 9,
    isVerified: true,
    isFemaleProvider: true,
    primaryArea: "DHA Phase 5",
    areasServed: ["DHA Phase 5", "DHA Phase 6", "Gulberg", "Lahore Cantt", "Askari 10"],
    startingRatePkr: 1200,
    bio: "Professional female beautician offering doorstep parlour services. Specializes in organic Rajasthani bridal mehndi, party makeup, HydraFacial, and waxing.",
    bioUr: "گھر پر خواتین کے لیے پرائیویٹ سروس: آرگینک برائیڈل مہندی، پارٹی میک اپ، فیشل اور مینیکیور۔",
    responseTime: "Pre-bookable / Within 1 hour in DHA",
    rateCards: [
      { id: "rc-9", serviceTitle: "Party Mehndi (Both Hands Both Sides)", serviceTitleUr: "پارٹی مہندی (دونوں ہاتھ دونوں طرف)", fixedPricePkr: 1500, unit: "per person", estimatedDuration: "45 mins" },
      { id: "rc-10", serviceTitle: "Full Bridal Mehndi (Hands & Feet)", serviceTitleUr: "مکمل برائیڈل مہندی (ہاتھ و پاؤں)", fixedPricePkr: 7500, unit: "bridal package", estimatedDuration: "3 hours" },
      { id: "rc-11", serviceTitle: "Party Makeup & Hair Blowdry", serviceTitleUr: "پارٹی میک اپ و ہئیر اسٹائلنگ", fixedPricePkr: 4500, unit: "per person", estimatedDuration: "1.5 hours" },
      { id: "rc-12", serviceTitle: "Herbal Glow Facial & Waxing", serviceTitleUr: "ہربل گلو فیشل و فل باڈی ویکس", fixedPricePkr: 3000, unit: "complete package", estimatedDuration: "1.5 hours" },
    ],
  },
  {
    id: "provider-aslam-ac",
    name: "Aslam AC Solutions",
    nameUr: "اسلم اے سی ماسٹرز",
    trade: "HVAC & Inverter AC Technician",
    tradeUr: "اے سی سروس و گیس چارجنگ",
    categorySlug: "appliances",
    categoryName: "AC & Appliances",
    phone: "0300 3332211",
    rating: 4.8,
    reviewCount: 61,
    experienceYears: 13,
    isVerified: true,
    primaryArea: "Wapda Town",
    areasServed: ["Wapda Town", "Johar Town", "Bahria Town", "Valencia Town"],
    startingRatePkr: 1500,
    bio: "Master compressor and inverter AC cooling specialist. Offers complete chemical pressure wash without removing indoor unit, genuine R410/R32 gas refills.",
    bioUr: "انورٹر اے سی کیمیکل پریشر واش، اوریجنل گیس چارجنگ اور پی سی بی سرکٹ مرمت۔",
    responseTime: "Arrives in 40 mins",
    rateCards: [
      { id: "rc-13", serviceTitle: "AC Chemical Pressure Wash (Indoor + Outdoor)", serviceTitleUr: "اے سی کیمیکل پریشر واش", fixedPricePkr: 1800, unit: "per split AC", estimatedDuration: "45 mins" },
      { id: "rc-14", serviceTitle: "Inverter AC Gas Top-up (R410A / R32)", serviceTitleUr: "اوریجنل اے سی گیس ری فل", fixedPricePkr: 2500, unit: "per unit", estimatedDuration: "1 hour" },
      { id: "rc-15", serviceTitle: "New AC Installation & Copper Piping", serviceTitleUr: "نئے اے سی کی تنصیب و پائپنگ", fixedPricePkr: 3500, unit: "per unit", estimatedDuration: "2 hours" },
      { id: "rc-16", serviceTitle: "Refrigerator / Deep Freezer Gas & Cooling Repair", serviceTitleUr: "فریج و فریزر گیس و فالٹ مرمت", fixedPricePkr: 2200, unit: "per appliance", estimatedDuration: "1.5 hours" },
    ],
  },
  {
    id: "provider-kausar-care",
    name: "Kausar Domestic Care",
    nameUr: "کوثر گھریلو صفائی و ملازمہ",
    trade: "Home Cleaning & Domestic Staff",
    tradeUr: "گھریلو صفائی و ہاؤس میڈ سروس",
    categorySlug: "home-care",
    categoryName: "Maids & Home Care",
    phone: "0300 9991122",
    rating: 4.9,
    reviewCount: 29,
    experienceYears: 8,
    isVerified: true,
    isFemaleProvider: true,
    primaryArea: "Model Town",
    areasServed: ["Model Town", "Gulberg", "Garden Town", "Faisal Town"],
    startingRatePkr: 2000,
    bio: "CNIC-verified female domestic care team providing deep house cleaning, post-renovation dust removal, sofa & mattress shampooing, and reliable day maids.",
    bioUr: "نادرا تصدیق شدہ خواتین اسٹاف: گھر کی ڈیپ کلیننگ، صوفہ کارپٹ شیمپو واش اور روزانہ کی ملازمہ۔",
    responseTime: "Same-day or next-day booking",
    rateCards: [
      { id: "rc-17", serviceTitle: "Deep House Cleaning (Kitchen + Washrooms + Floors)", serviceTitleUr: "گھر کی مکمل ڈیپ کلیننگ", fixedPricePkr: 3500, unit: "up to 1 Kanal", estimatedDuration: "3-4 hours" },
      { id: "rc-18", serviceTitle: "Sofa Set Shampoo Wash (5 Seater)", serviceTitleUr: "صوفہ سیٹ شیمپو واش (5 سیٹر)", fixedPricePkr: 2000, unit: "per set", estimatedDuration: "1.5 hours" },
      { id: "rc-19", serviceTitle: "Kitchen Deep Degreasing & Hood Wash", serviceTitleUr: "کچن آئل صفائی و ہڈ واش", fixedPricePkr: 2500, unit: "per kitchen", estimatedDuration: "2 hours" },
      { id: "rc-20", serviceTitle: "Water Overhead Tank Deep Sterilization", serviceTitleUr: "پانی کی ٹنکی کیمیکل جراثیم کش صفائی", fixedPricePkr: 1800, unit: "per tank", estimatedDuration: "1 hour" },
    ],
  },
];

interface TechnicianRateCardsProps {
  user: AppUser | null;
  areas: AreaOption[];
  onOpenChatWithProvider: (provider: VerifiedProviderCard, service?: ServiceRateCardItem) => void;
  onPostCustomRequest: (categorySlug?: string) => void;
  initialCategory?: string;
}

export function TechnicianRateCards({
  user,
  areas,
  onOpenChatWithProvider,
  onPostCustomRequest,
  initialCategory,
}: TechnicianRateCardsProps) {
  const { locale } = useI18n();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [femaleOnlyFilter, setFemaleOnlyFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedProviderId, setExpandedProviderId] = useState<string | null>(null);

  const categoriesTab = [
    { slug: "all", nameEn: "All Services", nameUr: "تمام سروسز", icon: "🌐" },
    { slug: "electrical", nameEn: "⚡ Electrical", nameUr: "الیکٹریکل", icon: "⚡" },
    { slug: "plumbing", nameEn: "🚰 Plumbing", nameUr: "پلمبنگ", icon: "🚰" },
    { slug: "appliances", nameEn: "❄️ AC & Cooling", nameUr: "اے سی و کولنگ", icon: "❄️" },
    { slug: "beauty-salon", nameEn: "💅 Salon & Mehndi", nameUr: "سیلون و مہندی", icon: "💅" },
    { slug: "home-care", nameEn: "🧹 Maids & Cleaning", nameUr: "ملازمہ و صفائی", icon: "🧹" },
  ];

  const filteredProviders = useMemo(() => {
    return VERIFIED_PROVIDERS.filter((p) => {
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) return false;
      if (femaleOnlyFilter && !p.isFemaleProvider) return false;
      if (selectedArea !== "all") {
        const areaName = areas.find((a) => String(a.id) === selectedArea)?.name || selectedArea;
        const matchesArea =
          p.primaryArea.toLowerCase() === areaName.toLowerCase() ||
          p.areasServed.some((a) => a.toLowerCase().includes(areaName.toLowerCase()));
        if (!matchesArea) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          p.name.toLowerCase().includes(q) ||
          p.trade.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.rateCards.some((rc) => rc.serviceTitle.toLowerCase().includes(q));
        if (!matchesText) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedArea, femaleOnlyFilter, searchQuery, areas]);

  return (
    <div id="providers-catalog" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Banner */}
      <div
        style={{
          padding: "20px 24px",
          borderRadius: "var(--r-md)",
          background: "linear-gradient(135deg, rgba(20, 20, 28, 0.95), rgba(30, 20, 45, 0.95))",
          border: "1px solid var(--violet-line)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "1.3rem" }}>📋</span>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 800, color: "var(--emerald-400)", letterSpacing: "0.08em" }}>
              {locale === "ur" ? "تصدیق شدہ کاریگر و ریٹ کارڈز" : "Verified Providers & Standard Rate Cards"}
            </span>
          </div>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF" }}>
            {locale === "ur" ? "لاہور میں براہ راست کاریگر ہائر کریں" : "Direct Hire from Local Lahore Providers"}
          </h2>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-2)" }}>
            {locale === "ur"
              ? "مقررہ فکس ریٹس دیکھیں۔ اشتہار کے بغیر براہ راست واٹس ایپ یا پرائیویٹ چیٹ پر بات کریں۔"
              : "Compare fixed rate-cards with no surprises. Contact directly via WhatsApp or chat anonymously before hiring."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onPostCustomRequest(selectedCategory !== "all" ? selectedCategory : undefined)}
          className="btn btn-primary"
          style={{ fontWeight: 800 }}
        >
          <span>{locale === "ur" ? "+ اپنا مسئلہ پوسٹ کریں (بولیاں لیں)" : "+ Post Custom Request (Get Bids)"}</span>
          <IconArrowRight size={15} />
        </button>
      </div>

      {/* Filter Bar: Categories, Areas & Female Filter */}
      <div
        style={{
          padding: "16px",
          borderRadius: "var(--r-md)",
          background: "var(--graphite-1)",
          border: "1px solid var(--line)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Category Chips */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
          {categoriesTab.map((cat) => {
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--r-sm)",
                  fontSize: "0.86rem",
                  fontWeight: active ? 700 : 500,
                  background: active ? "var(--violet-600)" : "var(--graphite-2)",
                  color: active ? "#FFFFFF" : "var(--text-2)",
                  border: active ? "1px solid var(--violet-400)" : "1px solid var(--line)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{cat.icon}</span>
                <span>{locale === "ur" ? cat.nameUr : cat.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Area dropdown + Search + Female filter */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search Box */}
          <div style={{ flex: "1 1 240px" }}>
            <input
              type="search"
              placeholder={
                locale === "ur"
                  ? "کاریگر کا نام، سروس یا کام تلاش کریں (مثلاً پنکھا، گیزر، مہندی)..."
                  : "Search service (e.g. AC wash, fan install, mehndi, deep clean)..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "var(--r-sm)",
                border: "1px solid var(--line)",
                background: "var(--graphite-2)",
                fontSize: "0.88rem",
              }}
            />
          </div>

          {/* Area Selector */}
          <div style={{ minWidth: 200 }}>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "var(--r-sm)",
                border: "1px solid var(--line)",
                background: "var(--graphite-2)",
                fontSize: "0.88rem",
              }}
            >
              <option value="all">📍 {locale === "ur" ? "تمام لاہور (All Areas)" : "All Lahore Areas"}</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Female Only Safety Toggle */}
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 12px",
              borderRadius: "var(--r-sm)",
              background: femaleOnlyFilter ? "rgba(236, 72, 153, 0.15)" : "var(--graphite-2)",
              border: femaleOnlyFilter ? "1px solid rgba(236, 72, 153, 0.5)" : "1px solid var(--line)",
              color: femaleOnlyFilter ? "#f472b6" : "var(--text-2)",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={femaleOnlyFilter}
              onChange={(e) => setFemaleOnlyFilter(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <span>👩‍🦰 {locale === "ur" ? "صرف خواتین کاریگر (Female Only)" : "Female Providers Only"}</span>
          </label>
        </div>
      </div>

      {/* Providers Grid */}
      {filteredProviders.length === 0 ? (
        <div
          style={{
            padding: "48px 20px",
            textAlign: "center",
            background: "var(--graphite-1)",
            borderRadius: "var(--r-md)",
            border: "1px dashed var(--line-strong)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>🔍</div>
          <h3 style={{ margin: "0 0 6px", fontSize: "1.1rem" }}>
            {locale === "ur" ? "اس معیار پر کوئی ریٹ کارڈ دستیاب نہیں" : "No rate cards found for this filter"}
          </h3>
          <p style={{ color: "var(--text-3)", fontSize: "0.88rem", margin: "0 0 16px" }}>
            {locale === "ur"
              ? "آپ اپنی ضرورت کے مطابق مفت اشتہار لگا سکتے ہیں تاکہ قریبی کاریگر اپنی قیمتیں پیش کریں۔"
              : "Post a custom request instead to have technicians in your area send fast quotes."}
          </p>
          <button
            type="button"
            onClick={() => onPostCustomRequest(selectedCategory !== "all" ? selectedCategory : undefined)}
            className="btn btn-primary btn-sm"
          >
            <span>{locale === "ur" ? "مسئلہ پوسٹ کریں" : "Post a Request"}</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 18,
          }}
        >
          {filteredProviders.map((provider) => {
            const isExpanded = expandedProviderId === provider.id;
            const displayedCards = isExpanded ? provider.rateCards : provider.rateCards.slice(0, 2);

            // WhatsApp link preparation
            const cleanPhone = provider.phone.replace(/[^0-9]/g, "");
            const waNumber = cleanPhone.startsWith("0") ? `92${cleanPhone.slice(1)}` : cleanPhone;
            const waText = encodeURIComponent(
              `Assalam-o-Alaikum ${provider.name}, I saw your rate card on Madadgaar Lahore for ${provider.trade}. Are you available today?`
            );

            return (
              <div
                key={provider.id}
                style={{
                  padding: "20px",
                  borderRadius: "var(--r-md)",
                  background: "var(--graphite-1)",
                  border: "1px solid var(--line)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 16,
                  transition: "border-color 0.15s ease",
                }}
              >
                <div>
                  {/* Provider Header: Avatar, Name, Rating, Badges */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
                        <span style={{ fontSize: "1.12rem", fontWeight: 800, color: "#FFFFFF" }}>
                          {locale === "ur" ? provider.nameUr : provider.name}
                        </span>
                        {provider.isVerified && (
                          <span
                            title="CNIC Verified Technician"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "var(--emerald-300)",
                              border: "1px solid rgba(16, 185, 129, 0.4)",
                              padding: "2px 6px",
                              borderRadius: "var(--r-pill)",
                            }}
                          >
                            <IconShieldCheck size={12} />
                            <span>Verified</span>
                          </span>
                        )}
                        {provider.isFemaleProvider && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              background: "rgba(236, 72, 153, 0.15)",
                              color: "#f472b6",
                              border: "1px solid rgba(236, 72, 153, 0.4)",
                              padding: "2px 6px",
                              borderRadius: "var(--r-pill)",
                            }}
                          >
                            👩‍🦰 Female Provider
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: "0.84rem", color: "var(--violet-300)", fontWeight: 600 }}>
                        {locale === "ur" ? provider.tradeUr : provider.trade}
                      </div>
                    </div>

                    {/* Rating Pill */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "4px 8px",
                        borderRadius: "var(--r-sm)",
                        background: "rgba(251, 191, 36, 0.15)",
                        border: "1px solid rgba(251, 191, 36, 0.4)",
                        color: "#fbbf24",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                      }}
                    >
                      <IconStar size={13} style={{ fill: "#fbbf24" }} />
                      <span>{provider.rating.toFixed(1)}</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-3)", fontWeight: 500 }}>
                        ({provider.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Location & Speed Meta */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      marginTop: 8,
                      fontSize: "0.78rem",
                      color: "var(--text-3)",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <IconMapPin size={13} style={{ color: "var(--violet-400)" }} />
                      <span>{provider.primaryArea}</span>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <IconClock size={13} style={{ color: "var(--emerald-400)" }} />
                      <span>{provider.responseTime}</span>
                    </span>
                    <span>· {provider.experienceYears} yrs exp</span>
                  </div>

                  {/* Bio snippet */}
                  <p
                    style={{
                      margin: "10px 0 14px",
                      fontSize: "0.83rem",
                      color: "var(--text-2)",
                      lineHeight: 1.45,
                    }}
                  >
                    {locale === "ur" ? provider.bioUr : provider.bio}
                  </p>

                  {/* Standard Rate Cards Table */}
                  <div
                    style={{
                      borderRadius: "var(--r-sm)",
                      background: "var(--graphite-2)",
                      border: "1px solid var(--line-soft)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 12px",
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: "var(--text-3)",
                        borderBottom: "1px solid var(--line-soft)",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Standard Rate Card (فکس ریٹ)</span>
                      <span>Fixed Price</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {displayedCards.map((rc) => (
                        <div
                          key={rc.id}
                          style={{
                            padding: "9px 12px",
                            borderBottom: "1px solid var(--line-soft)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "0.82rem",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text)" }}>
                              {locale === "ur" ? rc.serviceTitleUr : rc.serviceTitle}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>
                              {rc.estimatedDuration} · {rc.unit}
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, color: "var(--emerald-400)", fontSize: "0.92rem" }}>
                            {pkr(rc.fixedPricePkr)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {provider.rateCards.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setExpandedProviderId(isExpanded ? null : provider.id)}
                        style={{
                          width: "100%",
                          padding: "6px",
                          background: "transparent",
                          border: "none",
                          fontSize: "0.75rem",
                          color: "var(--violet-300)",
                          cursor: "pointer",
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        {isExpanded
                          ? locale === "ur" ? "کم تفصیل دیکھیں ▲" : "Show less ▲"
                          : `+${provider.rateCards.length - 2} ${locale === "ur" ? "مزید سروسز دیکھیں ▼" : "more services ▼"}`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 8, borderTop: "1px solid var(--line-soft)" }}>
                  <button
                    type="button"
                    onClick={() => onOpenChatWithProvider(provider)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, minWidth: 120, justifyContent: "center", fontSize: "0.8rem" }}
                  >
                    <span>💬</span>
                    <span>{locale === "ur" ? "پرائیویٹ چیٹ" : "Private Chat"}</span>
                  </button>

                  <a
                    href={`https://wa.me/${waNumber}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ok btn-sm"
                    style={{
                      flex: 1,
                      minWidth: 120,
                      justifyContent: "center",
                      background: "#25D366",
                      color: "#FFFFFF",
                      textDecoration: "none",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>🟢</span>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
