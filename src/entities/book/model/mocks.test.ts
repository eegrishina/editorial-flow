import { describe, expect, it } from "vitest";
import { STAGE_IDS } from "@/entities/stage";
import { bookSchema } from "./book";
import { MOCK_BOOKS } from "./mocks";

describe("MOCK_BOOKS", () => {
  it.each(MOCK_BOOKS.map((book) => [book.id, book]))("%s matches bookSchema", (_, book) => {
    expect(bookSchema.safeParse(book).success).toBe(true);
  });

  it("has unique manuscript IDs", () => {
    const ids = MOCK_BOOKS.map((book) => book.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has positions 0..n-1 within every stage", () => {
    for (const stage of STAGE_IDS) {
      const positions = MOCK_BOOKS.filter((book) => book.status === stage)
        .map((book) => book.position)
        .sort((a, b) => a - b);

      expect(positions).toEqual(positions.map((_, index) => index));
    }
  });
});
