import { describe, expect, it } from "vitest";
import { sanitizeLog } from "../engine/sanitizeLog";
import { scanLog } from "../engine/scanLog";

describe("JSON contract - no secret leakage", () => {
  it("sanitizeLog does not include raw matched values and never includes a `value` field", () => {
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

  it("sanitizeLog dry-run is safe to serialize and does not leak raw input", () => {
    const input = "password=SECRET\n";

    const result = sanitizeLog(input, { strict: false, dryRun: true });
    const json = JSON.stringify(result);

    // No raw secrets
    expect(json).not.toContain("SECRET");

    // Output is intentionally empty in dry-run mode
    expect(result.output).toBe("");
  });

  it("scanLog is safe to serialize and only returns rule names", () => {
    const input = "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SECRET.SECRET\n";

    const result = scanLog(input, { strict: false });
    const json = JSON.stringify(result);

    expect(json).not.toContain("SECRET");
    expect(json).not.toContain('"value"');
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.matches.every((m) => typeof m.rule === "string")).toBe(true);
  });
});
