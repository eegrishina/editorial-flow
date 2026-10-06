import { describe, expect, it } from "vitest";
import { STAGE_IDS } from "@/entities/stage";
import { groupByStage } from "./groupByStage";
import { makeBook } from "./makeBook.fixture";

const ids = (books: { id: string }[]) => books.map((book) => book.id);

describe("groupByStage", () => {
  it("returns every stage in board order, including empty ones", () => {
    const groups = groupByStage([]);

    expect(Object.keys(groups)).toEqual([...STAGE_IDS]);
    expect(Object.values(groups).every((column) => column.length === 0)).toBe(true);
  });

  it("puts each book into its stage column", () => {
    const groups = groupByStage([
      makeBook({ id: "A", status: "design" }),
      makeBook({ id: "B", status: "press" }),
      makeBook({ id: "C", status: "design", position: 1 }),
    ]);

    expect(ids(groups.design)).toEqual(["A", "C"]);
    expect(ids(groups.press)).toEqual(["B"]);
    expect(groups.acquisition).toEqual([]);
  });

  it("sorts books within a column by position", () => {
    const groups = groupByStage([
      makeBook({ id: "third", position: 2 }),
      makeBook({ id: "first", position: 0 }),
      makeBook({ id: "second", position: 1 }),
    ]);

    expect(ids(groups.acquisition)).toEqual(["first", "second", "third"]);
  });

  it("does not reorder the input array", () => {
    const books = [makeBook({ id: "B", position: 1 }), makeBook({ id: "A", position: 0 })];

    groupByStage(books);

    expect(ids(books)).toEqual(["B", "A"]);
  });
});
