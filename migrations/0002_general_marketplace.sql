-- 0002_general_marketplace.sql
-- Evolution of Maddadgaar from single-purpose plumbing/electrical repair
-- into a generalized local classifieds and services marketplace for Pakistan.
-- Completely preserves existing rows, foreign keys, and tests.

DO $$
BEGIN
  -- 1. Create listing_type enum if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_type') THEN
    CREATE TYPE listing_type AS ENUM ('item_sale', 'service_request', 'service_offer', 'job_opportunity');
  END IF;

  -- 2. Create pricing_model enum if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricing_model') THEN
    CREATE TYPE pricing_model AS ENUM ('fixed', 'negotiable', 'budget_range', 'quote_requested', 'contact_for_price');
  END IF;

  -- 3. Create inquiry_type enum if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_type') THEN
    CREATE TYPE inquiry_type AS ENUM ('question', 'offer', 'quote');
  END IF;
END $$;

-- 4. Extend jobs table with generalized marketplace attributes
ALTER TABLE jobs 
  ADD COLUMN IF NOT EXISTS listing_type listing_type NOT NULL DEFAULT 'service_request',
  ADD COLUMN IF NOT EXISTS pricing_model pricing_model NOT NULL DEFAULT 'budget_range',
  ADD COLUMN IF NOT EXISTS price integer CHECK (price IS NULL OR price >= 0),
  ADD COLUMN IF NOT EXISTS item_condition text CHECK (item_condition IS NULL OR item_condition IN ('new', 'like_new', 'good', 'fair'));

-- Drop strict asap/preferred constraint if present to allow classified ads with immediate availability
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_check1;
ALTER TABLE jobs ALTER COLUMN asap SET DEFAULT true;

-- 5. Expand categories to support general classifieds taxonomy
INSERT INTO service_categories (id, slug, name, name_ur, sort_order, active)
VALUES 
  (1, 'plumbing', 'Plumbing', 'پلمبنگ', 1, true),
  (2, 'electrical', 'Electrical', 'الیکٹریکل', 2, true),
  (3, 'home-repairs', 'Home Repairs & Maintenance', 'گھریلو مرمت و سروسز', 3, true),
  (4, 'electronics', 'Electronics & Appliances', 'الیکٹرانکس اور ہوم اپلائنسز', 4, true),
  (5, 'furniture', 'Furniture & Household', 'فرنیچر اور گھریلو سامان', 5, true),
  (6, 'vehicles', 'Vehicles & Transport', 'گاڑیاں اور ٹرانسپورٹ', 6, true),
  (7, 'education', 'Tutoring & Education', 'ٹیوشن اور تعلیم', 7, true),
  (8, 'jobs-work', 'Jobs & Skilled Work', 'مقامی ملازمتیں اور ہنر مند کام', 8, true)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, name_ur = EXCLUDED.name_ur, sort_order = EXCLUDED.sort_order, active = true;

-- 6. Add universal inquiries / buyer offers table for general marketplace listings
CREATE TABLE IF NOT EXISTS listing_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  inquiry_type inquiry_type NOT NULL DEFAULT 'question',
  offer_amount INTEGER CHECK (offer_amount IS NULL OR offer_amount > 0),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 2 AND 1500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listing_inquiries_listing ON listing_inquiries (listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_inquiries_sender ON listing_inquiries (sender_id, created_at DESC);

-- Enable RLS on listing_inquiries
ALTER TABLE listing_inquiries ENABLE ROW LEVEL SECURITY;
