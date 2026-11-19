import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Book } from "../model/book";
import { makeBook } from "../lib/makeBook.fixture";
import { booksApi } from "./booksApi";
import { bookKeys } from "./queries";
import { useBooks } from "./useBooks";
import { useUpdateBook } from "./useUpdateBook";

const books = [makeBook({ id: "A" }), makeBook({ id: "B" })];

const setup = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
};

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const cachedBook = (client: QueryClient, id: string) =>
  client.getQueryData<Book[]>(bookKeys.all)?.find((book) => book.id === id);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useBooks", () => {
  it("loads books from the API", async () => {
    vi.spyOn(booksApi, "getBooks").mockResolvedValue(books);
    const { wrapper } = setup();

    const { result } = renderHook(() => useBooks(), { wrapper });

    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(books);
  });

  it("exposes API errors", async () => {
    vi.spyOn(booksApi, "getBooks").mockRejectedValue(new Error("offline"));
    const { wrapper } = setup();

    const { result } = renderHook(() => useBooks(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("offline"));
  });
});

describe("useUpdateBook", () => {
  it("updates the cache before the API answers", async () => {
    const response = deferred<Book>();
    vi.spyOn(booksApi, "updateBook").mockReturnValue(response.promise);
    vi.spyOn(booksApi, "getBooks").mockResolvedValue(books);
    const { client, wrapper } = setup();
    client.setQueryData(bookKeys.all, books);

    const { result } = renderHook(() => useUpdateBook(), { wrapper });
    act(() => result.current.mutate({ id: "A", patch: { urgent: true } }));

    await waitFor(() => expect(cachedBook(client, "A")?.urgent).toBe(true));
    expect(cachedBook(client, "B")?.urgent).toBe(false);
    expect(booksApi.updateBook).toHaveBeenCalledWith("A", { urgent: true });

    await act(async () => response.resolve({ ...books[0], urgent: true }));
  });

  it("rolls the cache back when the API fails", async () => {
    vi.spyOn(booksApi, "updateBook").mockRejectedValue(new Error("offline"));
    vi.spyOn(booksApi, "getBooks").mockResolvedValue(books);
    const { client, wrapper } = setup();
    client.setQueryData(bookKeys.all, books);

    const { result } = renderHook(() => useUpdateBook(), { wrapper });
    act(() => result.current.mutate({ id: "A", patch: { urgent: true } }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(cachedBook(client, "A")?.urgent).toBe(false);
  });

  it("refetches the books once the update settles", async () => {
    vi.spyOn(booksApi, "updateBook").mockResolvedValue({ ...books[0], urgent: true });
    const getBooks = vi.spyOn(booksApi, "getBooks").mockResolvedValue(books);
    const { client, wrapper } = setup();
    renderHook(() => useBooks(), { wrapper });
    await waitFor(() => expect(getBooks).toHaveBeenCalledTimes(1));

    const { result } = renderHook(() => useUpdateBook(), { wrapper });
    await act(() => result.current.mutateAsync({ id: "A", patch: { urgent: true } }));

    expect(getBooks).toHaveBeenCalledTimes(2);
    expect(client.getQueryState(bookKeys.all)?.isInvalidated).toBe(false);
  });
});
