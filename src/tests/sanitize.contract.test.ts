import { describe, it, expect } from "vitest";
import { sanitizeLog } from "./sanitizeLog";

describe("LogShield sanitizeLog ? CONTRACT TEST", () => {
  // =========================
  // DEFAULT MODE (NON-STRICT)
  // =========================

  it("default: redacts JWT but keeps test keys", () => {
    const input = `
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.sig
sk_test_1234567890abcdefghijklmnopqrstuvwxyz
`;

    const result = sanitizeLog(input);

    expect(result.output).toContain("<REDACTED_JWT>");
    expect(result.output).toContain(
      "sk_test_1234567890abcdefghijklmnopqrstuvwxyz"
    );
  });

  it("default: redacts password fields", () => {
    const input = `password=supersecret123`;
    const result = sanitizeLog(input);

    expect(result.output).toBe("password=<REDACTED_PASSWORD>");
    expect(result.matches[0].rule).toBe("PASSWORD");
  });

  it("default: preserves delimiter and spacing for password fields", () => {
    const input = `Password :   supersecret123`;
    const result = sanitizeLog(input);

    expect(result.output).toBe("Password :   <REDACTED_PASSWORD>");
    expect(result.matches[0].rule).toBe("PASSWORD");
  });

  it("default: does NOT redact AWS access key", () => {
    const input = `AKIA1234567890TEST1234`;
    const result = sanitizeLog(input);

    expect(result.output).toBe(input);
    expect(result.matches.length).toBe(0);
  });

  it("default: keeps normal URLs intact", () => {
    const input = `https://example.com/path?q=hello&lang=en#section`;
    const result = sanitizeLog(input);
    expect(result.output).toBe(input);
    expect(result.matches.length).toBe(0);
  });

  it("default: redacts credentials inside URLs but preserves the URL", () => {
    const input = `https://user:supersecret@example.com/path`;
    const result = sanitizeLog(input);
    expect(result.output).toBe(`https://user:<REDACTED_PASSWORD>@example.com/path`);
    expect(result.matches.some((m) => m.rule === "URL")).toBe(true);
  });

  it("default: redacts sensitive query/fragment params inside URLs", () => {
    const input = `https://example.com/callback?code=ok&access_token=ABC123&lang=en#id_token=XYZ&foo=bar`;
    const result = sanitizeLog(input);
    expect(result.output).toBe(
      `https://example.com/callback?code=ok&access_token=<REDACTED_URL_PARAM>&lang=en#id_token=<REDACTED_URL_PARAM>&foo=bar`
    );
    expect(result.matches.some((m) => m.rule === "URL")).toBe(true);
  });

  // =========================
  // STRICT MODE (ZERO-LEAK)
  // =========================

  it("strict: redacts AWS access keys", () => {
    const input = `AKIA1234567890TEST1234`;
    const result = sanitizeLog(input, { strict: true });

    expect(result.output).toBe("<REDACTED_AWS_KEY>");
    expect(result.matches[0].rule).toBe("AWS_ACCESS_KEY");
  });

  it("strict: redacts Stripe test & live keys", () => {
    const input = `
LS_STRIPE_TEST_KEY_XXXXXXXXXXXXXXXX
LS_STRIPE_LIVE_KEY_XXXXXXXXXXXXXXXX
`;

    const result = sanitizeLog(input, { strict: true });

    expect(result.output).toContain("<REDACTED_STRIPE_KEY>");
    expect(result.matches.some(m => m.rule === "STRIPE_SECRET_KEY")).toBe(true);
  });

  it("strict: redacts secrets inside JSON values", () => {
    const input = `{"token":"abc123secretvalue"}`;
    const result = sanitizeLog(input, { strict: true });

    expect(result.output).toBe(`{"token":"<REDACTED_SECRET>"}`);
    expect(result.matches[0].rule).toBe("GENERIC_SECRET_KV");
  });

  it("strict: redacts credit cards ONLY if Luhn-valid", () => {
    const validCC = "4111 1111 1111 1111";
    const invalidCC = "1234 5678 9012 3456";

    const validResult = sanitizeLog(validCC, { strict: true });
    const invalidResult = sanitizeLog(invalidCC, { strict: true });

    expect(validResult.output).toBe("<REDACTED_CC>");
    expect(validResult.matches[0].rule).toBe("CREDIT_CARD");

    expect(invalidResult.output).toBe(invalidCC);
    expect(invalidResult.matches.length).toBe(0);
  });

  // =========================
  // SAFETY & LIMITS
  // =========================

  it("throws error if log exceeds 200KB", () => {
    const bigInput = "A".repeat(204_801);

    expect(() => sanitizeLog(bigInput)).toThrow(
      "Log size exceeds 200KB limit"
    );
  });

  it("returns empty output for empty input", () => {
    const result = sanitizeLog("");
    expect(result.output).toBe("");
    expect(result.matches.length).toBe(0);
  });
});
