"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import {
  IconSearch,
  IconPlus,
  IconBriefcase,
  IconZap,
  IconUser,
  IconBell,
  IconShield,
  IconSettings,
  IconArrowLeft,
  IconWrench,
} from "./icons";
import {
  AppUser,
  PublicJobItem,
  CustomerJobItem,
  BookingItem,
  WorkerBidItem,
  NotificationItem,
  ReportItem,
  AuditLogItem,
  WorkerProfileData,
  AreaOption,
  CategoryOption,
  DemoAccount,
} from "./maddad/types";
import { ToastRegion, useToasts, pkr } from "./maddad/shared";
import {
  Hero,
  HowItWorks,
  TrustPanel,
  MarketplaceView,
  JobDialog,
} from "./maddad/Marketplace";
import { PostJobView } from "./maddad/PostJob";
import {
  CustomerDashboardView,
  WorkerDashboardView,
} from "./maddad/Dashboards";
import { WorkerProfileView } from "./maddad/WorkerProfile";
import { AuthView } from "./maddad/AuthView";
import { NotificationsView } from "./maddad/NotificationsView";
import { switchDemoUserAction, logoutAction } from "@/app/actions";
import { ModerationView } from "./maddad/ModerationView";
import { SettingsView } from "./maddad/SettingsView";
import { I18nProvider, useI18n } from "./maddad/I18nContext";

export interface UnifiedAppProps {
  currentUser: AppUser | null;
  initialView?: string | null;
  initialPublicJobs: PublicJobItem[];
  initialCustomerJobs: CustomerJobItem[];
  initialCustomerBookings: BookingItem[];
  initialWorkerBids: WorkerBidItem[];
  initialWorkerJobs: PublicJobItem[];
  initialNotifications: NotificationItem[];
  initialReports: ReportItem[];
  initialAuditLogs: AuditLogItem[];
  initialWorkerProfile: WorkerProfileData | null;
  demoAccounts: DemoAccount[] | null;
  areas: AreaOption[];
  categories: CategoryOption[];
}

type TabType =
  | "marketplace"
  | "post"
  | "customer_dashboard"
  | "worker_dashboard"
  | "worker_profile"
  | "notifications"
  | "moderation"
  | "settings"
  | "auth";

function resolveInitialTab(view?: string | null, user?: AppUser | null): TabType {
  if (!view) return "marketplace";
  const v = view.toLowerCase().trim();
  if (v === "post" || v === "post_job" || v === "new") return "post";
  if (v === "join" || v === "worker" || v === "worker_dashboard" || v === "bids") return "worker_dashboard";
  if (v === "profile" || v === "worker_profile") return "worker_profile";
  if (v === "jobs" || v === "dashboard" || v === "customer" || v === "customer_dashboard") return "customer_dashboard";
  if (v === "signin" || v === "login" || v === "auth" || v === "signup" || v === "register") return "auth";
  if (v === "notifications" || v === "alerts") return "notifications";
  if (v === "moderation" || v === "admin") return "moderation";
  if (v === "settings" || v === "account") return "settings";
  return "marketplace";
}

function UnifiedAppContent({
  currentUser,
  initialView,
  initialPublicJobs,
  initialCustomerJobs,
  initialCustomerBookings,
  initialWorkerBids,
  initialWorkerJobs,
  initialNotifications,
  initialReports,
  initialAuditLogs,
  initialWorkerProfile,
  demoAccounts,
  areas,
  categories,
}: UnifiedAppProps) {
  const { t, locale, toggleLocale } = useI18n();
  const [activeTab, setActiveTab] = useState<TabType>(() =>
    resolveInitialTab(initialView, currentUser),
  );
  const [preselectedCategory, setPreselectedCategory] = useState<string | null>(null);
  const [marketplaceMode, setMarketplaceMode] = useState<"requests" | "rate_cards">("requests");
  const [marketplaceCategory, setMarketplaceCategory] = useState<string>("all");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeJobModal, setActiveJobModal] = useState<PublicJobItem | null>(null);
  const [showDemoPersonas, setShowDemoPersonas] = useState(false);

  const { toasts, push: showToast } = useToasts();

  // Listen to searchParams changes if URL changes externally (e.g. clicking header buttons)
  useEffect(() => {
    if (initialView) {
      setActiveTab(resolveInitialTab(initialView, currentUser));
    }
  }, [initialView, currentUser]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read_at).length,
    [notifications],
  );

  const ownJobIds = useMemo(() => {
    const s = new Set<string>();
    initialCustomerJobs.forEach((j) => s.add(j.id));
    return s;
  }, [initialCustomerJobs]);

  const activeCustomerJob = useMemo(() => {
    return initialCustomerJobs.find((j) => j.status === "open");
  }, [initialCustomerJobs]);

  const [dismissRadarBanner, setDismissRadarBanner] = useState(false);

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    // Smoothly update browser URL without hard page refresh
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tab === "marketplace") {
        url.searchParams.delete("view");
      } else {
        url.searchParams.set("view", tab);
      }
      window.history.replaceState({}, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const realCount = useMemo(
    () => initialPublicJobs.filter((j) => !j.is_demo).length,
    [initialPublicJobs],
  );
  const sampleCount = useMemo(
    () => initialPublicJobs.filter((j) => j.is_demo).length,
    [initialPublicJobs],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "80vh" }}>
      {/* Toast notifications */}
      <ToastRegion toasts={toasts} />

      {/* Controlled Test Personas Switcher (Collapsed by default in production) */}
      {demoAccounts && demoAccounts.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {!showDemoPersonas ? (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowDemoPersonas(true)}
                style={{
                  background: "transparent",
                  border: "1px dashed var(--line)",
                  borderRadius: "var(--r-pill)",
                  padding: "3px 10px",
                  fontSize: "0.72rem",
                  color: "var(--text-3)",
                  cursor: "pointer",
                }}
              >
                ⚙️ Automated Test Fixtures ({demoAccounts.length})
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--graphite-2)",
                border: "1px solid var(--violet-line)",
                borderRadius: "var(--r-md)",
                padding: "8px 14px",
                flexWrap: "wrap",
                gap: 8,
                fontSize: "0.82rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, color: "var(--violet-700)" }}>
                  Automated Test Personas:
                </span>
                <span style={{ color: "var(--text-3)", fontSize: "0.75rem" }}>
                  1-click persona switch for end-to-end verification (PostgreSQL)
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {demoAccounts.map((acc) => {
                  const isCurrent = currentUser?.phone?.replace(/[^0-9]/g, "").slice(-7) === acc.phone.replace(/[^0-9]/g, "").slice(-7);
                  return (
                    <button
                      key={acc.phone}
                      type="button"
                      onClick={async () => {
                        await switchDemoUserAction(acc.phone);
                        window.location.reload();
                      }}
                      className={`btn btn-sm ${isCurrent ? "btn-primary" : "btn-secondary"}`}
                      style={{ padding: "4px 10px", fontSize: "0.76rem" }}
                    >
                      {acc.name} ({acc.role})
                    </button>
                  );
                })}
                {currentUser && (
                  <button
                    type="button"
                    onClick={async () => {
                      await logoutAction();
                      window.location.reload();
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: "4px 8px", fontSize: "0.76rem", color: "var(--bad)" }}
                  >
                    Log Out
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowDemoPersonas(false)}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: "4px 6px", fontSize: "0.76rem", color: "var(--text-3)" }}
                >
                  ✕ Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clean contextual view header when navigated away from the main marketplace */}
      {activeTab !== "marketplace" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            marginBottom: 20,
            borderRadius: "var(--r-md)",
            background: "var(--ink-1)",
            border: "1px solid var(--line-soft)",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={() => switchTab("marketplace")}
            className="btn btn-ghost btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <IconArrowLeft size={16} aria-hidden="true" />
            <span>Back to Marketplace</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="pill pill-violet" style={{ textTransform: "capitalize", fontWeight: 700 }}>
              {activeTab === "customer_dashboard"
                ? "Customer Dashboard"
                : activeTab === "worker_dashboard"
                ? "Technician Portal"
                : activeTab === "worker_profile"
                ? "Technician Profile"
                : activeTab === "post"
                ? "Post an Ad"
                : activeTab.replace("_", " ")}
            </span>
            {currentUser && (
              <span className="meta hide-sm" style={{ margin: 0 }}>
                {currentUser.display_name || currentUser.phone}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content by Tab */}
      <div className="tab-content">
        {/* VIEW 1: MARKETPLACE */}
        {activeTab === "marketplace" && (
          <div className="stack-md">
            {/* Live Sticky Active Request Radar for Customer */}
            {activeCustomerJob && !dismissRadarBanner && (
              <div
                className="radar-banner"
                style={{
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 6,
                  cursor: "pointer",
                }}
                onClick={() => setActiveJobModal(activeCustomerJob)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveJobModal(activeCustomerJob);
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "1 1 320px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)" }}>
                    <span className="radar-dot" />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--emerald-400)" }}>
                        {locale === "ur" ? "آپ کی لائیو درخواست" : "Your Active Request"}
                      </span>
                      <span style={{ color: "var(--text-3)", fontSize: "0.74rem" }}>•</span>
                      <span style={{ fontSize: "0.76rem", color: "var(--text-3)" }}>
                        {activeCustomerJob.area}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.96rem", fontWeight: 700, color: "#FFFFFF", marginTop: 2 }}>
                      &ldquo;{activeCustomerJob.title}&rdquo;
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-2)", marginTop: 2 }}>
                      {activeCustomerJob.bid_count > 0 ? (
                        <>
                          <strong style={{ color: "var(--emerald-300)" }}>
                            {activeCustomerJob.bid_count} {locale === "ur" ? "کاریگروں کے ریٹس موصول" : `quote${activeCustomerJob.bid_count > 1 ? "s" : ""} waiting`}
                          </strong>
                          {activeCustomerJob.min_bid && activeCustomerJob.max_bid ? (
                            <span style={{ color: "var(--text-3)", marginLeft: 6 }}>
                              ({pkr(activeCustomerJob.min_bid)} {activeCustomerJob.min_bid !== activeCustomerJob.max_bid ? `– ${pkr(activeCustomerJob.max_bid)}` : ""})
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span style={{ color: "var(--text-3)" }}>
                          {locale === "ur" ? "کاریگروں کو الرٹ بھیج دیا گیا ہے · کوٹیشنز کا انتظار..." : "Dispatched to verified ustads · Waiting for incoming quotes"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setActiveJobModal(activeCustomerJob)}
                    className="btn btn-primary btn-sm"
                    style={{ fontWeight: 700, padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <span>{activeCustomerJob.bid_count > 0 ? (locale === "ur" ? "ریٹس چیک کریں اور ہائر کریں →" : "Review Quotes & Hire →") : (locale === "ur" ? "درخواست دیکھیں →" : "View Live Request →")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDismissRadarBanner(true)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: "6px 8px", color: "var(--text-3)", fontSize: "0.85rem" }}
                    title="Dismiss for now"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <Hero
              user={currentUser}
              realOpenCount={realCount}
              sampleCount={sampleCount}
              onPost={(cat) => {
                setPreselectedCategory(cat || null);
                switchTab("post");
              }}
              onBrowseCategoryRateCards={(catSlug) => {
                setMarketplaceMode("rate_cards");
                setMarketplaceCategory(catSlug);
                setTimeout(() => {
                  const el = document.getElementById("providers-catalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
              onJoin={() => (currentUser?.is_worker ? switchTab("worker_dashboard") : switchTab("auth"))}
              compact={false}
            />

            <MarketplaceView
              jobs={initialPublicJobs}
              areas={areas}
              user={currentUser}
              ownJobIds={ownJobIds}
              initialMode={marketplaceMode}
              initialCategory={marketplaceCategory}
              onOpenJob={(job) => setActiveJobModal(job)}
              onPost={(cat) => {
                setPreselectedCategory(cat || null);
                switchTab("post");
              }}
            />
          </div>
        )}

        {/* VIEW 2: POST AN AD */}
        {activeTab === "post" && (
          <div style={{ maxWidth: 840, margin: "0 auto", width: "100%" }}>
            <PostJobView
              user={currentUser}
              categories={categories}
              areas={areas}
              initialCategory={preselectedCategory}
              onNeedAuth={() => switchTab("auth")}
              onSuccess={(jobId) => {
                showToast("Listing posted successfully to Lahore marketplace!");
                switchTab("customer_dashboard");
              }}
              onViewMarketplace={() => switchTab("marketplace")}
            />
          </div>
        )}

        {/* VIEW 3: CUSTOMER DASHBOARD */}
        {activeTab === "customer_dashboard" && (
          <CustomerDashboardView
            user={
              currentUser || {
                id: "guest",
                phone: "0300 0000000",
                display_name: "Guest",
                is_customer: true,
                is_worker: false,
                is_admin: false,
                account_status: "active",
              }
            }
            jobs={initialCustomerJobs}
            bookings={initialCustomerBookings}
            onOpenJob={(job) => setActiveJobModal(job)}
            onPostJob={() => switchTab("post")}
            onToast={(msg) => showToast(msg)}
          />
        )}

        {/* VIEW 4: WORKER DASHBOARD */}
        {activeTab === "worker_dashboard" && (
          <WorkerDashboardView
            user={
              currentUser || {
                id: "guest",
                phone: "0300 0000000",
                display_name: "Guest",
                is_customer: false,
                is_worker: true,
                is_admin: false,
                account_status: "active",
              }
            }
            bids={initialWorkerBids}
            matchingJobs={initialWorkerJobs.length > 0 ? initialWorkerJobs : initialPublicJobs}
            onOpenJob={(job) => setActiveJobModal(job)}
            onOpenProfile={() => switchTab("worker_profile")}
            onToast={(msg) => showToast(msg)}
          />
        )}

        {/* VIEW 5: WORKER PROFILE */}
        {activeTab === "worker_profile" && (
          <WorkerProfileView
            currentUser={currentUser}
            initialProfile={initialWorkerProfile}
            areas={areas}
            categories={categories}
            showToast={(msg) => showToast(msg)}
            onNavigateAuth={() => switchTab("auth")}
          />
        )}

        {/* VIEW 6: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <NotificationsView
            notifications={notifications}
            onMarkAllRead={() => {
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date() })),
              );
            }}
            showToast={(msg) => showToast(msg)}
          />
        )}

        {/* VIEW 7: MODERATION */}
        {activeTab === "moderation" && (
          <ModerationView
            currentUser={currentUser}
            reports={initialReports}
            auditLogs={initialAuditLogs}
            showToast={(msg) => showToast(msg)}
            onNavigateAuth={() => switchTab("auth")}
          />
        )}

        {/* VIEW 8: SETTINGS */}
        {activeTab === "settings" && (
          <SettingsView
            currentUser={currentUser}
            showToast={(msg) => showToast(msg)}
            onNavigateAuth={() => switchTab("auth")}
          />
        )}

        {/* VIEW 9: AUTH / SIGN UP & SIGN IN */}
        {activeTab === "auth" && (
          <AuthView
            currentUser={currentUser}
            initialMode={initialView === "signin" || initialView === "login" ? "signin" : "signup"}
            onNavigateMarketplace={() => switchTab("marketplace")}
            showToast={(msg) => showToast(msg)}
          />
        )}
      </div>

      {/* Accessible In-Page Job Details & Bidding Modal */}
      {activeJobModal && (
        <JobDialog
          job={activeJobModal}
          user={currentUser}
          isOwn={ownJobIds.has(activeJobModal.id)}
          onClose={() => setActiveJobModal(null)}
          onSignIn={() => {
            setActiveJobModal(null);
            switchTab("auth");
          }}
          onJoin={() => {
            setActiveJobModal(null);
            switchTab("worker_profile");
          }}
          onBidSent={(msg) => {
            showToast(msg);
            setActiveJobModal(null);
          }}
        />
      )}

      {/* Mobile Bottom Dock for fast thumb-friendly navigation on small screens */}
      <nav className="mobile-dock" aria-label="Mobile navigation">
        <button
          type="button"
          className={`mobile-dock-btn ${activeTab === "marketplace" ? "is-active" : ""}`}
          onClick={() => switchTab("marketplace")}
          aria-label="Marketplace"
        >
          <IconSearch size={20} aria-hidden="true" />
          <span>Market</span>
        </button>

        <button
          type="button"
          className={`mobile-dock-btn ${activeTab === "post" ? "is-active" : ""}`}
          onClick={() => switchTab("post")}
          aria-label="Post a Job"
        >
          <div className="mobile-dock-plus">
            <IconPlus size={18} aria-hidden="true" />
          </div>
          <span>Post</span>
        </button>

        {currentUser?.is_worker ? (
          <button
            type="button"
            className={`mobile-dock-btn ${activeTab === "worker_dashboard" ? "is-active" : ""}`}
            onClick={() => switchTab("worker_dashboard")}
            aria-label="Technician Portal"
          >
            <IconWrench size={20} aria-hidden="true" />
            <span>Worker</span>
          </button>
        ) : (
          <button
            type="button"
            className={`mobile-dock-btn ${activeTab === "customer_dashboard" ? "is-active" : ""}`}
            onClick={() => (currentUser ? switchTab("customer_dashboard") : switchTab("auth"))}
            aria-label="My Dashboard"
          >
            <IconBriefcase size={20} aria-hidden="true" />
            <span>My Jobs</span>
          </button>
        )}

        <button
          type="button"
          className={`mobile-dock-btn ${activeTab === "notifications" ? "is-active" : ""}`}
          onClick={() => switchTab("notifications")}
          aria-label="Notifications"
          style={{ position: "relative" }}
        >
          <IconBell size={20} aria-hidden="true" />
          {unreadCount > 0 && <span className="mobile-dock-badge" aria-label={`${unreadCount} unread`} />}
          <span>Alerts</span>
        </button>

        <button
          type="button"
          className={`mobile-dock-btn ${activeTab === "settings" || activeTab === "auth" ? "is-active" : ""}`}
          onClick={() => (currentUser ? switchTab("settings") : switchTab("auth"))}
          aria-label={currentUser ? "Account" : "Sign in"}
        >
          <IconUser size={20} aria-hidden="true" />
          <span>{currentUser ? "Account" : "Sign In"}</span>
        </button>
      </nav>
    </div>
  );
}

export default function UnifiedMaddadApp(props: UnifiedAppProps) {
  return <UnifiedAppContent {...props} />;
}
