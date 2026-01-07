import { describe, expect, it } from "vitest";
import { sanitizeLog } from "../engine/sanitizeLog";

describe("JSON contract - no secret leakage", () => {
  it("does not include raw matched values and never includes a `value` field", () => {
    const input =
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SECRET.SECRET\npassword=SECRET\n";

    const result = sanitizeLog(input, { strict: false, dryRun: false });
    const json = JSON.stringify(result);

    // No raw secrets
    expect(json).not.toContain("SECRET");

    // No raw match payload field
    expect(json).not.toContain('"value"');

    // Shape still contains rules
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.matches.every((m) => typeof m.rule === "string")).toBe(true);
  });
});
