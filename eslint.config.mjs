import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "coverage/**",
    ],
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    extends: [...tseslint.configs.recommended],
  },
  {
    files: ["**/*.{jsx,tsx}"],
    extends: [pluginReact.configs.flat.recommended],
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  { 
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
    rules: {
      "markdown/fenced-code-language": "off",
      "markdown/heading-increment": "off",
    },
  },
  { 
    files: ["**/*.css"], 
    plugins: { css }, 
    language: "css/css", 
    extends: ["css/recommended"],
    rules: {
      "css/no-invalid-properties": "off",
      "css/use-baseline": "off",
      "css/no-important": "off",
    }
  },
]);

