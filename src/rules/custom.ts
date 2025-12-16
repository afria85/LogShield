import { SanitizeRule } from "./types";

function isLuhnValid(raw: string): boolean {
  const num = raw.replace(/\s+/g, "");
  let sum = 0;
  let shouldDouble = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export const customRules: SanitizeRule[] = [
  {
    name: "STRIPE_SECRET_KEY",
    strictOnly: true,
    /**
     * Supports:
     * - sk_test_XXXX / sk_live_XXXX  (real Stripe)
     * - LS_STRIPE_TEST_KEY_XXXX      (contract fixtures)
     */
    regex:
      /\b(?:sk_(?:test|live)_[A-Za-z0-9]{16,}|LS_STRIPE_(?:TEST|LIVE)_KEY_[A-Z0-9_]{8,})\b/g,
    replace: "<REDACTED_STRIPE_KEY>",
  },
  {
    name: "GENERIC_SECRET_KV",
    strictOnly: true,
    regex: /"([^"]+)"\s*:\s*"[^"]+"/g,
    replace: (_m, key) => `"${key}":"<REDACTED_SECRET>"`,
  },
  {
    name: "CREDIT_CARD",
    strictOnly: true,
    regex: /\b(?:\d{4}\s?){3,4}\d{4}\b/g,
    replace: (m) => (isLuhnValid(m) ? "<REDACTED_CC>" : m),
  },
];
