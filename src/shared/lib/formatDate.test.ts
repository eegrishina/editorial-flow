import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it.each([
    ["2026-06-02", "Jun 02"],
    ["2026-01-22", "Jan 22"],
    ["2025-12-18", "Dec 18"],
  ])("formats %s as %s", (iso, expected) => {
    expect(formatDate(iso)).toBe(expected);
  });
});
