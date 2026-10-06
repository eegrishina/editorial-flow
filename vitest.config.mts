import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true, // "@/*" alias from tsconfig.json
  },
  test: {
    environment: "jsdom", // browser-like DOM for component tests
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
