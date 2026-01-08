import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";

const CLI_PATH = path.resolve(__dirname, "../../dist/cli/index.cjs");

function runCli(args: string[], input?: string) {
  const result = spawnSync("node", [CLI_PATH, ...args], {
    input,
    encoding: "utf8",
  });

  return {
    stdout: (result.stdout ?? "").replace(/\r\n/g, "\n"),
    stderr: (result.stderr ?? "").replace(/\r\n/g, "\n"),
    status: result.status,
  };
}

describe("CLI output contracts", () => {
  it("writes JSON output with a trailing newline", () => {
    const { stdout, stderr, status } = runCli(["scan", "--json"], "password=secret123\n");

    expect(status).toBe(0);
    expect(stderr).toBe("");
    expect(stdout.endsWith("\n")).toBe(true);

    // Must still be valid JSON (newline trimmed).
    const parsed = JSON.parse(stdout.trim());
    expect(typeof parsed.output).toBe("string");
    expect(Array.isArray(parsed.matches)).toBe(true);
  });

  it("usage/flag errors are written to STDERR and exit with code 2", () => {
    const { stdout, stderr, status } = runCli(["scan", "--dry-run", "--json"], "");

    expect(status).toBe(2);
    expect(stdout).toBe("");
    expect(stderr).toContain("--dry-run cannot be used with --json");
  });
});
