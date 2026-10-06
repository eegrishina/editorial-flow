"use client";

import { useState } from "react";
import { SearchInput } from "@/shared/ui";

export const SearchDemo = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center gap-4">
      <SearchInput
        value={query}
        onChange={setQuery}
        label="Search manuscripts"
        placeholder="Search title, author, MS-…"
      />
      <span className="font-mono text-[10px] text-ink-30">value: “{query}”</span>
    </div>
  );
};
