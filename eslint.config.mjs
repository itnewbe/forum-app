// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import airbnbConfig from "eslint-config-airbnb";
import parserBabel from "@babel/eslint-parser";
import cypressPlugin from "eslint-plugin-cypress";

export default [{
  files: ["**/*.{js,jsx}"],
  languageOptions: {
    parser: parserBabel,
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        presets: ["@babel/preset-react"],
      },
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
    },
    globals: globals.browser,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
    import: importPlugin,
    "jsx-a11y": jsxA11yPlugin,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
    ...airbnbConfig.rules,
  },
}, {
  files: [
    "**/*.test.js",
    "**/*.test.jsx",
    "**/*.spec.js",
    "**/*.spec.jsx",
    "**/*.cy.js",
    "**/*.cy.jsx",
  ],
  languageOptions: {
    parser: parserBabel,
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        presets: ["@babel/preset-react"],
      },
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
    },
    globals: {
      ...globals.browser,
      ...globals.jest,
      ...globals.cypress,
    },
  },
  plugins: {
    cypress: cypressPlugin,
  },
  rules: {
    ...cypressPlugin.configs.recommended.rules,
  },
}, {
  ignores: ["node_modules/**", "dist/**"],
}, ...storybook.configs["flat/recommended"]];
