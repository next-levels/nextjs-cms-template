import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: false,
  target: "es2020",
  external: [
    "react",
    "react-dom",
    "next",
    "next-auth",
    "@prisma/client",
    "@mikestraczek/cms-core",
    "zod",
    "bcryptjs",
  ],
  tsconfig: "./tsconfig.json",
  minify: false,
  esbuildOptions(options) {
    options.banner = {
      js: '"use strict";',
    };
  },
});
