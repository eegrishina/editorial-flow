import type { Book } from "../model/book";

// The single place that decides urgency: when it becomes deadline-based,
// only this function changes, not the filters and UI that call it
export function isUrgent(book: Book): boolean {
  return book.urgent;
}
