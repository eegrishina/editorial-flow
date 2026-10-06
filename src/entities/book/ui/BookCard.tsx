"use client";

import { Calendar, FileText, BookOpen } from "lucide-react";
import type { Book } from "../model/book";
import { isUrgent } from "../lib/isUrgent";
import { cn, formatWords, formatDate } from "@/shared/lib";
import { EditorChip, ProgressBar } from "@/shared/ui";

interface BookCardProps {
  book: Book;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}

export const BookCard = ({
  book,
  isSelected,
  onSelect,
  className,
}: BookCardProps) => {
  const urgent = isUrgent(book);
  const review = book.flag === "review";

  return (
    <article
      onClick={() => onSelect?.(book.id)}
      className={cn(
        "group relative cursor-pointer overflow-hidden transition-colors px-4 pt-3.5 pb-3",
        "bg-card border border-dashed border-rule text-ink",
        // border-dashed applies to every side; the urgent left edge is solid, as in the prototype
        urgent
          ? "border-l-2 border-l-accent [border-left-style:solid]"
          : "hover:border-accent/40",
        isSelected && "outline outline-ink -outline-offset-1",
        className,
      )}
    >
      {/* HEADER: ID + Flags + Editor */}
      <header className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.14em] text-ink-30">
          № {book.id}
        </span>
        <div className="flex items-center gap-2">
          {urgent && (
            <span className="flex items-center gap-1 font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              urgent
            </span>
          )}
          {review && (
            <span className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-ink-50">
              <span className="text-[13px] leading-none">◌</span> review
            </span>
          )}
          {book.editor && <EditorChip name={book.editor.name} />}
        </div>
      </header>

      {/* TITLE & AUTHOR */}
      <h3 className="mt-3 font-serif text-[19px] font-medium leading-[1.15] text-pretty group-hover:text-accent transition-colors">
        {book.title}
      </h3>
      <div className="mt-1 font-sans text-[12px] text-ink-50">
        {book.author}
      </div>

      {/* FOOTER: Deadline + Progress */}
      <div className="mt-4 flex items-center gap-3">
        <div
          className={cn(
            "flex items-center gap-1.5 font-mono text-[10px] tracking-widest whitespace-nowrap",
            urgent ? "text-accent" : "text-ink-50",
          )}
        >
          <Calendar size={11} strokeWidth={1.6} />
          <span>{formatDate(book.deadline)}</span>
        </div>

        <ProgressBar
          value={book.progress}
          accent={urgent}
          label="Production progress"
        />
      </div>

      {/* HOVER REVEAL: Extra Metadata */}
      <div className="grid transition-all duration-300 ease-out grid-template-rows-0 group-hover:grid-template-rows-1 mt-0">
        <div className="overflow-hidden">
          <div className="mt-3 pt-3 flex items-center justify-between border-t border-dashed border-rule">
            <span className="text-[10px] font-sans uppercase tracking-[0.14em] text-ink-50">
              {book.genre}
            </span>

            {/* Metadata */}
            <div className="flex items-center gap-3 font-mono text-[10px] text-ink-50">
              <span className="flex items-center gap-1">
                <FileText size={10} strokeWidth={1.5} />
                {formatWords(book.wordCount)} w
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={10} strokeWidth={1.5} />
                {book.chapters} ch
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
