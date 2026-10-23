/**
 * Smart Category Auto-Detection Engine for Maddadgaar Lahore.
 *
 * Analyzes job titles and descriptions in English, Urdu, and Roman Urdu to:
 * 1. Automatically detect the primary service category with high confidence.
 * 2. Suggest relevant sub-skill tags.
 * 3. Detect safety preferences such as "Female Provider Only" for salon/maid jobs.
 */

export interface DetectedCategoryResult {
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  categoryNameUr: string;
  confidence: "high" | "medium" | "low";
  matchedKeywords: string[];
  femaleProviderSuggested: boolean;
}

interface CategoryRule {
  id: number;
  slug: string;
  name: string;
  nameUr: string;
  keywords: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    id: 9,
    slug: "beauty-salon",
    name: "Home Salon & Beauty",
    nameUr: "بیوٹی پارلر و ہوم سیلون",
    keywords: [
      "mehndi", "mehendi", "mehndee", "henna", "hina",
      "makeup", "make up", "make-up", "bridal", "party makeup",
      "facial", "waxing", "wax", "manicure", "pedicure", "mani pedi",
      "nail", "nails", "nail art", "eyelash", "eyebrow", "threading",
      "hair", "haircut", "hair cut", "hair styling", "blowdry", "rebonding",
      "beautician", "parlour", "parlor", "salon",
      "مہندی", "میک اپ", "فیشل", "ویکسنگ", "سیلون", "پارلر", "میکپ", "ہئیر"
    ],
  },
  {
    id: 10,
    slug: "home-care",
    name: "Maids & Home Care",
    nameUr: "ملازمہ و گھریلو صفائی",
    keywords: [
      "maid", "house maid", "kamwali", "kaam wali", "kam wali",
      "safai", "cleaning", "deep cleaning", "deep clean", "house cleaning",
      "bartan", "dishwashing", "dhona", "laundry", "ironing", "istri",
      "cook", "cooking", "khana", "chef", "bawarchi",
      "babysitter", "baby sitter", "nanny", "aya", "ayaah", "caregiver", "elderly care",
      "sofa cleaning", "carpet cleaning", "water tank cleaning",
      "ملازمہ", "صفائی", "کام والی", "آیا", "باورچی", "کھانا", "برتن", "دھونا"
    ],
  },
  {
    id: 1,
    slug: "plumbing",
    name: "Plumbing & Sanitary",
    nameUr: "پلمبنگ و سینیٹری",
    keywords: [
      "plumber", "plumbing", "pipe", "paip", "pipeline", "leak", "leek", "leakage", "seepage",
      "tap", "nalka", "nal", "mixer", "shower", "commode", "flush", "toilet", "washroom", "basin", "sink",
      "motor", "water motor", "donkey pump", "tanki", "water tank", "drain", "drainage", "blockage",
      "geyser", "gyser", "instant geyser", "gas geyser", "electric geyser",
      "پلمبر", "پائپ", "نلکا", "موٹر", "گیزر", "ٹونکی", "فلش", "لیکج", "واش روم"
    ],
  },
  {
    id: 2,
    slug: "electrical",
    name: "Electrical & Wiring",
    nameUr: "الیکٹریکل و وائرنگ",
    keywords: [
      "electrician", "electrical", "electric", "bijli", "current", "short circuit", "sparking",
      "wiring", "wire", "cable", "breaker", "db", "distribution box", "mcb", "fuse",
      "fan", "ceiling fan", "bracket fan", "exhaust", "exhaust fan", "dimmer",
      "ups", "inverter", "battery", "ups wiring", "solar",
      "switch", "socket", "switchboard", "board", "plug", "light", "lights", "led", "chandelier", "jhoomar",
      "الیکٹریکل", "بجلی", "وائرنگ", "پنکھا", "بریکر", "یو پی ایس", "شارٹ سرکٹ", "سوئچ"
    ],
  },
  {
    id: 4,
    slug: "appliances",
    name: "AC & Appliance Repair",
    nameUr: "اے سی اور گھریلو اپلائنسز مرمت",
    keywords: [
      "ac", "air conditioner", "split ac", "inverter ac", "ac service", "ac gas", "ac repair", "cooling",
      "fridge", "refrigerator", "freezer", "deep freezer",
      "washing machine", "dryer", "spinner", "automatic washing machine",
      "microwave", "oven", "baking oven", "stove", "chulha", "hood", "kitchen hood",
      "water dispenser", "iron", "vacuum cleaner",
      "اے سی", "فریج", "کولنگ", "واشنگ مشین", "مائیکرو ویو", "اوون", "چولہا"
    ],
  },
  {
    id: 5,
    slug: "carpentry",
    name: "Carpentry & Woodwork",
    nameUr: "کارپینٹری اور لکڑی کا کام",
    keywords: [
      "carpenter", "carpentry", "wood", "woodwork", "lakri", "door", "darwaza", "handle",
      "lock", "taala", "lock change", "cylinder", "hinge", "kabza",
      "wardrobe", "almari", "cupboard", "cabinet", "kitchen cabinet", "drawer",
      "bed", "table", "chair", "sofa frame", "furniture", "furniture repair",
      "کارپینٹر", "لکڑی", "دروازہ", "تالا", "الماری", "فرنیچر", "بیڈ"
    ],
  },
  {
    id: 6,
    slug: "painting",
    name: "Painting & Renovation",
    nameUr: "پینٹنگ اور تزئین و آرائش",
    keywords: [
      "painter", "painting", "paint", "rang", "rung", "wall paint", "distemper", "plastic emulsion",
      "weather sheet", "primer", "putty", "potti", "polish", "furniture polish", "wood polish",
      "wallpaper", "wall paper", "false ceiling", "gypsum",
      "پینٹر", "پینٹ", "رنگ", "پالش", "وال پیپر", "سیلنگ"
    ],
  },
];

const FEMALE_KEYWORDS = [
  "female", "woman", "women", "girl", "girls", "larki", "larkiyan",
  "khatoon", "khawateen", "baji", "ladies", "only female", "female only",
  "خاتون", "خواتین", "لیڈیز", "لڑکی", "باجی"
];

export function detectSmartCategory(text: string): DetectedCategoryResult | null {
  if (!text || text.trim().length < 3) return null;

  const normalized = text.toLowerCase();

  // Check female provider preference
  const femaleProviderSuggested = FEMALE_KEYWORDS.some((kw) =>
    normalized.includes(kw.toLowerCase())
  );

  let bestRule: CategoryRule | null = null;
  let maxMatches = 0;
  let matchedList: string[] = [];

  for (const rule of CATEGORY_RULES) {
    const hits: string[] = [];
    for (const kw of rule.keywords) {
      // Word boundary match or inclusion
      if (normalized.includes(kw.toLowerCase())) {
        hits.push(kw);
      }
    }
    if (hits.length > maxMatches) {
      maxMatches = hits.length;
      bestRule = rule;
      matchedList = hits;
    }
  }

  if (!bestRule || maxMatches === 0) {
    return null;
  }

  const confidence: "high" | "medium" | "low" =
    maxMatches >= 3 ? "high" : maxMatches >= 1 ? "medium" : "low";

  return {
    categoryId: bestRule.id,
    categorySlug: bestRule.slug,
    categoryName: bestRule.name,
    categoryNameUr: bestRule.nameUr,
    confidence,
    matchedKeywords: matchedList,
    femaleProviderSuggested:
      femaleProviderSuggested || bestRule.slug === "beauty-salon",
  };
}
