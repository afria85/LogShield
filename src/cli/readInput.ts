import fs from "fs";

export function readInput(file?: string): Promise<string> {
  if (file) {
    if (!fs.existsSync(file)) {
      throw new Error(`File not found: ${file}`);
    }
    return Promise.resolve(fs.readFileSync(file, "utf8"));
  }

  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}
