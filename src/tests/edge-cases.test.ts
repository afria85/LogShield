import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { sanitizeLog } from "./sanitizeLog";

const CLI_PATH = path.resolve(__dirname, "../../dist/cli/index.cjs");

describe("operator edge-case coverage", () => {
  it("preserves unicode log text while redacting unicode secret values", () => {
    const input = 'level=info message="olá 東京" password="päss word"';

    const result = sanitizeLog(input);

    expect(result.output).toBe(
      'level=info message="olá 東京" password="<REDACTED_PASSWORD>"'
    );
    expect(result.matches).toEqual([{ rule: "PASSWORD" }]);
  });

  it("handles malformed UTF-8 stdin best-effort without dropping later detections", () => {
    const input = Buffer.concat([
      Buffer.from("status=olá\npassword=", "utf8"),
      Buffer.from([0xff, 0xfe, 0xfd]),
      Buffer.from("\napi_key=abcdef1234567890abcdef\n", "utf8"),
    ]);

    const result = spawnSync("node", [CLI_PATH, "scan"], {
      input,
    });

    const stdout = result.stdout.toString("utf8").replace(/\r\n/g, "\n");
    const stderr = result.stderr.toString("utf8").replace(/\r\n/g, "\n");

    expect(result.status).toBe(0);
    expect(stderr).toBe("");
    expect(stdout).toBe(
      "status=olá\n" +
      "password=<REDACTED_PASSWORD>\n" +
      "api_key=<REDACTED_API_KEY>\n"
    );
  });

  it("redacts complete multi-line private key blocks before nested rules run", () => {
    const input = [
      "before",
      "-----BEGIN PRIVATE KEY-----",
      "password=should-not-leak",
      "abcdef123456",
      "-----END PRIVATE KEY-----",
      "after",
    ].join("\n");

    const result = sanitizeLog(input);

    expect(result.output).toBe(
      ["before", "<REDACTED_PRIVATE_KEY_BLOCK>", "after"].join("\n")
    );
    expect(result.output).not.toContain("should-not-leak");
    expect(result.matches).toEqual([{ rule: "PRIVATE_KEY_BLOCK" }]);
  });
});
