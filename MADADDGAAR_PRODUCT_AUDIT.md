# MADDADGAAR — COMPLETE PRODUCT & REPOSITORY AUDIT

**Target Application:** Maddadgaar ([https://maddadgaar.vercel.app](https://maddadgaar.vercel.app/))  
**Auditor:** Senior Product Architect, Security Engineer & QA Lead  
**Audit Date:** October 2026  
**Repository Branch:** `main`  
**Execution Context:** Production & Local Workspace Analysis  

---

## 1. Executive Summary

Maddadgaar was originally built as a localized household service marketplace for Lahore focusing on plumbing and electrical repairs. It possesses a **well-architected PostgreSQL database core**, solid server-side transactional safety, strict address isolation, Pakistani phone number normalization, and a functional bilingual (English/Urdu) framework.

To transition from a narrow trades-booking demo into a **professional, general-purpose local classifieds and services marketplace for Pakistan**, the product must evolve from a plumbing/electrical job-bidding engine into an extensible platform that supports:
1. **General classified advertisements** (goods for sale, furniture, electronics, vehicles).
2. **Service requests** (plumbing, electrical, cleaning, tutoring, transport).
3. **Service provider offers** (freelancers, local technicians, tutoring services).
4. **Buyer inquiries and item offers** alongside service quotes.
5. **A clean, editorial visual system** (warm paper `#F6F3EC`, ink `#1F241E`, olive `#44553C`) replacing temporary dark/crypto or unstyled aesthetics.
6. **Removal of public test persona switchers** from the production user experience.

---

## 2. Technical Inventory & Component Mapping

### 2.1 Framework & Core Stack
- **Framework:** Next.js 14.2.15 (App Router with React Server Components + Client interactivity).
- **Language:** TypeScript 5 (Strict Mode).
- **Styling:** Vanilla CSS design tokens with scoped utility components in `src/app/globals.css`.
- **Database Engine:** PostgreSQL (Supabase Managed Postgres pooler via `pg` Pool in `src/lib/db.ts`).
- **In-Process Fallback Engine:** `src/lib/store.ts` provides complete in-memory persistence when running without a reachable database.
- **Testing:** Node.js native test runner (`node --import tsx --test tests/*.test.ts`) with 24 passing automated acceptance tests.

### 2.2 Database Schema (`migrations/0001_init.sql`)
The PostgreSQL database schema consists of 22 normalized tables:
- **Reference Data:** `cities`, `service_categories`, `service_areas` (20 seeded Lahore neighborhoods with PostGIS centroid points).
- **Identity & Auth:** `users`, `sessions`, `otp_codes`, `rate_limits`.
- **Service Providers:** `worker_profiles`, `worker_categories`, `worker_areas`, `identity_documents`.
- **Listings & Privacy:** `jobs`, `job_private` (address stored exclusively here, isolated from public queries), `job_photos`, `worker_photos`.
- **Transactions & Quotes:** `bids`, `bookings`, `job_status_log`.
- **Reputation & Moderation:** `reviews`, `reports`, `moderation_actions`, `appeals`, `audit_logs`, `app_settings`, `deletion_requests`.

### 2.3 Supabase Integration (`migrations/supabase_setup.sql`)
- Storage buckets: `job-photos`, `worker-photos`, `identity`.
- Analytics & Lead collection tables: `public.signups`, `public.job_leads`, `public.bids_activity`.
- **Current Production Status:** Production connects directly to PostgreSQL via `DATABASE_URL` (`postgresAvailable: true` verified at `/api/db/status`). Supabase client keys (`NEXT_PUBLIC_SUPABASE_URL`) are optional and fallback gracefully to direct PostgreSQL.

### 2.4 Authentication & Security Architecture
- **Phone OTP:** Pakistani mobile numbers normalized via E.164 (`+92300...`).
- **Session Tokens:** Cryptographic random cookies hashed via SHA-256 and matched in `sessions` table.
- **Address Protection:** Exact street addresses and customer phone numbers are stored in `job_private` and unlocked strictly upon booking acceptance (`src/lib/jobs.ts` line 180). Unrelated users and visitors receive coarse area names only.
- **Race Condition Prevention:** Booking acceptance executes inside `tx(...)` with `SELECT status FROM jobs WHERE id=$1 FOR UPDATE` and unique database indexes (`bids_one_accepted_per_job`).

---

## 3. Gap Analysis: Trades App vs. General Classifieds

| Dimension | Existing Trades Model | Target General Classifieds Model | Action Required |
| :--- | :--- | :--- | :--- |
| **Categories** | Hardcoded 2 categories (Plumbing & Electrical) | Multi-category taxonomy (Goods, Services, Vehicles, Property, Jobs) | Generalize schema and category directory |
| **Listing Types** | Single type: Customer Repair Job | 4 Types: Item for Sale, Service Request, Service Offer, Job Opportunity | Add `listing_type` enum to schema and UI |
| **Pricing Model** | Budget Range only (`budget_min`, `budget_max`) | Fixed, Negotiable, Budget Range, Quote Request, Contact for Price | Add `pricing_model` & `price` fields |
| **Interaction Flow** | Mandatory Technician Bid (Amount + Arrival Timing + Exclusions) | Inquiries / Questions, Item Offers, and Service Quotes | Universal response system |
| **Visual Design** | Dark metallic `#0a0b10` or unstyled raw HTML | Editorial Humanism: Paper `#F6F3EC`, Ink `#1F241E`, Olive `#44553C` | Redesign CSS tokens and layout shell |
| **Public Test Personas** | Tariq, Rashid, Akram, Fatima visible in top banner | Isolated to dev/test environments; clean public UI | Remove demo banner from public production |
| **Legal & Safety Pages** | Basic stubs or missing dedicated routes | Terms, Privacy, Safety Guidelines, Help/FAQ, Contact | Implement full dedicated pages |

---

## 4. Security & Privacy Audit

1. **Service-Role Key Isolation:**
   - **Finding:** Verified clean. The Supabase service-role key is never exposed in browser bundles or client-side components.
2. **Address & Contact Data Leakage:**
   - **Finding:** Verified secure. Public listing queries select only from `jobs`, joined with `service_areas` for public neighborhood names (e.g., *Gulberg*, *Johar Town*). The `job_private` table is accessed only by authorized participants.
3. **CNIC & Identity Documents:**
   - **Finding:** Document files are stored with private keys. Storage bucket `identity` is non-public. Admin-only moderation guards access.
4. **Public Persona Switcher Exposure:**
   - **Finding:** The pilot banner allows 1-click login into test accounts. In production, this must be disabled for general visitors.

---

## 5. Summary Inventory of Changes Needed

1. **Database & Data Layer:** Safe backward-compatible migration adding `listing_type`, `pricing_model`, `price` to listings, and expanding category tables.
2. **Universal "Post an Ad" Workflow:** Progressive multi-step wizard supporting both physical goods and service listings.
3. **Universal Listing Detail & Inquiry Flow:** Listing page displaying photos, price, location, seller info, with messaging/offer support.
4. **Restrained Editorial Aesthetic:** Warm paper (`#F6F3EC`) palette, serif headlines, clear text-first hierarchy, responsive on 390px, 768px, and 1440px.
5. **Static & Policy Routes:** Dedicated pages for Terms, Privacy, Safety Guidelines, Help/FAQ, and Contact.
6. **Production Polish:** Disable public demo personas in production, verify all 24 acceptance tests, and maintain 100% build health.
