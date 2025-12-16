import { describe, it, expect } from "vitest";
import { sanitizeLog } from "./sanitizeLog";

describe("LogShield sanitizeLog (token-based)", () => {
  it("redacts API keys", () => {
    const input = "apiKey=abcdef1234567890";
    const result = sanitizeLog(input);

    expect(result.output).toBe("<REDACTED_API_KEY>");
    expect(result.matches.length).toBe(1);
    expect(result.matches[0].rule).toBe("API_KEY");
  });

  it("redacts bearer tokens", () => {
    const input = "Authorization: Bearer sk_test_1234567890abcdef";
    const result = sanitizeLog(input);

    expect(result.output).toContain("<REDACTED_TOKEN>");
    expect(result.matches[0].rule).toBe("AUTH_BEARER");
  });

  it("redacts JWT tokens", () => {
    const input =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abc.def";
    const result = sanitizeLog(input);

    expect(result.output).toBe("<REDACTED_JWT>");
    expect(result.matches[0].rule).toBe("JWT");
  });

  it("redacts emails", () => {
    const input = "contact test@example.com now";
    const result = sanitizeLog(input);

    expect(result.output).toContain("<REDACTED_EMAIL>");
    expect(result.matches[0].rule).toBe("EMAIL");
  });

  it("redacts credit cards only in strict mode", () => {
    const input = "cc=4111 1111 1111 1111";

    const nonStrict = sanitizeLog(input);
    expect(nonStrict.output).toBe(input);
    expect(nonStrict.matches.length).toBe(0);

    const strict = sanitizeLog(input, { strict: true });
    expect(strict.output).toBe("cc=<REDACTED_CC>");
    expect(strict.matches[0].rule).toBe("CREDIT_CARD");
  });

  it("returns empty output for empty input", () => {
    const result = sanitizeLog("");

    expect(result.output).toBe("");
    expect(result.matches.length).toBe(0);
  });

  it("throws error for oversized input", () => {
    const input = "a".repeat(204_801);

    expect(() => sanitizeLog(input)).toThrow(
      "Log size exceeds 200KB limit"
    );
  });
});
