import { BookCard, MOCK_BOOKS } from "@/entities/book";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ground p-12 flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-sm space-y-4">
        <p className="font-serif text-sm text-ink-30 italic">
          High-Fidelity FSD Cards:
        </p>
        {MOCK_BOOKS.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
