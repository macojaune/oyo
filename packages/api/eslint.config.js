import baseConfig from "@oyo/eslint-config/base"

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
]
