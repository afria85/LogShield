import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";

const CLI_PATH = path.resolve(
  __dirname,
  "../../dist/cli/index.cjs"
);

function runDryRun(
  input: string,
  extraArgs: string[] = []
) {
  const result = spawnSync(
    "node",
    [CLI_PATH, "scan", "--dry-run", ...extraArgs],
    {
      input,
      encoding: "utf8",
    }
  );

  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    status: result.status,
  };
}

describe("LogShield CLI --dry-run (SNAPSHOT)", () => {
  it("default mode dry-run preview", () => {
    const input = `
password=secret123
api_key=sk_live_xxx
`;

    const { stdout, stderr, status } = runDryRun(input);

    expect(stderr).toBe("");
    expect(status).toBe(0);
    expect(stdout).toMatchSnapshot();
  });

  it("strict mode dry-run preview", () => {
    const input = `
AKIA1234567890TEST1234
4111 1111 1111 1111
`;

    const { stdout, stderr, status } = runDryRun(input, ["--strict"]);

    expect(stderr).toBe("");
    expect(status).toBe(0);
    expect(stdout).toMatchSnapshot();
  });

  it("dry-run with --fail-on-detect exits 1", () => {
    const input = `password=secret123`;

    const { status } = runDryRun(input, ["--fail-on-detect"]);

    expect(status).toBe(1);
  });
});
