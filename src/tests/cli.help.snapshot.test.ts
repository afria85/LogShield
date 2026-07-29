import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

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

  it("prints the package version", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../../package.json"), "utf8")
    );
    const output = execSync("node dist/cli/index.cjs --version", {
      encoding: "utf8",
    });

    expect(output).toBe(`logshield v${pkg.version}\n`);
  });
});
