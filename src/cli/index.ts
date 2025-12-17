#!/usr/bin/env node
"use strict";

/**
 * NOTE:
 * Versi CLI DI-INJECT saat build via esbuild:
 * define: { __LOGSHIELD_VERSION__: JSON.stringify(pkg.version) }
 */
declare const __LOGSHIELD_VERSION__: string;

const { readInput } = require("./readInput");
const { writeOutput } = require("./writeOutput");
const { printSummary } = require("./summary");
const { sanitizeLog } = require("../engine/sanitizeLog");

const args = process.argv.slice(2);

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

function getVersion(): string {
  return typeof __LOGSHIELD_VERSION__ === "string"
    ? __LOGSHIELD_VERSION__
    : "unknown";
}

function getFileArg(): string | undefined {
  const file = args[1];
  if (!file || file.startsWith("--")) return undefined;
  return file;
}

async function main() {
  if (hasFlag("--help") || args.length === 0) {
    process.stdout.write(`Usage: logshield scan [file]

Options:
  --strict     Aggressive redaction
  --json       JSON output
  --summary    Print summary
  --version    Print version
  --help       Show help
`);
    process.exit(0);
  }

  if (hasFlag("--version")) {
    console.log(`logshield v${getVersion()}`);
    process.exit(0);
  }

  const command = args[0];
  if (command !== "scan") {
    process.stderr.write("Unknown command\n");
    process.exit(1);
  }

  const strict = hasFlag("--strict");
  const json = hasFlag("--json");
  const summary = hasFlag("--summary");
  const file = getFileArg();

  try {
    const input = await readInput(file);
    const result = sanitizeLog(input, { strict });
    writeOutput(result, { json });

    if (summary) {
      printSummary(result.matches);
    }
  } catch (err: any) {
    process.stderr.write(err?.message || "Unexpected error");
    process.stderr.write("\n");
    process.exit(2);
  }
}

main();
