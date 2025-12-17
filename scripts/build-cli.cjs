#!/usr/bin/env node
"use strict";

const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

/**
 * Load package.json ONCE
 * Version akan di-inject ke CLI saat build
 */
const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

const outDir = path.resolve(__dirname, "../dist/cli");

/**
 * Clean output dir
 */
fs.rmSync(outDir, { recursive: true, force: true });

/**
 * Build CLI
 */
esbuild.buildSync({
  entryPoints: [path.resolve(__dirname, "../src/cli/index.ts")],
  outfile: path.join(outDir, "index.cjs"),
  platform: "node",
  target: "node18",
  format: "cjs",
  bundle: true,
  sourcemap: false,
  banner: {
    js: "#!/usr/bin/env node",
  },
  define: {
    __LOGSHIELD_VERSION__: JSON.stringify(pkg.version),
  },
  logLevel: "info",
});

console.log(`CLI build complete (v${pkg.version})`);
