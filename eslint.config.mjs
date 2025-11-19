import js from "@eslint/js";

export default [
  {
    // Global ignores
    ignores: ["alwaysIgnoredDir/", "src/**/*.generated.js"],
  },
  js.configs.recommended,
  // ... other configs
];