import { useMutation } from "@tanstack/react-query";
import type { Book } from "../model/book";
import { booksApi, type BookPatch } from "./booksApi";
import { bookKeys } from "./queries";

interface UpdateBookVariables {
  id: string;
  patch: BookPatch;
}

// Optimistic update: the cache changes before the API answers, is rolled back
// if the API fails, and is refetched afterwards to match the stored data
export function useUpdateBook() {
  return useMutation({
    mutationFn: ({ id, patch }: UpdateBookVariables) => booksApi.updateBook(id, patch),

    onMutate: async ({ id, patch }, { client }) => {
      await client.cancelQueries({ queryKey: bookKeys.all });
      const previous = client.getQueryData<Book[]>(bookKeys.all);

      client.setQueryData<Book[]>(bookKeys.all, (books) =>
        books?.map((book) => (book.id === id ? { ...book, ...patch } : book)),
      );

      return { previous };
    },

    onError: (_error, _variables, onMutateResult, { client }) => {
      if (onMutateResult?.previous) {
        client.setQueryData(bookKeys.all, onMutateResult.previous);
      }
    },

    onSettled: (_data, _error, _variables, _onMutateResult, { client }) =>
      client.invalidateQueries({ queryKey: bookKeys.all }),
  });
}
