import { Pool, PoolClient, QueryResultRow } from "pg";

const g = globalThis as unknown as { __kaamPool?: Pool; __pgChecked?: boolean; __pgAvailable?: boolean };

function createPool(): Pool {
  const url = process.env.DATABASE_URL || "postgres://kaam:kaam_local_dev_only@127.0.0.1:5432/kaam";
  const isSupabase =
    url.includes("supabase.co") ||
    url.includes("supabase.com") ||
    process.env.DATABASE_SSL === "true";

  return new Pool({
    connectionString: url,
    max: 10,
    connectionTimeoutMillis: 5000,
    ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
  });
}

export function pool(): Pool {
  return (g.__kaamPool ??= createPool());
}

export type Db = Pool | PoolClient;

let availabilityPromise: Promise<boolean> | null = null;

/**
 * Checks whether PostgreSQL is reachable with quick timeout.
 * Caches result so subsequent calls are instantaneous.
 */
export async function isPostgresAvailable(): Promise<boolean> {
  if (g.__pgChecked) return g.__pgAvailable ?? false;
  if (availabilityPromise) return availabilityPromise;

  availabilityPromise = (async () => {
    try {
      const client = await pool().connect();
      await client.query("SELECT 1");
      client.release();
      g.__pgAvailable = true;
      g.__pgChecked = true;
      await ensureReferenceData();
      return true;
    } catch {
      g.__pgAvailable = false;
      g.__pgChecked = true;
      return false;
    } finally {
      availabilityPromise = null;
    }
  })();

  return availabilityPromise;
}

const LAHORE_AREAS: [string, string, number, number][] = [
  ["Gulberg", "گلبرگ", 31.512, 74.344], ["DHA Phase 5", "ڈی ایچ اے فیز 5", 31.477, 74.4],
  ["DHA Phase 6", "ڈی ایچ اے فیز 6", 31.465, 74.43], ["Johar Town", "جوہر ٹاؤن", 31.4697, 74.2728],
  ["Model Town", "ماڈل ٹاؤن", 31.4826, 74.3239], ["Bahria Town", "بحریہ ٹاؤن", 31.3653, 74.186],
  ["Wapda Town", "واپڈا ٹاؤن", 31.4417, 74.2658], ["Faisal Town", "فیصل ٹاؤن", 31.485, 74.3],
  ["Garden Town", "گارڈن ٹاؤن", 31.498, 74.33], ["Lahore Cantt", "لاہور کینٹ", 31.529, 74.39],
  ["Allama Iqbal Town", "علامہ اقبال ٹاؤن", 31.505, 74.29], ["Samanabad", "سمن آباد", 31.54, 74.3],
  ["Shadman", "شادمان", 31.538, 74.332], ["Township", "ٹاؤن شپ", 31.435, 74.3],
  ["Valencia Town", "ویلنشیا ٹاؤن", 31.432, 74.256], ["Askari 10", "عسکری 10", 31.493, 74.402],
  ["Muslim Town", "مسلم ٹاؤن", 31.524, 74.328], ["Sabzazar", "سبزہ زار", 31.5, 74.268],
  ["Walled City", "اندرون شہر", 31.5826, 74.3294], ["Cavalry Ground", "کیولری گراؤنڈ", 31.51, 74.38],
];

export async function ensureReferenceData(): Promise<void> {
  try {
    const cityRow = await one<{ id: number }>(
      `INSERT INTO cities (slug, name, active) VALUES ('lahore','Lahore',true)
       ON CONFLICT (slug) DO UPDATE SET active=true RETURNING id`
    );
    if (!cityRow) return;

    await q(`INSERT INTO service_categories (id, slug, name, name_ur, sort_order) VALUES 
      (1, 'plumbing','Plumbing','پلمبنگ',1),
      (2, 'electrical','Electrical','الیکٹریکل',2),
      (3, 'home-repairs','Home Repairs & Maintenance','گھریلو مرمت و سروسز',3),
      (4, 'electronics','Electronics & Appliances','الیکٹرانکس اور ہوم اپلائنسز',4),
      (5, 'furniture','Furniture & Household','فرنیچر اور گھریلو سامان',5),
      (6, 'vehicles','Vehicles & Transport','گاڑیاں اور ٹرانسپورٹ',6),
      (7, 'education','Tutoring & Education','ٹیوشن اور تعلیم',7),
      (8, 'jobs-work','Jobs & Skilled Work','مقامی ملازمتیں اور ہنر مند کام',8),
      (9, 'beauty-salon','Home Salon & Beauty','بیوٹی پارلر و ہوم سیلون',9),
      (10, 'home-care','Maids & Home Care','ملازمہ و گھریلو صفائی',10)
      ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, name_ur=EXCLUDED.name_ur, sort_order=EXCLUDED.sort_order, active=true`);

    let areaId = 1;
    for (const [name, ur, lat, lng] of LAHORE_AREAS) {
      await q(
        `INSERT INTO service_areas (id, city_id, name, name_ur, centroid) VALUES ($1,$2,$3,$4, ST_SetSRID(ST_MakePoint($6,$5),4326)::geography)
         ON CONFLICT (city_id, name) DO NOTHING`,
        [areaId++, cityRow.id, name, ur, lat, lng]
      );
    }

    // Ensure generalized marketplace columns & inquiries table exist
    await q(`DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_type') THEN
        CREATE TYPE listing_type AS ENUM ('item_sale', 'service_request', 'service_offer', 'job_opportunity');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricing_model') THEN
        CREATE TYPE pricing_model AS ENUM ('fixed', 'negotiable', 'budget_range', 'quote_requested', 'contact_for_price');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_type') THEN
        CREATE TYPE inquiry_type AS ENUM ('question', 'offer', 'quote');
      END IF;
    END $$;`);

    await q(`ALTER TABLE jobs 
      ADD COLUMN IF NOT EXISTS listing_type listing_type NOT NULL DEFAULT 'service_request',
      ADD COLUMN IF NOT EXISTS pricing_model pricing_model NOT NULL DEFAULT 'budget_range',
      ADD COLUMN IF NOT EXISTS price integer,
      ADD COLUMN IF NOT EXISTS item_condition text`);

    await q(`CREATE TABLE IF NOT EXISTS listing_inquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      listing_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      sender_id UUID NOT NULL REFERENCES users(id),
      inquiry_type inquiry_type NOT NULL DEFAULT 'question',
      offer_amount INTEGER,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
  } catch (err) {
    console.error("ensureReferenceData notice:", err);
  }
}

/** Parameterised queries only. Never interpolate user input into SQL text. */
export async function q<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
  db: Db = pool(),
): Promise<T[]> {
  const r = await db.query<T>(text, params);
  return r.rows;
}

export async function one<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
  db: Db = pool(),
): Promise<T | null> {
  return (await q<T>(text, params, db))[0] ?? null;
}

export async function tx<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const c = await pool().connect();
  try {
    await c.query("BEGIN");
    const out = await fn(c);
    await c.query("COMMIT");
    return out;
  } catch (e) {
    await c.query("ROLLBACK").catch(() => undefined);
    throw e;
  } finally {
    c.release();
  }
}
