import { describe, expect, it } from "vitest";
import { sanitizeLog } from "../engine/sanitizeLog";

describe("CLI/JSON safety contract", () => {
  it("never exposes raw match values in matches (no `value` field)", () => {
    const input =
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SECRET.SECRET\npassword=SUPERSECRET\n";
    const result = sanitizeLog(input, { strict: false, dryRun: false });

    const json = JSON.stringify(result);

    // Must never leak the raw tokens/passwords via result JSON.
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("SUPERSECRET");

    // Must not include match values field at all.
    expect(json).not.toContain('"value"');
  });
});
