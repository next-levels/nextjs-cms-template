import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
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
});
