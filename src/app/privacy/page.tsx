import type { Metadata } from "next";
import { appName, supportEmail, storage } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Notice · Maddadgaar Lahore" };

export default function Privacy() {
  return (
    <div style={{ maxWidth: 840, margin: "32px auto", padding: "0 16px" }}>
      <article className="card" style={{ padding: "clamp(24px, 4vw, 44px)", background: "var(--graphite-1)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 2vw, 2.2rem)", fontWeight: 700, margin: "0 0 12px", fontFamily: "var(--font-serif)", color: "var(--text)" }}>
          Privacy Notice
        </h1>
        <p style={{ marginBottom: 24, fontSize: "1.02rem", color: "var(--text-2)", lineHeight: 1.6 }}>
          This privacy notice outlines how {appName} protects and processes user information. We operate under strict data minimization, zero monetary fund holding, and rigorous location privacy.
        </p>

        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "24px 0 12px", fontFamily: "var(--font-serif)", color: "var(--text)" }}>
          What we collect, and why
        </h2>

        <div style={{ overflowX: "auto", marginBottom: 28 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem", lineHeight: 1.5 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--line)", textAlign: "left" }}>
                <th style={{ padding: "10px 12px", color: "var(--text)" }}>Data Category</th>
                <th style={{ padding: "10px 12px", color: "var(--text)" }}>Purpose</th>
                <th style={{ padding: "10px 12px", color: "var(--text)" }}>Visibility</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--line-soft)" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>Mobile Number</td>
                <td style={{ padding: "12px", color: "var(--text-2)" }}>Sign-in authentication via 6-digit OTP; direct contact with confirmed counterpart</td>
                <td style={{ padding: "12px", color: "var(--text-2)" }}>Strictly private; shared only with the specific counterpart you accept or contact</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--line-soft)" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>Neighborhood &amp; Approximate Area</td>
                <td style={{ padding: "12px", color: "var(--text-2)" }}>Helps nearby buyers and service providers discover relevant Lahore listings</td>
                <td style={{ padding: "12px", color: "var(--text-2)" }}>Publicly visible (e.g. &quot;Gulberg III&quot;, &quot;DHA Phase 5&quot;)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--line-soft)" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>Exact Street Address &amp; House Details</td>
                <td style={{ padding: "12px", color: "var(--text-2)" }}>Enables the chosen service technician or buyer to reach the premises</td>
                <td style={{ padding: "12px", color: "var(--text-2)" }}><strong>Strictly Isolated:</strong> Never exposed publicly or to quoting bidders. Unlocked only upon mutual agreement</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--line-soft)" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>Listing Photos &amp; Descriptions</td>
                <td style={{ padding: "12px", color: "var(--text-2)" }}>Provides clear condition of items or visual details of repairs needed</td>
                <td style={{ padding: "12px", color: "var(--text-2)" }}>Public on the marketplace listing</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--line-soft)" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>Identity Documents (Optional)</td>
                <td style={{ padding: "12px", color: "var(--text-2)" }}>Optional manual inspection by moderators to deter spam</td>
                <td style={{ padding: "12px", color: "var(--text-2)" }}>Internal human moderators only. Automatically deleted after {storage.identityRetentionDays} days</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "24px 0 12px", fontFamily: "var(--font-serif)", color: "var(--text)" }}>
          Location Privacy Guarantee
        </h2>
        <p style={{ color: "var(--text-2)", lineHeight: 1.65, fontSize: "0.95rem" }}>
          We never track your live or ongoing GPS coordinates in the background. If you tap the location helper button, browser location is queried a single time solely to pre-select your closest Lahore neighborhood. You are always free to pick your neighborhood manually from our list.
        </p>

        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "24px 0 12px", fontFamily: "var(--font-serif)", color: "var(--text)" }}>
          Your Rights &amp; Account Deletion
        </h2>
        <p style={{ color: "var(--text-2)", lineHeight: 1.65, fontSize: "0.95rem" }}>
          You can delete your account at any time from your Account dashboard. Deletion immediately scrambles your phone number, anonymizes completed booking records, and deletes uploaded documents and draft listings.
        </p>

        <p style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--line-soft)", fontSize: "0.85rem", color: "var(--text-3)" }}>
          Questions about our privacy practices? Contact: {supportEmail ? <a href={`mailto:${supportEmail}`} style={{ color: "var(--violet-500)", fontWeight: 600 }}>{supportEmail}</a> : "support@maddadgaar.pk"}
        </p>
      </article>
    </div>
  );
}
