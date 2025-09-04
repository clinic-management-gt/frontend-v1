import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
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
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        window: true,
        document: true,
        console: true,
        fetch: true,
        alert: true,
        confirm: true,
        localStorage: true,
        setTimeout: true,
        clearTimeout: true,
        URL: true,
        atob: true,
        File: true,
        Blob: true,
      },
    },
    plugins: { vue },
    rules: {
      // Reglas recomendadas para Vue 3 según eslint-plugin-vue v10
      "vue/no-unused-vars": "warn",
      "vue/no-mutating-props": "warn",
      "vue/no-unused-components": "warn",
      "vue/no-template-shadow": "warn",
      "vue/require-v-for-key": "error",
      "vue/require-valid-default-prop": "warn",
      "vue/attribute-hyphenation": ["error", "never"],
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "never",
            component: "always",
          },
        },
      ],
    },
  },
];
