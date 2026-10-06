import { describe, expect, it } from "vitest";
import { isUrgent } from "./isUrgent";
import { makeBook } from "./makeBook.fixture";

describe("isUrgent", () => {
  it("is true for an urgent book", () => {
    expect(isUrgent(makeBook({ urgent: true }))).toBe(true);
  });

  it("is false for a book that is only awaiting a decision", () => {
    expect(isUrgent(makeBook({ awaiting: true }))).toBe(false);
  });

  it("is true for a book that is both urgent and awaiting", () => {
    expect(isUrgent(makeBook({ urgent: true, awaiting: true }))).toBe(true);
  });

  it("is false for a book without flags", () => {
    expect(isUrgent(makeBook())).toBe(false);
  });
});
