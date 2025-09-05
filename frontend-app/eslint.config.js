// eslint.config.js (ESLint flat config)
import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import globals from "globals";

export default [
  // Ignora artefactos de build y reportes
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.vite/**",
      "**/playwright-report/**",
      "source/playwright/**"
    ],
  },

  // Reglas base JS + Vue
  js.configs.recommended,
  ...vue.configs["flat/recommended"],

  // ✅ Globales de navegador para TODO el código de app (js,ts,vue)
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      // Para .vue, el parser lo pone el config de Vue; para .js usa espree (default)
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...globals.browser, // window, document, etc.
        fetch: true,
        URL: true,
        Blob: true,
        File: true,
        FormData: true,
        atob: true,
        localStorage: true,
        setTimeout: true,
        clearTimeout: true,
        console: true,
        alert: true,
        confirm: true,
      },
    },
  },

  // Parser para SFC de Vue y reglas de estilo específicas
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: { vue },
    rules: {
      // Tus reglas + pequeños ajustes para bajar ruido en CI
      "vue/no-unused-vars": "warn",
      "vue/no-mutating-props": "warn",
      "vue/no-unused-components": "warn",
      "vue/no-template-shadow": "warn",
      "vue/require-v-for-key": "error",
      "vue/require-valid-default-prop": "warn",

      // Estilo (ajústalas a tu gusto)
      "vue/attribute-hyphenation": ["error", "never"],
      "vue/html-self-closing": ["error", {
        html: { void: "always", normal: "never", component: "always" },
      }],
      "vue/max-attributes-per-line": ["warn", {
        singleline: 3,
        multiline: { max: 1, allowFirstLine: true },
      }],
      "vue/html-indent": ["warn", 2],
      "vue/singleline-html-element-content-newline": "off",
    },
  },

  // Archivos de Node/configuración (vite, scripts, etc.)
  {
    files: [
      "**/*.config.*",
      "vite.config.*",
      "scripts/**",
      ".eslintrc.*",
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
];
