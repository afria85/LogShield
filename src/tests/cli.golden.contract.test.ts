import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const CLI = join(process.cwd(), "dist/cli/index.cjs");

function run(input: string, args: string[] = []) {
  const p = spawnSync("node", [CLI, "scan", ...args], {
    input,
    encoding: "utf-8",
  });

  return {
    code: p.status ?? 0,
    stdout: (p.stdout || "").replace(/\r\n/g, "\n"),
    stderr: (p.stderr || "").replace(/\r\n/g, "\n"),
  };
}

describe("CLI golden contract (end-to-end)", () => {
  it("sanitizes x-api-key without corrupting header", () => {
    const r = run("x-api-key: sk_test_1234567890abcdef\n");
    expect(r.code).toBe(0);
    expect(r.stdout).toBe("x-api-key: <REDACTED_API_KEY>\n");
    expect(r.stderr).toBe("");
  });

  it("--dry-run prints report to STDOUT and does not echo log content", () => {
    const r = run(
      "email=test@example.com Authorization: Bearer abcdefghijklmnop\n",
      ["--dry-run"]
    );

    expect(r.code).toBe(0);
    expect(r.stderr).toBe("");
    expect(r.stdout).toContain("logshield (dry-run)\n");
    expect(r.stdout).toContain("Detected 2 redactions");
    expect(r.stdout).toContain("EMAIL");
    expect(r.stdout).toContain("AUTH_BEARER");
    // Ensure it does NOT print sanitized log line
    expect(r.stdout).not.toContain("<REDACTED_EMAIL>");
    expect(r.stdout).not.toContain("<REDACTED_TOKEN>");
  });

  it("--summary outputs sanitized logs to STDOUT and summary to STDERR", () => {
    const r = run(
      "email=test@example.com Authorization: Bearer abcdefghijklmnop\n",
      ["--summary"]
    );

    expect(r.code).toBe(0);

    // Sanitized output goes to stdout (with newline)
    expect(r.stdout).toBe("email=<REDACTED_EMAIL> Authorization: Bearer <REDACTED_TOKEN>\n");

    // Summary goes to stderr (deterministic + alphabetical due to summary.ts contract)
    expect(r.stderr).toBe(
      "LogShield Summary\n" +
      "  AUTH_BEARER  x1\n" +
      "  EMAIL        x1\n"
    );
  });

  it("--json outputs valid json and ends with newline", () => {
    const r = run("password=secret123\n", ["--json"]);

    expect(r.code).toBe(0);
    expect(r.stderr).toBe("");
    expect(r.stdout.endsWith("\n")).toBe(true);

    const parsed = JSON.parse(r.stdout.trim());
    expect(parsed.matches.length).toBe(1);
    expect(parsed.matches[0].rule).toBe("PASSWORD");
    expect("value" in parsed.matches[0]).toBe(false);
  });

  it("--fail-on-detect exits with code 1", () => {
    const r = run("password=secret123\n", ["--dry-run", "--fail-on-detect"]);
    expect(r.code).toBe(1);
  });

  it("--json + --dry-run outputs machine-readable detection without leaking input", () => {
    const r = run("password=secret123\n", ["--json", "--dry-run"]);

    expect(r.code).toBe(0);
    expect(r.stderr).toBe("");
    expect(r.stdout.endsWith("\n")).toBe(true);

    const parsed = JSON.parse(r.stdout.trim());
    expect(parsed.output).toBe("");
    expect(parsed.matches.length).toBe(1);
    expect(parsed.matches[0].rule).toBe("PASSWORD");
    expect("value" in parsed.matches[0]).toBe(false);

    expect(r.stdout).not.toContain("secret123");
  });
});
