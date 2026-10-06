import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true, // "@/*" alias from tsconfig.json
  },
  test: {
    // Pure functions only for now; switch to "jsdom" + React Testing Library
    // when component tests arrive (stage 3)
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
