import { describe, expect, it } from "vitest";
import { isUrgent } from "./isUrgent";
import { makeBook } from "./makeBook.fixture";

describe("isUrgent", () => {
  it("is true for an urgent book", () => {
    expect(isUrgent(makeBook({ flag: "urgent" }))).toBe(true);
  });

  it("is false for a book in review", () => {
    expect(isUrgent(makeBook({ flag: "review" }))).toBe(false);
  });

  it("is false for a book without a flag", () => {
    expect(isUrgent(makeBook())).toBe(false);
  });
});
