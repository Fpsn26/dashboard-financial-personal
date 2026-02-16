import { defineConfig } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "build/**"],
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["recommended"].rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  ...tseslint.configs.recommended,
);
