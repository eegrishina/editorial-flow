"use client";

import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { cn } from "@/shared/lib";

interface SearchInputProps
  extends Omit<ComponentProps<"input">, "type" | "value" | "onChange" | "className"> {
  value: string;
  onChange: (value: string) => void;
  label?: string; // accessible name; the placeholder is not a label
  className?: string; // applies to the outer box
}

export const SearchInput = ({
  value,
  onChange,
  label = "Search",
  className,
  ...props
}: SearchInputProps) => {
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
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="w-55 bg-transparent font-sans text-[12px] text-ink outline-none placeholder:text-ink-30"
        {...props}
      />
    </div>
  );
};
