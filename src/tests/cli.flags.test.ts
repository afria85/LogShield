import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { MAX_INPUT_SIZE, MAX_LINE_LENGTH } from "../engine/guard";

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

describe("CLI flag validation", () => {
  it("rejects unknown flags with exit code 2", () => {
    const { stdout, stderr, status } = runCli(
      ["scan", "--nope"],
      "password=secret123\n"
    );

    expect(status).toBe(2);
    expect(stdout).toBe("");
    expect(stderr).toContain("Unknown flag: --nope");
  });

  it("rejects an overlong line with exit code 2 and a deterministic error", () => {
    const { stdout, stderr, status } = runCli(
      ["scan"],
      `${"A".repeat(MAX_LINE_LENGTH + 1)}\n`
    );

    expect(status).toBe(2);
    expect(stdout).toBe("");
    expect(stderr).toBe("Log line 1 exceeds 64KB limit\n");
  });

  it("reads a file argument when child stdin is non-TTY", () => {
    const file = path.join(os.tmpdir(), `logshield-file-${process.pid}.log`);
    fs.writeFileSync(file, "password=supersecret123\n", "utf8");

    try {
      const { stdout, stderr, status } = runCli(["scan", file]);

      expect(status).toBe(0);
      expect(stdout).toBe("password=<REDACTED_PASSWORD>\n");
      expect(stderr).toBe("");
    } finally {
      fs.rmSync(file, { force: true });
    }
  });

  it("rejects explicit --stdin plus file with exit code 2", () => {
    const file = path.join(os.tmpdir(), `logshield-stdin-file-${process.pid}.log`);
    fs.writeFileSync(file, "password=supersecret123\n", "utf8");

    try {
      const { stdout, stderr, status } = runCli(
        ["scan", "--stdin", file],
        "password=from-stdin\n"
      );

      expect(status).toBe(2);
      expect(stdout).toBe("");
      expect(stderr).toBe("Cannot read from both STDIN and file\n");
    } finally {
      fs.rmSync(file, { force: true });
    }
  });

  it("rejects a UTF-8 line over 64KB by bytes", () => {
    const input = `${"€".repeat(21845)}AA`;
    const { stdout, stderr, status } = runCli(["scan"], input);

    expect(status).toBe(2);
    expect(stdout).toBe("");
    expect(stderr).toBe("Log line 1 exceeds 64KB limit\n");
  });

  it("rejects UTF-8 total input over 200KB by bytes", () => {
    const inputAtByteLimit = [
      ...Array.from({ length: 68 }, () => "€".repeat(1000)),
      "€".repeat(244),
    ].join("\n");
    const input = `${inputAtByteLimit}A`;

    expect(Buffer.byteLength(input, "utf8")).toBe(MAX_INPUT_SIZE + 1);

    const { stdout, stderr, status } = runCli(["scan"], input);

    expect(status).toBe(2);
    expect(stdout).toBe("");
    expect(stderr).toBe("Log size exceeds 200KB limit\n");
  });
});
