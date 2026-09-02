import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([

  // Don't check the build folder
  globalIgnores(["dist"]),

  {
    // Check JavaScript and JSX files
    files: ["**/*.{js,jsx}"],

    // Use recommended ESLint rules
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],

    // JavaScript settings
    languageOptions: {

      ecmaVersion: 2020,

      // Browser variables are available
      globals: globals.browser,

      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true
        },
        sourceType: "module"
      }
    },

    // Project-specific rules
    rules: {

      // Report unused variables
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]"
        }
      ]

    }
  }

]);