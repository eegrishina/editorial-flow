import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins class names and skips falsy values", () => {
    expect(cn("px-4", false && "hidden", undefined, "text-ink")).toBe("px-4 text-ink");
  });

  it("lets a later Tailwind class override a conflicting earlier one", () => {
    expect(cn("px-2 text-ink-50", "px-4")).toBe("text-ink-50 px-4");
  });

  it("accepts conditional objects", () => {
    expect(cn({ "text-accent": true, "text-ink": false })).toBe("text-accent");
  });
});
