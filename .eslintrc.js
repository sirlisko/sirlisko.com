module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
  ],
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["@typescript-eslint", "react"],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
