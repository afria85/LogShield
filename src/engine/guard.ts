export const MAX_INPUT_SIZE = 200 * 1024; // 200KB
export const MAX_LINE_LENGTH = 64 * 1024; // 64KB

export function guardInput(input: string): string {
  if (!input) return "";

  if (Buffer.byteLength(input, "utf8") > MAX_INPUT_SIZE) {
    throw new Error("Log size exceeds 200KB limit");
  }

  const lines = input.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    if (Buffer.byteLength(lines[i], "utf8") > MAX_LINE_LENGTH) {
      const lineNumber = i + 1;
      throw new Error(`Log line ${lineNumber} exceeds 64KB limit`);
    }
  }

  return input;
}
