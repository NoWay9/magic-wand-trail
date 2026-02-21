import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["dist/*", "node_modules/*", "vite.config.js"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    plugins: { vitest },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": "off",
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
];
