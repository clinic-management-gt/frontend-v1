import vue from "eslint-plugin-vue";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: require.resolve("vue-eslint-parser"),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        parser: "@babel/eslint-parser",
      },
    },
    plugins: { vue },
    rules: {
      ...vue.configs["vue3-essential"].rules,
      ...vue.configs["vue3-strongly-recommended"].rules,
      ...vue.configs["vue3-recommended"].rules,
    },
  },
];
