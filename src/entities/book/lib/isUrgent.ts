import type { Book } from "../model/book";

export function isUrgent(book: Book): boolean {
  return book.flag === "urgent";
}
