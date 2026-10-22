import type { Metadata } from "next";
import Link from "next/link";
import { appName } from "@/lib/config";
import { IconInfo, IconPlus, IconWrench, IconCheck, IconShieldCheck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Help Center & FAQ · Maddadgaar Lahore",
  description: "Answers to common questions about posting classifieds, hiring technicians, and selling goods on Maddadgaar Lahore.",
};

export default function HelpPage() {
  const faqs = [
    {
      q: "How does posting an ad work?",
      a: "Click 'Post an Ad' at the top of any page. Select whether you are selling an item, requesting a service, offering your own service, or hiring for a local job. Fill out the simple 4-step wizard with your title, category, price, and neighborhood in Lahore. Your ad goes live immediately to local viewers.",
    },
    {
      q: "How much does it cost to use Maddadgaar?",
      a: "Posting ads, browsing listings, submitting quotes, and contacting sellers/providers is completely free. We do not charge listing fees or sales commissions.",
    },
    {
      q: "Who pays for the service or item, and how?",
      a: "All financial transactions are handled directly between the buyer/poster and the seller/provider. Most users in Lahore pay via cash on delivery or instant Raast / JazzCash / EasyPaisa transfer after verifying the item or inspection of the completed job. Maddadgaar never touches or holds user funds.",
    },
    {
      q: "Why is my exact address kept private?",
      a: "To safeguard community privacy and security. Anyone on the internet can see that an ad is in 'Gulberg III' or 'DHA Phase 5', but only the person you choose to deal with receives your street details and house landmark.",
    },
    {
      q: "How do I offer my services as a plumber, electrician, tutor, or contractor?",
      a: "You can click 'Offer Services' to set up your provider profile, or post a classified ad under 'Offer a Service'. You can also browse open service requests in your Lahore neighborhood and submit clear bids with your arrival time and estimated labour cost.",
    },
    {
      q: "What should I do if a buyer or provider does not show up?",
      a: "If a party cancels or fails to arrive, you can withdraw your acceptance or close the listing and contact the next eligible person. You can also report repeated no-shows using the in-app reporting button so moderators can investigate.",
    },
    {
      q: "Is Maddadgaar available outside of Lahore?",
      a: "Maddadgaar is currently focused on the Lahore metropolitan area across 20+ key neighborhoods (Gulberg, DHA, Model Town, Johar Town, Cantt, Iqbal Town, Bahria Town, etc.). We plan to expand to Karachi, Islamabad, and Rawalpindi in future phases.",
    },
  ];

  return (
    <div style={{ maxWidth: 880, margin: "32px auto", padding: "0 16px" }}>
      <article className="card" style={{ padding: "clamp(24px, 4vw, 44px)", background: "#FFFFFF", borderRadius: "var(--r-md)", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "var(--r-sm)", background: "var(--violet-soft)", color: "var(--violet-500)", display: "grid", placeItems: "center" }}>
            <IconInfo size={26} aria-hidden="true" />
          </div>
          <div>
            <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--violet-500)", fontWeight: 700 }}>
              User Support &amp; Knowledge Base
            </span>
            <h1 style={{ fontSize: "clamp(1.6rem, 2vw, 2.2rem)", margin: 0, fontFamily: "var(--font-serif)", fontWeight: 700 }}>
              Help Center &amp; FAQ
            </h1>
          </div>
        </div>

        <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "var(--text-2)", marginBottom: 32 }}>
          Everything you need to know about using {appName} for local classifieds, home maintenance, freelance jobs, and buying or selling in Lahore.
        </p>

        <div style={{ display: "grid", gap: 20, marginBottom: 36 }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ padding: "20px 24px", background: "var(--graphite-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--line-soft)" }}>
              <h2 style={{ fontSize: "1.1rem", margin: "0 0 8px", fontFamily: "var(--font-serif)", color: "var(--text)", fontWeight: 700 }}>
                {faq.q}
              </h2>
              <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.6, fontSize: "0.93rem" }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text)" }}>Still have questions?</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>Our community moderation and support team is here to assist.</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/contact" className="btn btn-primary btn-sm">
              Contact Support
            </Link>
            <Link href="/safety" className="btn btn-secondary btn-sm">
              Safety Advice
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
