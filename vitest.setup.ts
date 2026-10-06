import "@testing-library/jest-dom/vitest"; // toBeInTheDocument, toHaveClass, …
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only auto-cleans with Vitest globals; we import explicitly instead
afterEach(() => {
  cleanup();
});
