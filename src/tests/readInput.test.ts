import { describe, expect, it } from "vitest";
import { Readable } from "node:stream";
import { readInput } from "../cli/readInput";

function makeStdin(data: string, isTTY: boolean) {
  const stream = new Readable({
    read() {
      // no-op
    },
  });
  (stream as any).isTTY = isTTY;
  stream.push(data);
  stream.push(null);
  return stream as NodeJS.ReadableStream;
}

describe("readInput --stdin override", () => {
  it("reads from stdin when forceStdin is true even if TTY", async () => {
    const stdin = makeStdin("hello\n", true);
    const result = await readInput(undefined, { forceStdin: true, stdin });
    expect(result).toBe("hello\n");
  });

  it("throws when stdin is TTY and forceStdin is false", async () => {
    const stdin = makeStdin("ignored\n", true);
    await expect(
      readInput(undefined, { forceStdin: false, stdin })
    ).rejects.toThrow("No input provided");
  });
});
