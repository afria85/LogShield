import { describe, expect, it } from "vitest";
import { sanitizeLog } from "./sanitizeLog";
import { MAX_INPUT_SIZE, MAX_LINE_LENGTH } from "../engine/guard";

function repeatToLength(chunk: string, maxLength: number): string {
  return chunk.repeat(Math.ceil(maxLength / chunk.length)).slice(0, maxLength);
}

describe("regex safety regression coverage", () => {
  it("handles separator-heavy credit-card near-miss input without redacting it", () => {
    const input = repeatToLength("1 ".repeat(18) + "X ", MAX_LINE_LENGTH - 1);

    const result = sanitizeLog(input, { strict: true });

    expect(result.output).toBe(input);
    expect(result.matches.length).toBe(0);
  });

  it("handles unterminated password quotes near the line cap deterministically", () => {
    const input = `password="${"A".repeat(MAX_LINE_LENGTH - 'password="'.length)}`;

    const result = sanitizeLog(input);

    expect(result.output).toBe("password=<REDACTED_PASSWORD>");
    expect(result.matches).toEqual([{ rule: "PASSWORD" }]);
  });

  it("handles an unterminated private-key block near the input cap without scanning past the cap", () => {
    const header = "-----BEGIN PRIVATE KEY-----\n";
    const bodyChunk = `${"A".repeat(4096)}\n`;
    const input = header + repeatToLength(bodyChunk, MAX_INPUT_SIZE - header.length);

    const result = sanitizeLog(input);

    expect(result.output.startsWith("<REDACTED_PRIVATE_KEY_HEADER>\n")).toBe(true);
    expect(result.matches.some((m) => m.rule === "PRIVATE_KEY_HEADER")).toBe(true);
    expect(result.matches.some((m) => m.rule === "PRIVATE_KEY_BLOCK")).toBe(false);
  });

  it("handles long URL query strings with many non-sensitive params without altering them", () => {
    const prefix = "https://example.com/path?";
    const query = repeatToLength("foo=bar&trace=1234567890&lang=en&", MAX_LINE_LENGTH - prefix.length);
    const input = `${prefix}${query}`.slice(0, MAX_LINE_LENGTH);

    const result = sanitizeLog(input);

    expect(result.output).toBe(input);
    expect(result.matches.length).toBe(0);
  });
});
