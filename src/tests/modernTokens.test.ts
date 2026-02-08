import { describe, it, expect } from "vitest";
import { sanitizeLog } from "./sanitizeLog";

describe("LogShield sanitizeLog (modern tokens)", () => {
  it("redacts GitHub classic tokens (ghp_/gho_/ghu_/ghs_/ghr_)", () => {
    const token = `ghp_${"A".repeat(36)}`;
    const result = sanitizeLog(token);

    expect(result.output).toBe("<REDACTED_GITHUB_TOKEN>");
    expect(result.matches.map((m) => m.rule)).toEqual(["GITHUB_TOKEN"]);
  });

  it("redacts GitHub fine-grained tokens (github_pat_...)", () => {
    const token = `github_pat_${"A".repeat(22)}_${"B".repeat(59)}`;
    const result = sanitizeLog(token);

    expect(result.output).toBe("<REDACTED_GITHUB_TOKEN>");
    expect(result.matches.map((m) => m.rule)).toEqual([
      "GITHUB_FINE_GRAINED_TOKEN",
    ]);
  });

  it("redacts Slack tokens (xox*)", () => {
    const token = "xoxb-1234567890-1234567890-abcdefghijklmnopqrst";
    const result = sanitizeLog(token);

    expect(result.output).toBe("<REDACTED_SLACK_TOKEN>");
    expect(result.matches.map((m) => m.rule)).toEqual(["SLACK_TOKEN"]);
  });

  it("redacts Slack app tokens (xapp-...)", () => {
    const token = `xapp-1-${"A".repeat(20)}`;
    const result = sanitizeLog(token);

    expect(result.output).toBe("<REDACTED_SLACK_TOKEN>");
    expect(result.matches.map((m) => m.rule)).toEqual(["SLACK_APP_TOKEN"]);
  });


  it("redacts Slack app tokens with multiple segments (xapp-...-...)", () => {
    const token = `xapp-1-${"A".repeat(20)}-${"B".repeat(20)}`;
    const result = sanitizeLog(token);

    expect(result.output).toBe("<REDACTED_SLACK_TOKEN>");
    expect(result.matches.map((m) => m.rule)).toEqual(["SLACK_APP_TOKEN"]);
  });

  it("redacts npm access tokens (npm_...)", () => {
    const token = `npm_${"a".repeat(36)}`;
    const result = sanitizeLog(token);

    expect(result.output).toBe("<REDACTED_NPM_TOKEN>");
    expect(result.matches.map((m) => m.rule)).toEqual(["NPM_TOKEN"]);
  });


  it("redacts npmrc auth tokens (:_authToken=...)", () => {
    const token = `${"a".repeat(40)}`;
    const input = `//registry.npmjs.org/:_authToken=${token}`;
    const result = sanitizeLog(input);

    expect(result.output).toBe(
      "//registry.npmjs.org/:_authToken=<REDACTED_NPM_TOKEN>"
    );
    expect(result.matches.map((m) => m.rule)).toEqual(["NPMRC_AUTH_TOKEN"]);
  });

  it("redacts npmrc auth tokens with whitespace (:_authToken = ...)", () => {
    const token = `${"a".repeat(40)}`;
    const input = `:_authToken = ${token}`;
    const result = sanitizeLog(input);

    expect(result.output).toBe(":_authToken = <REDACTED_NPM_TOKEN>");
    expect(result.matches.map((m) => m.rule)).toEqual(["NPMRC_AUTH_TOKEN"]);
  });

  it("redacts PyPI API tokens (pypi-...)", () => {
    const token = `pypi-${"a".repeat(85)}`;
    const result = sanitizeLog(token);

    expect(result.output).toBe("<REDACTED_PYPI_TOKEN>");
    expect(result.matches.map((m) => m.rule)).toEqual(["PYPI_TOKEN"]);
  });

  it("redacts SendGrid API keys (SG.<...>.<...>)", () => {
    const token = `SG.${"a".repeat(22)}.${"b".repeat(43)}`;
    const result = sanitizeLog(token);

    expect(result.output).toBe("<REDACTED_SENDGRID_KEY>");
    expect(result.matches.map((m) => m.rule)).toEqual(["SENDGRID_API_KEY"]);
  });

  it("redacts PEM private key blocks", () => {
    const input = [
      "-----BEGIN RSA PRIVATE KEY-----",
      "MIIBOgIBAAJBAK3n",
      "-----END RSA PRIVATE KEY-----",
    ].join("\n");

    const result = sanitizeLog(input);

    expect(result.output).toBe("<REDACTED_PRIVATE_KEY_BLOCK>");
    expect(result.matches.map((m) => m.rule)).toEqual(["PRIVATE_KEY_BLOCK"]);
  });

  it("redacts ENCRYPTED PRIVATE KEY blocks", () => {
    const input = [
      "-----BEGIN ENCRYPTED PRIVATE KEY-----",
      "MIIFHjBABgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQIW1m1",
      "-----END ENCRYPTED PRIVATE KEY-----",
    ].join("\n");

    const result = sanitizeLog(input);

    expect(result.output).toBe("<REDACTED_PRIVATE_KEY_BLOCK>");
    expect(result.matches.map((m) => m.rule)).toEqual(["PRIVATE_KEY_BLOCK"]);
  });

  it("redacts dangling ENCRYPTED PRIVATE KEY headers (no END line)", () => {
    const input = "-----BEGIN ENCRYPTED PRIVATE KEY-----";
    const result = sanitizeLog(input);

    expect(result.output).toBe("<REDACTED_PRIVATE_KEY_HEADER>");
    expect(result.matches.map((m) => m.rule)).toEqual(["PRIVATE_KEY_HEADER"]);
  });
  it("redacts OpenSSH private key blocks", () => {
    const input = [
      "-----BEGIN OPENSSH PRIVATE KEY-----",
      "b3BlbnNzaC1rZXktdjEAAAAA",
      "-----END OPENSSH PRIVATE KEY-----",
    ].join("\n");

    const result = sanitizeLog(input);

    expect(result.output).toBe("<REDACTED_PRIVATE_KEY_BLOCK>");
    expect(result.matches.map((m) => m.rule)).toEqual([
      "OPENSSH_PRIVATE_KEY_BLOCK",
    ]);
  });

  it("redacts dangling private key headers (no END line)", () => {
    const input = "-----BEGIN PRIVATE KEY-----";
    const result = sanitizeLog(input);

    expect(result.output).toBe("<REDACTED_PRIVATE_KEY_HEADER>");
    expect(result.matches.map((m) => m.rule)).toEqual(["PRIVATE_KEY_HEADER"]);
  });

  it("does not redact lookalikes that fail length constraints", () => {
    const input = [
      `ghp_${"A".repeat(10)}`,
      `npm_${"a".repeat(10)}`,
      `pypi-${"a".repeat(40)}`,
      `SG.${"a".repeat(10)}.${"b".repeat(10)}`,
      "xoxb-short",
    ].join("\n");

    const result = sanitizeLog(input);

    expect(result.output).toBe(input);
    expect(result.matches.length).toBe(0);
  });
});
