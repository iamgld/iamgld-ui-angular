import js from "@eslint/js";
import angular from "angular-eslint";
import globals from "globals";

const tsConfigs = [js.configs.recommended, ...angular.configs.tsRecommended].map(
  (config) => ({
    ...config,
    files: ["**/*.ts"],
  }),
);

const htmlConfigs = [
  ...angular.configs.templateRecommended,
  ...angular.configs.templateAccessibility,
].map((config) => ({
  ...config,
  files: ["**/*.html"],
}));

export default [
  {
    ignores: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.spec.js"],
  },
  ...tsConfigs,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  ...htmlConfigs,
];
