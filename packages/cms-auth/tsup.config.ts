import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "next",
    "next-auth",
    "react",
    "@prisma/client",
    "@cms-template/core",
    "zod",
    "bcryptjs",
  ],
  tsconfig: "./tsconfig.json",
});
