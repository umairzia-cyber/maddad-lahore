import type { Metadata } from "next";
import Link from "next/link";
import { appName, supportEmail } from "@/lib/config";
import { IconMapPin, IconShieldCheck, IconClock } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact & Support · Maddadgaar Lahore",
  description: "Get in touch with the Maddadgaar Lahore team for community support, inquiries, and feedback.",
};

export default function ContactPage() {
  const contactAddress = supportEmail || "support@maddadgaar.pk";

  return (
    <div style={{ maxWidth: 880, margin: "32px auto", padding: "0 16px" }}>
      <article className="card" style={{ padding: "clamp(24px, 4vw, 44px)", background: "#FFFFFF", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--violet-500)", fontWeight: 700 }}>
            Community Support
          </span>
          <h1 style={{ fontSize: "clamp(1.6rem, 2vw, 2.2rem)", margin: "4px 0 12px", fontFamily: "var(--font-serif)", fontWeight: 700 }}>
            Contact &amp; Assistance
          </h1>
          <p style={{ fontSize: "1.02rem", lineHeight: 1.6, color: "var(--text-2)", margin: 0 }}>
            We are dedicated to building a safe, reliable, and straightforward local marketplace for Lahore. If you need help with a listing, have a safety question, or want to report suspicious behaviour, our team is ready to help.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 36 }}>
          <div style={{ padding: 20, background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)" }}>
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 6px", fontFamily: "var(--font-serif)", color: "var(--text)" }}>Email Support</h2>
            <p style={{ margin: "0 0 10px", fontSize: "0.88rem", color: "var(--text-2)" }}>For inquiries, user assistance, and account verification.</p>
            <a href={`mailto:${contactAddress}`} style={{ fontWeight: 700, color: "var(--violet-500)", textDecoration: "underline", fontSize: "0.95rem" }}>
              {contactAddress}
            </a>
          </div>

          <div style={{ padding: 20, background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)" }}>
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 6px", fontFamily: "var(--font-serif)", color: "var(--text)" }}>Operating Region</h2>
            <p style={{ margin: "0 0 6px", fontSize: "0.88rem", color: "var(--text-2)" }}>Covering Lahore Metropolitan Area</p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--text)", fontWeight: 600 }}>
              <IconMapPin size={16} style={{ color: "var(--violet-500)" }} />
              Punjab, Pakistan
            </span>
          </div>

          <div style={{ padding: 20, background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)" }}>
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 6px", fontFamily: "var(--font-serif)", color: "var(--text)" }}>Support Hours</h2>
            <p style={{ margin: "0 0 6px", fontSize: "0.88rem", color: "var(--text-2)" }}>Monday – Saturday</p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "var(--text)", fontWeight: 600 }}>
              <IconClock size={16} style={{ color: "var(--violet-500)" }} />
              9:00 AM – 8:00 PM PKT
            </span>
          </div>
        </div>

        <div style={{ padding: 24, background: "var(--violet-soft)", borderRadius: "var(--r-sm)", border: "1px solid var(--violet-line)", marginBottom: 28 }}>
          <h2 style={{ fontSize: "1.1rem", margin: "0 0 8px", color: "var(--violet-700)", fontFamily: "var(--font-serif)", fontWeight: 700 }}>
            Urgent Dispute or Problem Report?
          </h2>
          <p style={{ margin: "0 0 16px", color: "var(--text)", fontSize: "0.92rem", lineHeight: 1.6 }}>
            If you are currently engaged in an active booking or transaction and need moderator review for a no-show, misrepresentation, or policy violation, please use the <strong>&quot;Report a Problem&quot;</strong> button directly on your booking card or listing dialog for fast, prioritized handling.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Go to My Dashboard
            </Link>
            <Link href="/safety" className="btn btn-secondary btn-sm">
              Read Safety Guide
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
