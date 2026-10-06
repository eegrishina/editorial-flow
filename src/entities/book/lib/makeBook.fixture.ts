import type { Book } from "../model/book";

// Test-only factory: a valid book with sensible defaults
export function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: "MS-0001",
    title: "Untitled",
    author: "Anonymous",
    status: "acquisition",
    position: 0,
    genre: "Fiction",
    wordCount: 50000,
    chapters: 10,
    submitted: "2026-01-01",
    deadline: "2026-02-01",
    progress: 0,
    urgent: false,
    awaiting: false,
    note: "",
    ...overrides,
  };
}
