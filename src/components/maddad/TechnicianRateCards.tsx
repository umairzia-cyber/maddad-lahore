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

export const VERIFIED_PROVIDERS: VerifiedProviderCard[] = [];

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
    { slug: "electrical", nameEn: "Electrical & Wiring", nameUr: "الیکٹریکل و وائرنگ", icon: "⚡" },
    { slug: "plumbing", nameEn: "Plumbing & Sanitary", nameUr: "پلمبنگ و سینیٹری", icon: "🚿" },
    { slug: "appliances", nameEn: "AC & Appliances", nameUr: "اے سی و ہوم اپلائنسز", icon: "❄️" },
    { slug: "beauty-salon", nameEn: "Home Salon & Mehndi", nameUr: "ہوم سیلون و مہندی", icon: "💄" },
    { slug: "home-care", nameEn: "Maids & Deep Cleaning", nameUr: "صفائی و گھریلو ملازمہ", icon: "🧹" },
    { slug: "home-repairs", nameEn: "Home Repairs & Handyman", nameUr: "گھریلو مرمت و ہینڈی مین", icon: "🛠️" },
    { slug: "carpentry", nameEn: "Carpentry & Woodwork", nameUr: "کارپینٹری و فرنیچر مرمت", icon: "🪚" },
    { slug: "painting", nameEn: "Painting & Renovation", nameUr: "پینٹنگ و تزئین", icon: "🎨" },
    { slug: "jobs-work", nameEn: "Skilled Gigs & Jobs", nameUr: "ہنر مند کام و جابز", icon: "👔" },
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
        <div
          className="category-scroll-strip"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 8,
            paddingTop: 2,
            userSelect: "none",
          }}
        >
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
                  flexShrink: 0,
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
          <div style={{ fontSize: "2.4rem", marginBottom: 10 }}>👨‍🔧</div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF" }}>
            {locale === "ur"
              ? "اس علاقے میں ابھی تک کسی کاریگر نے اپنا ریٹ کارڈ پوسٹ نہیں کیا"
              : "No technicians have posted their rate card in this area as of yet"}
          </h3>
          <p style={{ color: "var(--text-3)", fontSize: "0.88rem", margin: "0 auto 18px", maxWidth: 460, lineHeight: 1.5 }}>
            {locale === "ur"
              ? "آپ اپنی ضرورت کے مطابق مفت درخواست پوسٹ کریں تاکہ قریبی تصدیق شدہ کاریگر آپ کو لائیو ریٹس اور آمد کا وقت بھیج سکیں۔"
              : "Post a request instead — verified technicians in your area will receive instant alerts and send competitive labour quotes."}
          </p>
          <button
            type="button"
            onClick={() => onPostCustomRequest(selectedCategory !== "all" ? selectedCategory : undefined)}
            className="btn btn-primary"
            style={{ fontWeight: 700, padding: "10px 20px", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <IconZap size={16} />
            <span>{locale === "ur" ? "مسئلہ پوسٹ کریں اور بولیاں حاصل کریں" : "Post a Request & Get Bids"}</span>
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
