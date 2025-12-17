const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["src/cli/index.ts"],
  outfile: "dist/cli/index.cjs",
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  sourcemap: false,
  banner: {
    js: "#!/usr/bin/env node"
  }
}).then(() => {
  console.log("CLI build complete");
}).catch(() => process.exit(1));
