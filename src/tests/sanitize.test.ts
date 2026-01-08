import { describe, it, expect } from "vitest";
import { sanitizeLog } from "./sanitizeLog";

describe("LogShield sanitizeLog (token-based)", () => {
  it("redacts API keys (preserves label)", () => {
    const input = "apiKey=abcdef1234567890abcdef";
    const result = sanitizeLog(input);

    expect(result.output).toBe("apiKey=<REDACTED_API_KEY>");
    expect(result.matches.length).toBe(1);
    expect(result.matches[0].rule).toBe("API_KEY");
  });

  it("redacts bearer tokens", () => {
    const input = "Authorization: Bearer abcdefghijklmnop";
    const result = sanitizeLog(input);

    expect(result.output).toBe("Authorization: Bearer <REDACTED_TOKEN>");
    expect(result.matches.length).toBe(1);
    expect(result.matches[0].rule).toBe("AUTH_BEARER");
  });

  it("redacts JWT tokens", () => {
    const input =
      "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.sig";
    const result = sanitizeLog(input);

    expect(result.output).toBe("Authorization: Bearer <REDACTED_JWT>");
    expect(result.matches.length).toBe(1);
    expect(result.matches[0].rule).toBe("JWT");
  });

  it("redacts emails", () => {
    const input = "test@example.com";
    const result = sanitizeLog(input);

    expect(result.output).toBe("<REDACTED_EMAIL>");
    expect(result.matches.length).toBe(1);
    expect(result.matches[0].rule).toBe("EMAIL");
  });

  it("redacts credit cards only in strict mode", () => {
    const cc = "4111 1111 1111 1111";

    const nonStrict = sanitizeLog(cc);
    expect(nonStrict.output).toBe(cc);
    expect(nonStrict.matches.length).toBe(0);

    const strict = sanitizeLog(cc, { strict: true });
    expect(strict.output).toBe("<REDACTED_CC>");
    expect(strict.matches.length).toBe(1);
    expect(strict.matches[0].rule).toBe("CREDIT_CARD");
  });

  it("returns empty output for empty input", () => {
    const result = sanitizeLog("");
    expect(result.output).toBe("");
    expect(result.matches.length).toBe(0);
  });

  it("throws error for oversized input", () => {
    const bigInput = "A".repeat(204_801);
    expect(() => sanitizeLog(bigInput)).toThrow("Log size exceeds 200KB limit");
  });
});
