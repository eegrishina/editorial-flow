"use client";

import { useRef, type ComponentProps } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/shared/lib";

interface SearchInputProps
  extends Omit<ComponentProps<"input">, "type" | "value" | "onChange" | "className" | "ref"> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  label = "Search",
  className,
  ...props
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEmpty = value === "";

  const clear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 bg-card border border-dashed border-rule",
        "focus-within:border-ink-50 transition-colors",
        className,
      )}
    >
      <Search size={13} strokeWidth={1.5} aria-hidden className="shrink-0 text-ink-50" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="w-55 bg-transparent font-sans text-[12px] text-ink outline-none placeholder:text-ink-30 [&::-webkit-search-cancel-button]:appearance-none"
        {...props}
      />
      <button
        type="button"
        onClick={clear}
        disabled={isEmpty}
        aria-label="Clear search"
        title="Clear search"
        className={cn(
          "shrink-0 cursor-pointer text-ink-50 transition-colors hover:text-ink",
          "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ink",
          isEmpty && "invisible",
        )}
      >
        <X size={12} strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
};
