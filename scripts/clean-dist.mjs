#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "dist");

try {
  fs.rmSync(distDir, { recursive: true, force: true });
  process.stdout.write("Cleaned dist/\n");
} catch (err) {
  process.stderr.write(`Failed to clean dist/: ${err?.message ?? err}\n`);
  process.exit(1);
}
