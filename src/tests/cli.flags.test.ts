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
});
