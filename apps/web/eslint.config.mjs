import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const eslintConfig = [
  {
    plugins: {
      "@next/next": (await import("eslint-config-next/core-web-vitals.js")).default,
    },
    rules: {
      ...(await import("eslint-config-next/core-web-vitals.js")).default.rules,
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
