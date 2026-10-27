import test from "node:test";
import assert from "node:assert/strict";
import { maskSensitiveContact } from "../src/lib/phone";
import { getOtpProvider } from "../src/lib/otp/provider";
import { adminPhones, DEMO_ACCOUNTS } from "../src/lib/config";
import { store } from "../src/lib/store";

test("Security Safeguard 1: maskSensitiveContact redacts Pakistani phone numbers across formatting styles", () => {
  // Standard formats
  assert.match(
    maskSensitiveContact("Call me at 03001234567 for details"),
    /\[Phone Masked \/ نمبر پوشیدہ\]/
  );
  assert.match(
    maskSensitiveContact("My contact: 0300-1234567"),
    /\[Phone Masked \/ نمبر پوشیدہ\]/
  );
  assert.match(
    maskSensitiveContact("WhatsApp on +92 300 1234567"),
    /\[Phone Masked \/ نمبر پوشیدہ\]/
  );

  // Evasion attempt: spaced-out numbers
  assert.match(
    maskSensitiveContact("Reach me at 0 3 0 0 1 2 3 4 5 6 7"),
    /\[Phone Masked \/ نمبر پوشیدہ\]/
  );

  // Non-phone numbers and everyday messages should NOT be corrupted
  const innocentMessage = "I need help with a leak in Gulberg 3. Budget is 2500 PKR. Please bring 2 spare pipes.";
  assert.equal(maskSensitiveContact(innocentMessage), innocentMessage);
});

test("Security Safeguard 2: Demo personas cannot be granted admin rights in production", () => {
  const demoLast7 = DEMO_ACCOUNTS.map((d) => d.phone.replace(/[^0-9]/g, "").slice(-7));

  // Verify Fatima and demo personas are identified as demo numbers
  assert.ok(demoLast7.includes("1234567"), "Fatima 0300 1234567 must be recognized as demo");

  // In production, adminPhones filter ensures none of the demo numbers can appear in admin list
  for (const adminPhone of adminPhones) {
    const last7 = adminPhone.replace(/[^0-9]/g, "").slice(-7);
    assert.ok(!demoLast7.includes(last7), `Demo number ${adminPhone} must never be in adminPhones`);
  }
});

test("Security Safeguard 3: OTP provider does not return devProvider in production when credentials missing", () => {
  const prevEnv = process.env.NODE_ENV;
  const prevWhatsapp = process.env.WHATSAPP_API_TOKEN;
  const prevTwilio = process.env.TWILIO_AUTH_TOKEN;

  try {
    delete process.env.WHATSAPP_API_TOKEN;
    delete process.env.TWILIO_AUTH_TOKEN;
    (process.env as any).NODE_ENV = "production";

    const provider = getOtpProvider();
    // In production without credentials, provider must be null (fail-closed), NOT devProvider
    assert.equal(provider, null, "Production without OTP credentials must fail-closed (return null)");
  } finally {
    (process.env as any).NODE_ENV = prevEnv;
    if (prevWhatsapp) process.env.WHATSAPP_API_TOKEN = prevWhatsapp;
    if (prevTwilio) process.env.TWILIO_AUTH_TOKEN = prevTwilio;
  }
});

test("Security Safeguard 4: Sealed-bid privacy - Public jobs feed never discloses private bidder pricing", () => {
  const customerId = "u-demo-customer";
  const worker1 = "u-demo-worker-elec";
  const worker2 = "u-demo-worker-plumb";

  const jobId = store.createDraft(customerId, {
    categoryId: 1,
    areaId: 1,
    title: "Leaking water heater pipe in bathroom",
    description: "Cold water pipe leaking under heater. Need replacement immediately.",
    budgetMin: 3000,
    budgetMax: 5000,
    asap: true,
    addressText: "Main Market Gulberg, Lahore",
    contactNote: "Call before coming",
  });
  store.publishJob(customerId, jobId);

  store.submitBid(worker1, jobId, {
    amount: 3200,
    timingText: "Today 4pm",
    message: "Experienced technician with parts",
    inclusions: "Labour and pipe check",
    exclusions: "Extra fixtures",
  });
  store.submitBid(worker2, jobId, {
    amount: 4500,
    timingText: "Tomorrow morning",
    message: "Certified technician available",
    inclusions: "Complete repair",
    exclusions: "None",
  });

  // Verify public feed
  const publicJobs = store.getPublicJobs();
  const target = publicJobs.find((j) => j.id === jobId);
  assert.ok(target, "Job must appear in public feed");
  assert.equal(target?.bid_count, 2, "Public bid count is visible");

  // Private bids comparison only available to the customer
  const customerBids = store.listBidsForCustomer(customerId, jobId);
  assert.equal(customerBids.length, 2, "Customer can see all quotes");
  assert.equal(customerBids[0].amount, 3200);
  assert.equal(customerBids[1].amount, 4500);

  // A different worker or guest must NOT be able to view competitor quotes
  assert.throws(
    () => store.listBidsForCustomer("random-visitor-id", jobId),
    /not found/i,
    "Unauthorized user cannot list private customer bids"
  );
});
