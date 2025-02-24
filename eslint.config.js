import { createRequire } from "module";
const require = createRequire(import.meta.url);
const tsPlugin = require("@typescript-eslint/eslint-plugin");

export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
  }
];
