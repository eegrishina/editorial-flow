import { describe, expect, it } from "vitest";
import { filterBooks, type FilterBooksParams } from "./filterBooks";
import { makeBook } from "./makeBook.fixture";

const me = { id: "mr", name: "M. Reyes" };
const colleague = { id: "pn", name: "P. Nwosu" };

const books = [
  makeBook({ id: "MS-1987", title: "Northing & Easting", author: "Per Lindqvist", editor: me, urgent: true }),
  makeBook({ id: "MS-2049", title: "Saltwater Atlas", author: "Daniel Okafor", editor: colleague, awaiting: true }),
  makeBook({ id: "MS-2017", title: "Quiet Apparatus", author: "T. Halvorsen", editor: me }),
  makeBook({ id: "MS-1922", title: "The Empty Quarter", author: "Idris al-Mansouri", urgent: true }),
];

const all: FilterBooksParams = { filter: "all", query: "", currentEditorId: me.id };
const ids = (result: { id: string }[]) => result.map((book) => book.id);

describe("filterBooks", () => {
  it("returns every book for the 'all' tab and an empty query", () => {
    expect(filterBooks(books, all)).toEqual(books);
  });

  it("'mine' keeps only books assigned to the current editor", () => {
    expect(ids(filterBooks(books, { ...all, filter: "mine" }))).toEqual(["MS-1987", "MS-2017"]);
  });

  it("'urgent' keeps only urgent books", () => {
    expect(ids(filterBooks(books, { ...all, filter: "urgent" }))).toEqual(["MS-1987", "MS-1922"]);
  });

  it.each([
    ["title", "saltwater", ["MS-2049"]],
    ["author", "HALVORSEN", ["MS-2017"]],
    ["manuscript ID", "ms-19", ["MS-1987", "MS-1922"]],
    ["query with surrounding spaces", "  quiet  ", ["MS-2017"]],
    ["query with no match", "nonexistent", []],
  ])("searches by %s", (_, query, expected) => {
    expect(ids(filterBooks(books, { ...all, query }))).toEqual(expected);
  });

  it("combines the tab with the search query", () => {
    expect(ids(filterBooks(books, { ...all, filter: "urgent", query: "empty" }))).toEqual(["MS-1922"]);
  });
});
