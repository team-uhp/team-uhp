import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import markdown from "@eslint/markdown";
import css from "@eslint/css";

export default [
  // Global ignores
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
  // Base JS recommended rules
  js.configs.recommended,
  // TypeScript recommended rules (expands to multiple config objects)
  ...tseslint.configs.recommended,
  // React + TS/JS handling
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    plugins: {
      react: pluginReact,
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React rules (adjust as needed; jsx-uses-react unnecessary in React 17+)
      "react/jsx-uses-vars": "error",
      "react/jsx-no-undef": "error",
      "react/self-closing-comp": "warn",
      "react/boolean-prop-naming": [
        "warn",
        {
          rule: "^(is|has)[A-Z]([A-Za-z0-9]?)+",
          message: "Boolean prop names must start with 'is' or 'has'"
        }
      ],
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-shadow": "error",
        // Allow both interface and type aliases
        "@typescript-eslint/consistent-type-definitions": "off",
    },
  },
  // Markdown files
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    rules: {
      // Disable some stylistic markdown rules if not desired
      "markdown/heading-increment": "off",
      "markdown/fenced-code-language": "off",
      // Disable core JS rules that don't apply cleanly to markdown content
      "no-irregular-whitespace": "off",
      "no-trailing-spaces": "off",
      "eol-last": "off",
      "no-multiple-empty-lines": "off",
    }
  },
  // CSS files
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    rules: {
      // Example: relax some css rules
      "css/no-invalid-properties": "off",
      "css/no-important": "off",
      // Disable whitespace-related JS core rules for CSS parsing
      "no-irregular-whitespace": "off",
      "no-trailing-spaces": "off",
      "eol-last": "off",
      "no-multiple-empty-lines": "off",
    }
  },
];
