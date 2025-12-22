import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";

describe("LogShield CLI --help (SNAPSHOT)", () => {
  it("shows help output", () => {
    const output = execSync("node dist/cli/index.cjs --help", {
      encoding: "utf8",
    });

    expect(output).toMatchSnapshot();
  });

  it("shows help output with -h", () => {
    const output = execSync("node dist/cli/index.cjs -h", {
      encoding: "utf8",
    });

    expect(output).toMatchSnapshot();
  });
});
