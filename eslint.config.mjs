import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Tasarım taslağı (referans) ve yardımcı script'ler proje kodu değil
    "taslak/**",
    "scripts/**",
    "tests/**",
  ]),
]);

export default eslintConfig;
