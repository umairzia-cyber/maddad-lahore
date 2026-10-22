import type { Metadata } from "next";
import Link from "next/link";
import { appName } from "@/lib/config";
import { IconShieldCheck, IconLock, IconMapPin, IconAlertCircle, IconCheck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Trust & Safety Guide · Maddadgaar Lahore",
  description: "Essential safety advice for buying, selling, and hiring services locally across Lahore.",
};

export default function SafetyPage() {
  return (
    <div style={{ maxWidth: 880, margin: "32px auto", padding: "0 16px" }}>
      <article className="card" style={{ padding: "clamp(24px, 4vw, 44px)", background: "var(--graphite-1)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "var(--r-sm)", background: "var(--violet-soft)", color: "var(--violet-500)", display: "grid", placeItems: "center" }}>
            <IconShieldCheck size={26} aria-hidden="true" />
          </div>
          <div>
            <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--violet-500)", fontWeight: 700 }}>
              Community Trust &amp; Verification
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 2vw, 2.2rem)", margin: 0, fontFamily: "var(--font-serif)", fontWeight: 700 }}>
              Trust &amp; Safety in Lahore
            </h1>
          </div>
        </div>

        <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "var(--text-2)", marginBottom: 28 }}>
          {appName} is built on community transparency, strict data privacy, and direct communication. Whether you are buying an electronic device in Gulberg, selling furniture in DHA, or hiring an electrician in Model Town, following these practical guidelines ensures a smooth, secure transaction.
        </p>

        <div style={{ display: "grid", gap: 24, marginBottom: 32 }}>
          {/* Rule 1 */}
          <div style={{ padding: 20, background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)" }}>
            <h2 style={{ fontSize: "1.18rem", margin: "0 0 8px", fontFamily: "var(--font-serif)", display: "flex", alignItems: "center", gap: 8 }}>
              <IconMapPin size={20} style={{ color: "var(--violet-500)" }} />
              1. Meet in Well-Lit, Busy Public Places
            </h2>
            <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.6, fontSize: "0.93rem" }}>
              For physical item exchanges (smartphones, laptops, bikes, cameras), arrange handovers in public, secure locations during daylight hours. Ideal spots in Lahore include reputable shopping malls (Packages Mall, Emporium Mall, Gulberg Main Boulevard) or designated bank branch parking areas. Never send an item via courier without guaranteed in-person verification.
            </p>
          </div>

          {/* Rule 2 */}
          <div style={{ padding: 20, background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)" }}>
            <h2 style={{ fontSize: "1.18rem", margin: "0 0 8px", fontFamily: "var(--font-serif)", display: "flex", alignItems: "center", gap: 8 }}>
              <IconCheck size={20} style={{ color: "var(--ok)" }} />
              2. Inspect &amp; Test Before Settling Payment
            </h2>
            <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.6, fontSize: "0.93rem" }}>
              Always inspect physical goods thoroughly before parting with payment. Check PTA status on mobile phones (*#06# via DIRBS), battery health, screen condition, and serial numbers. For services (repairs, painting, carpentry), test water flow, electrical breakers, or finish quality before releasing payment to the technician.
            </p>
          </div>

          {/* Rule 3 */}
          <div style={{ padding: 20, background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)" }}>
            <h2 style={{ fontSize: "1.18rem", margin: "0 0 8px", fontFamily: "var(--font-serif)", display: "flex", alignItems: "center", gap: 8 }}>
              <IconLock size={20} style={{ color: "var(--violet-500)" }} />
              3. Address &amp; House Number Privacy
            </h2>
            <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.6, fontSize: "0.93rem" }}>
              {appName} never reveals your exact street name or house number to public visitors or browsing bidders. Only your approximate neighborhood (e.g. &quot;Johar Town Phase 2&quot;) is shown publicly. Your exact location is unlocked strictly for the single confirmed counterpart once you mutually accept an offer.
            </p>
          </div>

          {/* Rule 4 */}
          <div style={{ padding: 20, background: "rgba(155, 44, 44, 0.05)", borderRadius: "var(--r-sm)", border: "1px solid rgba(155, 44, 44, 0.2)" }}>
            <h2 style={{ fontSize: "1.18rem", margin: "0 0 8px", fontFamily: "var(--font-serif)", color: "var(--bad)", display: "flex", alignItems: "center", gap: 8 }}>
              <IconAlertCircle size={20} style={{ color: "var(--bad)" }} />
              4. Beware of Advance Payment &amp; Escrow Scams
            </h2>
            <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.6, fontSize: "0.93rem" }}>
              <strong>Important:</strong> {appName} operates exclusively as a technology bulletin board and direct connection marketplace. <em>We do NOT hold escrow, hold customer money, operate bank wallets, or provide payment protection guarantees.</em> Anyone claiming that &quot;Maddadgaar holds your funds until delivery&quot; is attempting a scam. Always settle directly in cash or Raast once goods or repairs are verified in person.
            </p>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>
            Have a concern or need to report suspicious activity?
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/contact" className="btn btn-primary btn-sm">
              Contact Support
            </Link>
            <Link href="/terms" className="btn btn-secondary btn-sm">
              View Terms of Service
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
