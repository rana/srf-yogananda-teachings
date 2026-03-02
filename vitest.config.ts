/**
 * Vitest configuration — M2a-21.
 *
 * Uses jsdom for React component testing.
 * Path aliases match tsconfig.
 */

import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["lib/**", "app/**"],
      exclude: ["**/*.test.*", "**/node_modules/**"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
