const MAX_SIZE = 200 * 1024; // 200KB

export function guardInput(input: string): string {
  if (!input) return "";

  if (input.length > MAX_SIZE) {
    throw new Error("Log size exceeds 200KB limit");
  }

  return input;
}
