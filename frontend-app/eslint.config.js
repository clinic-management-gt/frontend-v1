import vue from "eslint-plugin-vue";
import js from "@eslint/js";
import vueParser from "vue-eslint-parser";
import babelParser from "@babel/eslint-parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        parser: babelParser,
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
