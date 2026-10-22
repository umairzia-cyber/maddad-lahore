/**
 * Maddad Lahore — Bilingual Internationalization Engine
 * Full natural Urdu (اردو) and English support with RTL layout logic.
 */

export type Locale = "en" | "ur";
export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = { en: "ltr", ur: "rtl" };

export const en = {
  // Brand & Header
  "brand.name": "Maddadgaar",
  "brand.urdu": "مددگار",
  "brand.tagline": "Lahore · Local help, made simple",
  "nav.marketplace": "Find help",
  "nav.post": "Post a repair request",
  "nav.find_work": "Find work",
  "nav.technician_portal": "Technician portal",
  "nav.dashboard": "My repairs",
  "nav.notifications": "Notifications",
  "nav.signin": "Sign in",
  "nav.signout": "Sign out",
  "nav.account": "Account",
  "nav.admin": "Moderation",
  "nav.language": "Language",

  // Hero
  "hero.eyebrow": "NEED A REPAIR IN LAHORE?",
  "hero.title": "Ghar ka kaam? Sahi banda dhoondein.",
  "hero.subtitle": "Tell us what needs fixing. Compare prices from local plumbers and electricians, then choose who you trust.",
  "hero.cta_post": "Post a repair request →",
  "hero.cta_worker": "Join as a technician",
  "hero.perks": "Free to post · Compare quotes · Choose your technician",
  "hero.privacy_badge": "Your address stays private until you choose a technician.",
  "hero.privacy_sub": "Only your general Lahore neighborhood is shown to bidders. Exact address is disclosed only to the technician you hire.",

  // Category choices
  "cat.choose_title": "What do you need help with?",
  "cat.plumbing_title": "Plumbing",
  "cat.plumbing_urdu": "پلمبنگ سروس",
  "cat.plumbing_desc": "Leak, tap, pipe, motor, geyser",
  "cat.electrical_title": "Electrical",
  "cat.electrical_urdu": "الیکٹریکل سروس",
  "cat.electrical_desc": "Wiring, switch, fan, breaker, light",

  // How it works
  "hiw.title": "How Maddadgaar works in Lahore",
  "hiw.step1_title": "1. Describe the problem",
  "hiw.step1_desc": "Select what needs fixing and choose your Lahore area (e.g. Johar Town, Gulberg). No technical jargon needed.",
  "hiw.step2_title": "2. Compare local quotes",
  "hiw.step2_desc": "Verified plumbers or electricians send clear quotes with labour prices and arrival windows. No hidden platform markup.",
  "hiw.step3_title": "3. Hire with confidence",
  "hiw.step3_desc": "Choose who you trust. Your exact address is unlocked only for your hired technician. Pay them directly upon completion.",

  // Empty state & activity
  "empty.no_jobs_title": "Be the first to post a repair in your area",
  "empty.no_jobs_desc": "Local plumbers and electricians across Lahore are ready to respond. Describe your job to receive genuine quotes within 15–45 minutes.",
  "empty.post_button": "Post a repair request now",
  "empty.examples_title": "Typical repairs and estimated labour rates in Lahore:",
  "empty.ex_motor": "Water motor capacitor or joint replacement: Rs 1,500 – 2,500",
  "empty.ex_tap": "Bathroom/kitchen tap & mixer replacement: Rs 800 – 1,500",
  "empty.ex_fan": "Ceiling fan installation or rewiring: Rs 1,000 – 1,800",
  "empty.ex_geyser": "Instant or storage geyser servicing: Rs 1,800 – 3,000",

  // Trust & Safety
  "trust.title": "Real safeguards for your home and peace of mind",
  "trust.subtitle": "We don't rely on vague 'verified' stamps. Here is exactly what we check and how your safety is protected:",
  "trust.phone_title": "Phone Verified",
  "trust.phone_desc": "Every technician confirms an active Pakistani mobile number with OTP verification.",
  "trust.id_title": "Identity Checked",
  "trust.id_desc": "CNIC documents are reviewed by our Lahore moderation team before granting badge approval.",
  "trust.skills_title": "Trade Skills Logged",
  "trust.skills_desc": "Practical experience and specific Lahore trade categories are documented and visible on profiles.",
  "trust.reviews_title": "Real Job Reviews",
  "trust.reviews_desc": "Ratings and reviews can only be submitted after a real, confirmed booking is completed.",
  "trust.privacy_guarantee_title": "Strict Server-Enforced Address Isolation",
  "trust.privacy_guarantee_desc": "Hiding your address is not just a visual trick. Our backend rejects any request for your house number unless you have personally accepted that technician's quote.",
  "trust.report_button": "Report a problem or suspicious activity",

  // Technician recruitment
  "recruitment.title": "Are you a skilled plumber or electrician in Lahore?",
  "recruitment.desc": "Connect with genuine homeowners in your neighborhood. Keep 100% of your earnings with zero platform cut or hidden fees.",
  "recruitment.btn": "Register as a Technician →",

  // Customer Job Posting Flow
  "post.step1_title": "What needs fixing?",
  "post.step1_sub": "Choose the closest option. You can explain details in the next step.",
  "post.choose_trade": "Type of work",
  "post.problem_label": "What is the problem?",
  "post.area_label": "Which area of Lahore?",
  "post.urgency_label": "When do you need help?",
  "post.urgency_asap": "Urgent — as soon as possible",
  "post.urgency_today": "Today",
  "post.urgency_tomorrow": "Tomorrow",
  "post.urgency_anytime": "Any time that suits",
  "post.next_btn": "Continue to details →",
  "post.back_btn": "← Back",
  "post.details_label": "Short description of the problem",
  "post.details_placeholder": "Describe what is happening in simple words (e.g. kitchen pipe is leaking water under the sink)...",
  "post.landmark_label": "Approximate landmark / sector",
  "post.landmark_placeholder": "e.g. Near Liberty Roundabout, Block C (Do not enter house number yet)",
  "post.landmark_hint": "Exact house & street address is collected ONLY when you hire a technician.",
  "post.phone_label": "Your mobile number (for quote alerts)",
  "post.budget_label": "Expected budget (Rs, optional)",
  "post.electrical_safety_title": "⚠️ Safety notice for electrical repairs",
  "post.electrical_safety_body": "If you smell burning, see sparking from wires, or hear circuit breaker buzzing, immediately turn off the main switchboard breaker. Do not touch exposed live wires.",
  "post.submit_btn": "Post repair request (Free)",
  "post.summary_title": "Review your request",
  "post.free_notice": "It is completely free to post. You are under no obligation to accept any quote.",

  // Quote comparison
  "quote.title": "Compare technician quotes",
  "quote.empty": "No quotes received yet. Local technicians in your area have been alerted.",
  "quote.labour_only": "Labour only (parts extra)",
  "quote.parts_included": "Labour & parts estimate included",
  "quote.inspection_fee": "Inspection visit fee",
  "quote.accept_btn": "Accept quote & hire technician",
  "quote.accept_modal_title": "Confirm hire & share address",
  "quote.accept_modal_body": "Enter your exact street and house address. It will be unlocked exclusively for this technician.",
  "quote.exact_address_label": "House number & street address:",
  "quote.exact_address_placeholder": "e.g. House 24-B, Street 3, Sector G, Johar Town",

  // Report Modal
  "report.modal_title": "Report an issue / مسئلہ رپورٹ کریں",
  "report.type_noshow": "Technician did not show up (کاریگر نہیں آیا)",
  "report.type_overcharge": "Misleading quote or unauthorised extra charges (اضافی یا غلط چارجز)",
  "report.type_harassment": "Harassment or suspicious behaviour (نامناسب رویہ یا دھمکی)",
  "report.type_fake": "Fake profile or fraudulent listing (جعلی اکاؤنٹ)",
  "report.type_safety": "Safety hazard / emergency concern (حفاظتی خطرہ)",
  "report.type_other": "Other issue (کوئی اور مسئلہ)",
  "report.details_label": "Describe what happened:",
  "report.submit_btn": "Submit report to moderators",
  "report.success": "Your report has been submitted to Lahore moderation. Reference logged.",

  // Footer
  "footer.rights": "© Maddadgaar Lahore · Independent repair marketplace for Lahore.",
  "footer.direct_pay": "Direct settlement: customers pay technicians directly upon satisfactory job completion.",
  "footer.safety": "Safety guidelines",
  "footer.terms": "Terms of service",
  "footer.privacy": "Privacy policy",
  "footer.help": "Help & support",
} as const;

export const ur: Record<keyof typeof en, string> = {
  // Brand & Header
  "brand.name": "مددگار",
  "brand.urdu": "مددگار لاہور",
  "brand.tagline": "لاہور · گھریلو مرمت کا بااعتماد نیٹ ورک",
  "nav.marketplace": "کام تلاش کریں",
  "nav.post": "مرمت کی درخواست دیں",
  "nav.find_work": "کاریگر لاگ ان",
  "nav.technician_portal": "کاریگر پورٹل",
  "nav.dashboard": "میرے کام",
  "nav.notifications": "اطلاعات",
  "nav.signin": "لاگ ان",
  "nav.signout": "لاگ آؤٹ",
  "nav.account": "اکاؤنٹ",
  "nav.admin": "انتظامیہ",
  "nav.language": "زبان",

  // Hero
  "hero.eyebrow": "لاہور میں پلمبر یا الیکٹریشن کی ضرورت ہے؟",
  "hero.title": "گھر کا کام؟ صحیح اور بااعتماد کاریگر ڈھونڈیں۔",
  "hero.subtitle": "مسئلہ بتائیں، اپنے علاقے کے مقامی پلمبرز اور الیکٹریشنز سے ریٹ حاصل کریں، اور اپنی مرضی سے منتخب کریں۔",
  "hero.cta_post": "مرمت کی درخواست دیں ←",
  "hero.cta_worker": "بطور کاریگر شامل ہوں",
  "hero.perks": "پوسٹ کرنا بالکل مفت · ریٹ کا موازنہ · کاریگر کا انتخاب",
  "hero.privacy_badge": "آپ کا گھر کا پتہ اس وقت تک مکمل خفیہ رہتا ہے جب تک آپ کاریگر منتخب نہیں کرتے۔",
  "hero.privacy_sub": "بولیاں دینے والے صرف آپ کا علاقہ دیکھ سکتے ہیں۔ پورا پتہ صرف اس کاریگر کو ملتا ہے جسے آپ خود ہائر کرتے ہیں۔",

  // Category choices
  "cat.choose_title": "آپ کو کس کام میں مدد چاہیے؟",
  "cat.plumbing_title": "پلمبنگ سروس",
  "cat.plumbing_urdu": "پلمبر",
  "cat.plumbing_desc": "نل، پائپ لیکیج، پانی کی موٹر، گیزر، نالی بند",
  "cat.electrical_title": "الیکٹریکل سروس",
  "cat.electrical_urdu": "الیکٹریشن",
  "cat.electrical_desc": "وائرنگ، پنکھا، لائٹ، سوئچ بورڈ، شارٹ سرکٹ، بریکر",

  // How it works
  "hiw.title": "مددگار پر کام کروانے کا آسان طریقہ",
  "hiw.step1_title": "1. مسئلہ بتائیں",
  "hiw.step1_desc": "مسئلہ منتخب کریں اور اپنا علاقہ منتخب کریں (جیسے جوہر ٹاؤن، گلبرگ، ڈی ایچ اے)۔ کسی مشکل اصطلاح کی ضرورت نہیں۔",
  "hiw.step2_title": "2. ریٹ دیکھیں اور موازنہ کریں",
  "hiw.step2_desc": "لاہور کے تصدیق شدہ کاریگر آپ کو مزدوری اور وقت کے ساتھ واضح کوٹیشن بھیجتے ہیں۔ کوئی خفیہ فیس نہیں۔",
  "hiw.step3_title": "3. اعتماد سے کام کروائیں",
  "hiw.step3_desc": "پسندیدہ کاریگر منتخب کریں۔ آپ کا گھر کا پتہ صرف منتخب شدہ کاریگر کو نظر آئے گا۔ کام تسلی بخش ہونے پر براہ راست ادائیگی کریں۔",

  // Empty state & activity
  "empty.no_jobs_title": "اپنے علاقے میں مرمت کی پہلی درخواست دیں",
  "empty.no_jobs_desc": "لاہور بھر کے تجربہ کار پلمبر اور الیکٹریشن دستیاب ہیں۔ اپنی درخواست پوسٹ کریں اور 15 سے 45 منٹ میں مستند ریٹ حاصل کریں۔",
  "empty.post_button": "ابھی مرمت کی درخواست پوسٹ کریں",
  "empty.examples_title": "لاہور میں عام کاموں کے متوقع مزدوری ریٹس:",
  "empty.ex_motor": "پانی کی موٹر کپیسٹر یا جوڑ تبدیلی: 1,500 تا 2,500 روپے",
  "empty.ex_tap": "باتھ روم/کچن نل یا مکسر تبدیلی: 800 تا 1,500 روپے",
  "empty.ex_fan": "چھت کے پنکھے کی فٹنگ یا وائرنگ: 1,000 تا 1,800 روپے",
  "empty.ex_geyser": "انسٹنٹ یا گیس گیزر سروس اور مرمت: 1,800 تا 3,000 روپے",

  // Trust & Safety
  "trust.title": "آپ کے گھر اور تحفظ کے لیے مستند اقدامات",
  "trust.subtitle": "ہم صرف زبانی دعوے نہیں کرتے، بلکہ ہر سطح پر آپ کے تحفظ اور رازداری کو یقینی بناتے ہیں:",
  "trust.phone_title": "فون تصدیق شدہ",
  "trust.phone_desc": "ہر کاریگر پاکستانی موبائل نمبر پر او ٹی پی کے ذریعے رجسٹر ہوتا ہے۔",
  "trust.id_title": "شناختی دستاویز جانچی گئی",
  "trust.id_desc": "نادرا شناختی کارڈ اور تصویر کو ہماری لاہور موڈریشن ٹیم چیک کرتی ہے۔",
  "trust.skills_title": "تجربہ اور کام کی جانچ",
  "trust.skills_desc": "کاریگر کے کام کے سال اور مخصوص مہارت پروفائل پر درج ہوتی ہے۔",
  "trust.reviews_title": "صرف اصلی کسٹمرز کے جائزے",
  "trust.reviews_desc": "ریٹنگ صرف وہی کسٹمر دے سکتا ہے جس کا کام واقعی مکمل ہوا ہو۔",
  "trust.privacy_guarantee_title": "گھر کے پتے کا مکمل تحفظ (سرور سائیڈ کنٹرول)",
  "trust.privacy_guarantee_desc": "آپ کا مکمل پتہ کبھی پبلک نہیں ہوتا۔ سسٹم خودکار طور پر اس وقت تک پتہ بلاک رکھتا ہے جب تک آپ خود کاریگر قبول نہ کریں۔",
  "trust.report_button": "شکایت درج کریں یا مسئلہ رپورٹ کریں",

  // Technician recruitment
  "recruitment.title": "کیا آپ لاہور میں پلمبر یا الیکٹریشن ہیں؟",
  "recruitment.desc": "اپنے قریبی علاقوں میں گھروں کے کام حاصل کریں۔ بغیر کسی مڈل مین یا کمیشن کے 100 فیصد اپنی کمائی رکھیں۔",
  "recruitment.btn": "بطور کاریگر رجسٹر ہوں ←",

  // Customer Job Posting Flow
  "post.step1_title": "کیا کام کروانا ہے؟",
  "post.step1_sub": "قریبی آپشن منتخب کریں۔ اگلے مرحلے میں آپ مزید وضاحت لکھ سکتے ہیں۔",
  "post.choose_trade": "کام کی قسم",
  "post.problem_label": "کیا مسئلہ ہے؟",
  "post.area_label": "لاہور کا علاقہ",
  "post.urgency_label": "کام کب کروانا ہے؟",
  "post.urgency_asap": "فوری — جتنا جلدی ممکن ہو",
  "post.urgency_today": "آج ہی",
  "post.urgency_tomorrow": "کل",
  "post.urgency_anytime": "کسی بھی مناسب وقت پر",
  "post.next_btn": "تفصیلات درج کریں ←",
  "post.back_btn": "← واپس",
  "post.details_label": "مسئلے کی مختصر تفصیل",
  "post.details_placeholder": "آسان الفاظ میں لکھیں کہ کیا خرابی ہے (مثلاً: واش روم کا نل مسلسل ٹپک رہا ہے)...",
  "post.landmark_label": "قریبی مشہور جگہ یا بلاک",
  "post.landmark_placeholder": "مثلاً: لبرٹی مارکیٹ کے قریب، بلاک سی (ابھی گھر کا نمبر مت لکھیں)",
  "post.landmark_hint": "گھر کا مکمل پتہ صرف اسی وقت لیا جائے گا جب آپ کاریگر منتخب کریں گے۔",
  "post.phone_label": "آپ کا موبائل نمبر (ریٹ کی اطلاع کے لیے)",
  "post.budget_label": "اندازاً بجٹ (روپے، اختیاری)",
  "post.electrical_safety_title": "⚠️ بجلی کے کام کے لیے حفاظتی انتباہ",
  "post.electrical_safety_body": "اگر تاروں سے جلنے کی بو آئے، چنگاریاں نکلیں یا بریکر سے آواز آئے تو فوراً مین سوئچ بند کر دیں۔ ننگی تاروں کو ہاتھ نہ لگائیں۔",
  "post.submit_btn": "درخواست پوسٹ کریں (بالکل مفت)",
  "post.summary_title": "اپنی درخواست کا جائزہ لیں",
  "post.free_notice": "پوسٹ کرنا بالکل مفت ہے۔ آپ کسی بھی کوٹیشن کو قبول کرنے کے پابند نہیں ہیں۔",

  // Quote comparison
  "quote.title": "کاریگروں کے ریٹس کا موازنہ کریں",
  "quote.empty": "ابھی تک کوئی بولی موصول نہیں ہوئی۔ آپ کے علاقے کے کاریگروں کو الرٹ بھیج دیا گیا ہے۔",
  "quote.labour_only": "صرف مزدوری (سامان علیحدہ)",
  "quote.parts_included": "مزدوری اور سامان کا تخمینہ شامل",
  "quote.inspection_fee": "صرف معائنہ فیس",
  "quote.accept_btn": "یہ ریٹ قبول کریں اور کاریگر بلائیں",
  "quote.accept_modal_title": "کاریگر منتخب کریں اور پتہ درج کریں",
  "quote.accept_modal_body": "اپنے گھر کا مکمل پتہ اور گلی درج کریں۔ یہ پتہ صرف اس منتخب کاریگر کو نظر آئے گا۔",
  "quote.exact_address_label": "مکان نمبر اور گلی کا پتہ:",
  "quote.exact_address_placeholder": "مثلاً: مکان نمبر 18-A، گلی 4، بلاک بی، گلبرگ III، لاہور",

  // Report Modal
  "report.modal_title": "مسئلہ یا شکایت درج کریں",
  "report.type_noshow": "کاریگر وقت پر نہیں آیا (No-show)",
  "report.type_overcharge": "غلط یا زیادہ چارجز کا مطالبہ (Overcharging)",
  "report.type_harassment": "غیر مناسب رویہ یا بدتمیزی (Harassment)",
  "report.type_fake": "جعلی اکاؤنٹ یا دھوکہ دہی (Fake account)",
  "report.type_safety": "حفاظتی مسئلہ یا نقصان (Safety hazard)",
  "report.type_other": "دیگر کوئی شکایت (Other issue)",
  "report.details_label": "تفصیل سے بتائیں کہ کیا مسئلہ ہوا:",
  "report.submit_btn": "شکایت جمع کروائیں",
  "report.success": "آپ کی شکایت موصول ہو چکی ہے اور لاہور موڈریشن ٹیم کو بھیج دی گئی ہے۔",

  // Footer
  "footer.rights": "© مددگار لاہور · لاہور میں پلمبنگ اور الیکٹریکل کاموں کی شفاف مارکیٹ۔",
  "footer.direct_pay": "براہ راست ادائیگی: کسٹمر تسلی بخش کام مکمل ہونے پر براہ راست کاریگر کو رقم ادا کرتا ہے۔",
  "footer.safety": "حفاظتی رہنمائی",
  "footer.terms": "شرائط و ضوابط",
  "footer.privacy": "پرائیویسی پالیسی",
  "footer.help": "مدد و رابطہ",
};

export type MessageKey = keyof typeof en;
const dictionaries: Record<Locale, Record<MessageKey, string>> = { en, ur };

export function getLocale(): Locale {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("maddad_locale") as Locale | null;
    if (saved === "ur" || saved === "en") return saved;
  }
  return "en";
}

export function t(key: MessageKey, locale: Locale = "en"): string {
  return dictionaries[locale]?.[key] ?? en[key] ?? key;
}
