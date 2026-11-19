import { queryOptions } from "@tanstack/react-query";
import { booksApi } from "./booksApi";

export const bookKeys = {
  all: ["books"] as const,
};

export const booksQueryOptions = () =>
  queryOptions({
    queryKey: bookKeys.all,
    queryFn: () => booksApi.getBooks(),
  });
