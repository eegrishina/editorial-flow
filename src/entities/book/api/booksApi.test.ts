import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { MOCK_BOOKS } from "../model/mocks";
import { createMockBooksApi } from "./booksApi";

const api = (options = {}) => createMockBooksApi({ delayMs: 0, ...options });

describe("createMockBooksApi", () => {
  it("returns every mock book", async () => {
    expect(await api().getBooks()).toEqual(MOCK_BOOKS);
  });

  it("hands out copies, so callers can't change the stored data", async () => {
    const booksApi = api();
    const books = await booksApi.getBooks();
    books[0].title = "Changed by the caller";

    expect((await booksApi.getBooks())[0].title).toBe(MOCK_BOOKS[0].title);
  });

  it("updates a book and keeps the change", async () => {
    const booksApi = api();

    const updated = await booksApi.updateBook("MS-2041", { status: "developmental", urgent: true });

    expect(updated).toMatchObject({ id: "MS-2041", status: "developmental", urgent: true });
    expect((await booksApi.getBooks()).find((book) => book.id === "MS-2041")).toEqual(updated);
  });

  it("rejects an update that breaks the schema and keeps the old data", async () => {
    const booksApi = api();

    await expect(booksApi.updateBook("MS-2041", { progress: 140 })).rejects.toBeInstanceOf(ZodError);
    expect((await booksApi.getBooks())[0].progress).toBe(MOCK_BOOKS[0].progress);
  });

  it("rejects an update of an unknown book", async () => {
    await expect(api().updateBook("MS-0000", { urgent: true })).rejects.toThrow("MS-0000 not found");
  });

  it("simulates failures at the given rate", async () => {
    const booksApi = api({ failureRate: 0.5, random: () => 0.3 });

    await expect(booksApi.updateBook("MS-2041", { urgent: true })).rejects.toThrow("simulated network error");
    expect((await booksApi.getBooks())[0].urgent).toBe(false);
  });

  it("keeps a separate store per instance", async () => {
    const first = api();
    await first.updateBook("MS-2041", { urgent: true });

    expect((await api().getBooks())[0].urgent).toBe(false);
  });
});
