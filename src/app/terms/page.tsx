import type { Metadata } from "next";
import { appName } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of Service · Maddadgaar Lahore" };

export default function Terms() {
  return (
    <div style={{ maxWidth: 840, margin: "32px auto", padding: "0 16px" }}>
      <article className="card" style={{ padding: "clamp(24px, 4vw, 44px)", background: "var(--graphite-1)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 2vw, 2.2rem)", fontWeight: 700, margin: "0 0 12px", fontFamily: "var(--font-serif)", color: "var(--text)" }}>
          Terms of Service
        </h1>
        <p style={{ marginBottom: 24, fontSize: "1.02rem", color: "var(--text-2)", lineHeight: 1.6 }}>
          Welcome to {appName}. By using our website to browse services, post service requests or offerings, submit bids and quotes, or communicate with counterparts across Lahore, you agree to these Terms of Service.
        </p>

        <ol style={{ color: "var(--text)", lineHeight: 1.75, paddingLeft: 22, display: "grid", gap: 16 }}>
          <li>
            <strong>Local Services Marketplace &amp; Technology Platform:</strong> {appName} operates exclusively as an online communications and listing platform connecting clients and households with independent service providers, tradespeople, and technicians in Lahore. {appName} is not an employer, contractor, or guarantor of any service performed.
          </li>
          <li>
            <strong>Service Requests &amp; Work Scope:</strong> Clients posting service requests warrant that they have lawful authority over the premises where work is to be performed. Clients and technicians are responsible for confirming the scope of work and pricing prior to commencement.
          </li>
          <li>
            <strong>Independent Service Providers:</strong> Plumbers, electricians, cleaners, tutors, and freelance contractors offering services through {appName} are independent contractors and not employees of {appName}. {appName} does not supervise, schedule, direct, or insure their work.
          </li>
          <li>
            <strong>Direct Payment &amp; Zero Escrow:</strong> All monetary payments (cash, Raast, mobile banking) are settled directly between users. {appName} holds zero user funds, operates no escrow service, charges no hidden buyer commissions, and cannot issue monetary refunds.
          </li>
          <li>
            <strong>Verification &amp; Badges:</strong> An &quot;ID Reviewed&quot; status signifies only that our moderators conducted a visual inspection of submitted documentation to deter duplicate accounts. It does NOT constitute a police character clearance, NADRA database verification, or trade certification.
          </li>
          <li>
            <strong>Prohibited Content &amp; Conduct:</strong> Listings involving fraudulent services, extortion, harassment, unlicensed hazardous electrical/gas work, or bait-and-switch pricing are strictly banned. Accounts violating community standards will be warned, suspended, or permanently terminated.
          </li>
          <li>
            <strong>Dispute Reporting:</strong> Users may file reports through the platform for no-shows, offensive conduct, or fraudulent listings. While {appName} investigates policy violations, it does not act as a court or arbitrate monetary disputes.
          </li>
          <li>
            <strong>Jurisdiction:</strong> These terms are governed by the applicable laws of the province of Punjab and the Islamic Republic of Pakistan.
          </li>
        </ol>

        <p style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--line-soft)", fontSize: "0.85rem", color: "var(--text-3)" }}>
          {appName} · Lahore, Punjab, Pakistan
        </p>
      </article>
    </div>
  );
}
