import type { Book } from "../model/book";
import { isUrgent } from "./isUrgent";

export type BookFilter = "all" | "mine" | "urgent";

export interface FilterBooksParams {
  filter: BookFilter;
  query: string;
  currentEditorId: string;
}

// Board tabs (All / Assigned to Me / Urgent) + search by title, author or manuscript ID
export function filterBooks(
  books: Book[],
  { filter, query, currentEditorId }: FilterBooksParams,
): Book[] {
  const q = query.trim().toLowerCase();

  return books.filter((book) => {
    if (filter === "mine" && book.editor?.id !== currentEditorId) return false;
    if (filter === "urgent" && !isUrgent(book)) return false;
    if (!q) return true;

    return [book.title, book.author, book.id].some((field) =>
      field.toLowerCase().includes(q),
    );
  });
}
