/**
 * Pakistan phone normalisation → E.164 (+92XXXXXXXXXX).
 * Accepts: 03001234567, 0300-1234567, 3001234567, 923001234567, +92 300 1234567, 0092300...
 * Mobile numbers only (10 digits after 92, starting with 3).
 */
export function normalizePkPhone(input: string): string | null {
  let d = input.replace(/[\s\-().]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("0092")) d = d.slice(2);
  if (d.startsWith("92")) d = d.slice(2);
  else if (d.startsWith("0")) d = d.slice(1);
  if (!/^3\d{9}$/.test(d)) return null;
  return "+92" + d;
}

/** Masks a phone for display/logging: +92300****567 */
export function maskPhone(p: string): string {
  return p.length > 7 ? p.slice(0, 6) + "****" + p.slice(-3) : "****";
}

/**
 * Masks Pakistani phone numbers in pre-hire chat or user text to protect privacy
 * and prevent off-platform contact leakage.
 */
export function maskSensitiveContact(text: string): string {
  return text
    // 1. Spaced-out phone digits, e.g. "0 3 0 0 1 2 3 4 5 6 7" or "+92 3 0 0 1 2 3 4 5 6 7"
    .replace(/(?:\+?92\s*|0\s*)3(?:\s*\d){9}/gi, "[Phone Masked / نمبر پوشیدہ]")
    // 2. Standard formatting e.g. 0300-1234567, +923001234567, 0300 1234567
    .replace(/(?:\+?92\s*|0)?3\d{2}[\s.-]?\d{7}/gi, "[Phone Masked / نمبر پوشیدہ]")
    // 3. Generic 10-12 digit numbers
    .replace(/\b\d{10,12}\b/g, "[Number Masked]");
}

