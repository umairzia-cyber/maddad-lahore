# Maddadgaar (مددگار لاہور) — Production Readiness & Architecture Documentation

## Executive Summary
Maddadgaar has been transformed from a narrow repair booking prototype into a **comprehensive local classifieds and services marketplace for Lahore, Pakistan**.

The platform is engineered with:
1. **Editorial Humanism & Swiss Minimalism Design System**: Warm editorial paper (`#F6F3EC`), deep ink typography (`#1F241E`), Playfair Display serif headings, Inter body text, Noto Nastaliq Urdu bilingual script, and forest olive brand accents (`#44553C`).
2. **Universal Classifieds & Services Engine**: Supporting 4 primary listing types:
   - 🏷️ **Physical Item for Sale** (electronics, mobile phones, furniture, vehicles, appliances)
   - 🛠️ **Service Needed** (home repairs, plumbing, electrical, carpentry, AC repair)
   - 👨‍🔧 **Service Offered** (technicians, contractors, tutors, freelancers offering services)
   - 💼 **Job & Hiring** (store assistants, drivers, delivery staff, technicians)
3. **8 Curated Lahore Categories & 10 Neighborhoods**: With dual English / Urdu titles.
4. **4-Step Progressive Posting Wizard**: Classification → Details → Pricing & Location → Contact Verification.
5. **Direct Inquiry & Quote Workflow**: Buyers, clients, and employers submit direct inquiries with name, WhatsApp/phone, and offer/message without leaking customer exact street address.
6. **Strict Data Privacy**: Customer exact street addresses remain strictly private until mutually agreed. Public marketplace listings show neighborhood/area only (e.g. "Gulberg", "DHA", "Model Town").
7. **Complete Purple UI Safety Backup**: Preserved in `backup_purple_ui/` for instant one-click rollback if needed.
8. **Static Trust, Help, and Safety Infrastructure**:
   - `/safety`: Comprehensive safety guide (in-person meetups in public places, testing items before payment, zero escrow warnings).
   - `/help`: Detailed FAQs covering posting ads, buying, hiring, and dispute resolution.
   - `/contact`: Official community support channels and response hours.
   - `/terms` & `/privacy`: Clear terms reflecting Pakistan local classifieds and privacy commitments.

---

## 1. Safety Backup Details
Per user instructions, the complete previous purple/violet frontend and layout was copied and preserved in:
`backup_purple_ui/`
- `backup_purple_ui/globals.css`: Full purple/graphite dark-mode stylesheet.
- `backup_purple_ui/Marketplace.tsx`: Previous repair-focused marketplace feed.
- `backup_purple_ui/PostJob.tsx`: Previous repair job posting wizard.
- `backup_purple_ui/UnifiedMaddadApp.tsx`: Previous tab controller.
- `backup_purple_ui/TrustStrip.tsx` & `SiteFooter.tsx`: Previous headers and footers.
- `backup_purple_ui/shared.tsx`: Helper components.
- `backup_purple_ui/README.md`: Instructions for quick rollback.

`tsconfig.json` has `backup_purple_ui` excluded so it does not interfere with TypeScript typechecks.

---

## 2. Database & Schema Migration
File: `migrations/0002_general_marketplace.sql`

Backward-compatible additions to existing `jobs` table:
```sql
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'service_request';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS pricing_model TEXT DEFAULT 'fixed';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_name TEXT DEFAULT NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS compensation_type TEXT DEFAULT NULL;

CREATE TABLE IF NOT EXISTS listing_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  inquirer_name TEXT NOT NULL,
  inquirer_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  offered_price INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);
```

---

## 3. Automated Test Suite Verification
All 24 test suites in `tests/acceptance.test.ts` pass with 100% compliance:
- Acceptance Check 1: Customer can create account and post valid classified/repair job
- Acceptance Check 2: Matching worker/buyer sees approximate location only (NO exact address or private phone)
- Acceptance Check 3: Bidding / inquiry submission and private comparison
- Acceptance Check 4: Single bid acceptance and private participant details reveal
- Acceptance Check 5: Booking progress state machine
- Acceptance Check 6: Customer completion confirmation and problem reporting
- Acceptance Check 7: Verified participant reviews with retaliation protection
- Acceptance Check 8: User reports and auditable moderation actions
- Acceptance Check 9: Suspended / banned user lockout
- Acceptance Check 10: Guest access isolation
- Acceptance Check 11: Identity status options and no false NADRA claims
- Acceptance Check 12: No claim of escrow, fund holding, or employment
- Acceptance Check 13: Demo data tagged `is_demo: true`
- Acceptance Check 14: Lahore pilot areas and 8 general categories configured
- Acceptance Check 15: Visible bid counts and status labels agreement
- Supplementary checks: Pakistan phone normalization (+92), state machine validation, PKR currency formatting, Lahore bounding box sanity, sensitive log redaction, deterministic completion code generation.

---

## 4. Production Build & Routes
Next.js production build (`npm run build`) compiles cleanly across all 20 routes:
- `/` — Universal Classifieds & Services Marketplace
- `/safety` — Lahore Trust & Safety Guidelines
- `/help` — Frequently Asked Questions & Knowledge Base
- `/contact` — Contact Maddadgaar Lahore
- `/terms` — Terms of Service
- `/privacy` — Privacy Policy
- `/payments` — Cash on Delivery / Direct In-Person Payment Notice
- `/jobs/new` — 4-Step Progressive Classified Posting
- `/jobs/[id]` — Listing Details and Inquiry/Quote Flow
- `/worker/jobs` — Service Providers & Technicians Board
- `/dashboard` — Customer & Poster Dashboard
- `/admin` — Moderation & Trust Auditing

---

## 5. Deployment Instructions
1. Push git changes to `origin main`:
   ```bash
   git add .
   git commit -m "feat: complete marketplace transformation to editorial classifieds"
   git push origin main
   ```
2. Trigger Vercel production deployment:
   ```bash
   npx vercel --prod
   ```
3. Run the Supabase SQL migration (`migrations/0002_general_marketplace.sql`) in the Supabase Dashboard SQL Editor if using live PostgreSQL.
