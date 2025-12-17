import fs from "node:fs";

export async function readInput(file?: string): Promise<string> {
  if (file) {
    if (!fs.existsSync(file)) {
      throw new Error(`File not found: ${file}`);
    }
    return fs.readFileSync(file, "utf8");
  }

  if (!process.stdin.isTTY) {
    return new Promise((resolve, reject) => {
      let data = "";

      process.stdin.setEncoding("utf8");

      process.stdin.on("data", chunk => {
        data += chunk;
      });

      process.stdin.on("end", () => resolve(data));
      process.stdin.on("error", reject);
    });
  }

  throw new Error("No input provided");
}
