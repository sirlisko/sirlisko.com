// @ts-check

import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  ...tseslint.config(
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
      ignores: ["**/dist/**", "**/node_modules/**"],
    },
    prettier,
  ),
  ...eslintPluginAstro.configs.recommended,
];
