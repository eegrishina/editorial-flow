import { bookSchema, type Book } from "../model/book";
import { MOCK_BOOKS } from "../model/mocks";

export type BookPatch = Partial<Omit<Book, "id">>;

// The seam between UI and data: the mock below now, a fetch-based version in MVP-2
export interface BooksApi {
  getBooks(): Promise<Book[]>;
  updateBook(id: string, patch: BookPatch): Promise<Book>;
}

interface MockBooksApiOptions {
  delayMs?: number;
  failureRate?: number; // 0–1, share of updates that fail
  random?: () => number;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function createMockBooksApi({
  delayMs = 400,
  failureRate = 0,
  random = Math.random,
}: MockBooksApiOptions = {}): BooksApi {
  // Data is copied in and out, like over a network: callers can't mutate the stored books
  let books = structuredClone(MOCK_BOOKS);

  return {
    async getBooks() {
      await wait(delayMs);
      return structuredClone(books);
    },

    async updateBook(id, patch) {
      await wait(delayMs);
      if (random() < failureRate) {
        throw new Error("Mock API: simulated network error");
      }

      const current = books.find((book) => book.id === id);
      if (!current) {
        throw new Error(`Mock API: book ${id} not found`);
      }

      const updated = bookSchema.parse({ ...current, ...patch });
      books = books.map((book) => (book.id === id ? updated : book));
      return structuredClone(updated);
    },
  };
}

export const booksApi = createMockBooksApi({
  failureRate: Number(process.env.NEXT_PUBLIC_MOCK_API_FAILURE_RATE ?? 0),
});
