import { describe, expect, it } from "vitest";
import { formatWords } from "./formatWords";

describe("formatWords", () => {
  it.each([
    [999, "999"],
    [1000, "1k"],
    [64000, "64k"],
    [92400, "92.4k"],
    [134700, "134.7k"],
  ])("formats %i as %s", (count, expected) => {
    expect(formatWords(count)).toBe(expected);
  });
});
