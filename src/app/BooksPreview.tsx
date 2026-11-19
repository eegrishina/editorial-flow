"use client";

import { BookCard, useBooks, useUpdateBook } from "@/entities/book";
import { Button, Kicker } from "@/shared/ui";

export const BooksPreview = () => {
  const { data: books, isPending, isError, error, refetch } = useBooks();
  const updateBook = useUpdateBook();

  if (isPending) {
    return <Kicker>Loading manuscripts…</Kicker>;
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <p className="text-[13px] text-ink-70">Couldn’t load manuscripts: {error.message}</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <>
      <Kicker className="block">Click a card to toggle urgent</Kicker>
      {updateBook.isError && (
        <p className="text-[12px] text-ink-70">
          Couldn’t save {updateBook.variables.id}: {updateBook.error.message}. The change was rolled back.
        </p>
      )}
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onSelect={() => updateBook.mutate({ id: book.id, patch: { urgent: !book.urgent } })}
        />
      ))}
    </>
  );
};
