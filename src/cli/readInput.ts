import fs from "node:fs";

type ReadableLike = {
  isTTY?: boolean;
  setEncoding?: (encoding: BufferEncoding) => void;
  on(event: "data", listener: (chunk: string) => void): void;
  on(event: "end", listener: () => void): void;
  on(event: "error", listener: (err: unknown) => void): void;
};

export async function readInput(
  file?: string,
  opts?: { forceStdin?: boolean; stdin?: ReadableLike }
): Promise<string> {
  if (file) {
    if (!fs.existsSync(file)) {
      throw new Error(`File not found: ${file}`);
    }
    return fs.readFileSync(file, "utf8");
  }

  const stdin = (opts?.stdin ?? process.stdin) as ReadableLike;
  const forceStdin = Boolean(opts?.forceStdin);

  if (!stdin.isTTY || forceStdin) {
    return new Promise((resolve, reject) => {
      let data = "";

      stdin.setEncoding?.("utf8");

      stdin.on("data", (chunk) => {
        data += chunk;
      });

      stdin.on("end", () => resolve(data));
      stdin.on("error", reject);
    });
  }

  throw new Error("No input provided");
}
