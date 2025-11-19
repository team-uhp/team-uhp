import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";


export default [
  {
    // Global ignores
    ignores: ["alwaysIgnoredDir/", "src/**/*.generated.js"],
  },
  js.configs.recommended,
  // ... other configs
];