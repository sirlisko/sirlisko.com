module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:astro/recommended",
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
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/triple-slash-reference": "off",
  },
};
