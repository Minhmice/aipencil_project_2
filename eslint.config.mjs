import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = {
  extends: [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
  ],
  rules: {
    // Thêm các quy tắc khác nếu cần
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
};

export default eslintConfig;
