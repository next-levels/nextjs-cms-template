import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"], // CommonJS für bessere CLI Kompatibilität
  dts: false,
  sourcemap: false,
  clean: true,
  shims: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  tsconfig: "./tsconfig.json",
});
