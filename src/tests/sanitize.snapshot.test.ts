import { describe, it, expect } from "vitest";
import { sanitizeLog } from "../core/sanitize";

describe("LogShield sanitizeLog ? SNAPSHOT", () => {
  it("default mode snapshot", () => {
    const input = `
token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.TEST.TEST
password=supersecret
aws_key=AKIA1234567890TEST
cc=4242424242424242
`;

    const result = sanitizeLog(input);
    expect(result.output).toMatchSnapshot();
    expect(result.matches).toMatchSnapshot();
  });

  it("strict mode snapshot", () => {
    const input = `
sk_test_1234567890abcdefghijklmnopqrstuvwxyz
AKIA1234567890TEST
4242424242424242
`;

    const result = sanitizeLog(input, { strict: true });
    expect(result.output).toMatchSnapshot();
    expect(result.matches).toMatchSnapshot();
  });
});
