import { STAGE_IDS, type Stage } from "@/entities/stage/@x/book";
import type { Book } from "../model/book";

// Splits books into board columns. Every stage gets a key (empty columns
// included), books inside a column are sorted by position.
export function groupByStage(books: Book[]): Record<Stage, Book[]> {
  const groups = Object.fromEntries(
    STAGE_IDS.map((stage) => [stage, [] as Book[]]),
  ) as Record<Stage, Book[]>;

  for (const book of books) {
    groups[book.status].push(book);
  }
  for (const stage of STAGE_IDS) {
    groups[stage].sort((a, b) => a.position - b.position);
  }

  return groups;
}
