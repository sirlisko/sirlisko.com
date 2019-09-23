module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {}
};

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:jest/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  settings: {
    react: {
      version: "16.0"
    }
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    },
    sourceType: "module"
  },
  plugins: ["react"],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: "babel-eslint"
};
