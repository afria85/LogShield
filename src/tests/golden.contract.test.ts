import { describe, it, expect } from "vitest";
import { sanitizeLog } from "./sanitizeLog";

type Case = {
  name: string;
  input: string;
  expectedOutput: string;
  expectedRules?: string[];
};

function rules(result: { matches: Array<{ rule: string }> }): string[] {
  return result.matches.map((m) => m.rule);
}

describe("Golden contract cases (pre-publish gate)", () => {
  const cases: Case[] = [
    {
      name: "PASS THROUGH: normal logs unchanged",
      input: "This is normal log output",
      expectedOutput: "This is normal log output",
      expectedRules: [],
    },
    {
      name: "PASSWORD: preserves delimiter and spacing",
      input: "Password :   supersecret123",
      expectedOutput: "Password :   <REDACTED_PASSWORD>",
      expectedRules: ["PASSWORD"],
    },
    {
      name: "PASSWORD: equals delimiter",
      input: "password=supersecret123",
      expectedOutput: "password=<REDACTED_PASSWORD>",
      expectedRules: ["PASSWORD"],
    },
    {
      name: "DB_URL_CREDENTIAL: redact only password in URL authority",
      input: "POSTGRES_URL=postgres://user:supersecret@db.internal",
      expectedOutput: "POSTGRES_URL=postgres://user:<REDACTED_PASSWORD>@db.internal",
      expectedRules: ["DB_URL_CREDENTIAL"],
    },
    {
      name: "EMAIL: redact email address",
      input: "contact test@example.com now",
      expectedOutput: "contact <REDACTED_EMAIL> now",
      expectedRules: ["EMAIL"],
    },
    {
      name: "AUTH_BEARER: redact bearer token (single match, no double-count)",
      input: "Authorization: Bearer abcdefghijklmnop",
      expectedOutput: "Authorization: Bearer <REDACTED_TOKEN>",
      expectedRules: ["AUTH_BEARER"],
    },
    {
      name: "AUTH_BEARER + EMAIL together (2 matches total)",
      input: "email=test@example.com Authorization: Bearer abcdefghijklmnop",
      expectedOutput: "email=<REDACTED_EMAIL> Authorization: Bearer <REDACTED_TOKEN>",
      expectedRules: ["EMAIL", "AUTH_BEARER"],
    },
    {
      name: "API_KEY_HEADER: must NOT corrupt header name",
      // This is the bug Claude found. This test prevents regression forever.
      input: "x-api-key: sk_test_1234567890abcdef",
      expectedOutput: "x-api-key: <REDACTED_API_KEY>",
      expectedRules: ["API_KEY_HEADER"],
    },
    {
      name: "API_KEY: redact generic api_key=... value",
      input: "api_key=abcdef1234567890abcdef",
      expectedOutput: "api_key=<REDACTED_API_KEY>",
      expectedRules: ["API_KEY"],
    },
    {
      name: "URL: redact embedded credentials only (userinfo)",
      input: "https://user:supersecret@example.com/path",
      expectedOutput: "https://user:<REDACTED_PASSWORD>@example.com/path",
      expectedRules: ["URL"],
    },
    {
      name: "URL: redact only sensitive params (keep others)",
      input: "https://example.com/callback?code=ok&access_token=ABC123&lang=en#id_token=XYZ&foo=bar",
      expectedOutput:
        "https://example.com/callback?code=ok&access_token=<REDACTED_URL_PARAM>&lang=en#id_token=<REDACTED_URL_PARAM>&foo=bar",
      expectedRules: ["URL"],
    },
    {
      name: "JWT: redact JWT-like token",
      input: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.sig",
      expectedOutput: "Authorization: Bearer <REDACTED_JWT>",
      expectedRules: ["JWT"],
    },
  ];

  for (const tc of cases) {
    it(tc.name, () => {
      const result = sanitizeLog(tc.input);

      expect(result.output).toBe(tc.expectedOutput);

      if (tc.expectedRules) {
        // Compare as sets (order should not matter for matches list).
        const got = rules(result).sort();
        const want = [...tc.expectedRules].sort();
        expect(got).toEqual(want);
      }
    });
  }

  it("GUARD: bearer token must never double-count in matches", () => {
    const input = "Authorization: Bearer abcdefghijklmnop";
    const result = sanitizeLog(input);

    const bearer = result.matches.filter((m) => m.rule === "AUTH_BEARER");
    expect(bearer.length).toBe(1);

    // No other bearer-ish rule should exist after the fix.
    const nonAuthBearer = result.matches.filter((m) => m.rule !== "AUTH_BEARER");
    expect(nonAuthBearer.length).toBe(0);
  });
});
