// eslint.config.js
import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
  {
    ignores: [
      "**/node_modules/**","**/dist/**","**/build/**","**/coverage/**",
      "**/.vite/**","**/playwright-report/**","source/playwright/**"
    ],
  },

  js.configs.recommended,
  ...vue.configs["flat/recommended"],

  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
      globals: {
        window: true, document: true, console: true,
        fetch: true, URL: true, Blob: true, File: true, FormData: true, atob: true, btoa: true,
        localStorage: true, setTimeout: true, clearTimeout: true,
        alert: true, confirm: true,
      },
    },
  },

  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    plugins: { vue },
    rules: {
      "vue/no-unused-vars": "warn",
      "vue/no-mutating-props": "warn",
      "vue/no-unused-components": "warn",
      "vue/no-template-shadow": "warn",
      "vue/require-v-for-key": "error",
      "vue/require-valid-default-prop": "warn",
      "vue/attribute-hyphenation": ["error", "never"],
      "vue/html-self-closing": ["error", { html: { void: "always", normal: "never", component: "always" } }],
      // 👇 cambio aquí
      "vue/max-attributes-per-line": ["warn", { singleline: 3, multiline: 1 }],
      "vue/html-indent": ["warn", 2],
      "vue/singleline-html-element-content-newline": "off",
    },
  },

  {
    files: ["**/*.config.*","vite.config.*","scripts/**",".eslintrc.*"],
    languageOptions: {
      globals: { module: true, require: true, __dirname: true, process: true }
    },
  },
];
