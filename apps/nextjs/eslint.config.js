import baseConfig, { restrictEnvAccess } from "@oyo/eslint-config/base";
import nextjsConfig from "@oyo/eslint-config/nextjs";
import reactConfig from "@oyo/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
