import { useQuery } from "@tanstack/react-query";
import { booksQueryOptions } from "./queries";

export function useBooks() {
  return useQuery(booksQueryOptions());
}
