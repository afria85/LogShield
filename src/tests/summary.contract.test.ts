import { describe, it, expect } from "vitest";
import { printSummary } from "../cli/summary";

function captureStderr(fn: () => void): string {
  const chunks: string[] = [];
  const orig = process.stderr.write;
  // @ts-ignore
  process.stderr.write = (chunk: string) => {
    chunks.push(chunk);
    return true;
  };
  try {
    fn();
  } finally {
    process.stderr.write = orig;
  }
  return chunks.join("");
}

describe("--summary output contract", () => {
  it("prints rules sorted alphabetically with indent", () => {
    const out = captureStderr(() =>
      printSummary([
        { rule: "PASSWORD" } as any,
        { rule: "API_KEY_HEADER" } as any,
        { rule: "PASSWORD" } as any,
      ])
    );

    expect(out).toBe(
      "LogShield Summary\n" +
      "  API_KEY_HEADER  x1\n" +
      "  PASSWORD        x2\n"
    );
  });
});
