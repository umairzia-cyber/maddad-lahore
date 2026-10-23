import test from "node:test";
import assert from "node:assert/strict";
import { detectSmartCategory } from "../src/lib/smartCategory";

test("Smart Category: Detects Mehndi and Bridal Makeup in Roman Urdu and English", () => {
  const r1 = detectSmartCategory("Shadi ke liye 3 larkiyon ki mehndi aur bridal makeup chahiye DHA Phase 5 mein");
  assert.ok(r1 !== null);
  assert.equal(r1.categorySlug, "beauty-salon");
  assert.equal(r1.femaleProviderSuggested, true);

  const r2 = detectSmartCategory("Need professional nail art and hydra facial at home in Gulberg");
  assert.ok(r2 !== null);
  assert.equal(r2.categorySlug, "beauty-salon");
});

test("Smart Category: Detects Maids and Deep Cleaning", () => {
  const r1 = detectSmartCategory("Ghar ki safai aur bartan dhone ke liye full time maid chahiye");
  assert.ok(r1 !== null);
  assert.equal(r1.categorySlug, "home-care");

  const r2 = detectSmartCategory("Need sofa set shampoo cleaning and kitchen deep clean");
  assert.ok(r2 !== null);
  assert.equal(r2.categorySlug, "home-care");
});

test("Smart Category: Detects Plumbing and Electrical Faults", () => {
  const r1 = detectSmartCategory("Water motor pump is leaking in Johar Town");
  assert.ok(r1 !== null);
  assert.equal(r1.categorySlug, "plumbing");

  const r2 = detectSmartCategory("UPS inverter wiring spark and main DB breaker tripping");
  assert.ok(r2 !== null);
  assert.equal(r2.categorySlug, "electrical");
});

test("Smart Category: Flags female provider safety preference", () => {
  const r1 = detectSmartCategory("Need female beautician only for facial and waxing at home");
  assert.ok(r1 !== null);
  assert.equal(r1.femaleProviderSuggested, true);

  const r2 = detectSmartCategory("خاتون کاریگر برائے مہندی اور میک اپ");
  assert.ok(r2 !== null);
  assert.equal(r2.categorySlug, "beauty-salon");
  assert.equal(r2.femaleProviderSuggested, true);
});
