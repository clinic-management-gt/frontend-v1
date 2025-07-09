module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    'vue/html-indent': ['error', 2],
    'indent': ['error', 2],
    'no-trailing-spaces': 'error',
    'vue/max-attributes-per-line': 'off'
    // añade aquí tus normas específicas
  }
}
