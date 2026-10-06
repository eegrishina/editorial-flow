import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Filter, MessageSquare, Plus, ArrowRight, X } from "lucide-react";
import { BookCard, MOCK_BOOKS } from "@/entities/book";
import { MOCK_EDITORS } from "@/entities/editor";
import {
  AvatarStack,
  Button,
  Counter,
  Dashed,
  EditorChip,
  IconButton,
  Kicker,
  ProgressBar,
} from "@/shared/ui";
import { SearchDemo } from "./SearchDemo";

export const metadata: Metadata = {
  title: "UI kit — Editorial Flow",
};

const editorNames = Object.values(MOCK_EDITORS).map((editor) => editor.name);
const card = (id: string) => MOCK_BOOKS.find((book) => book.id === id)!;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-4">
    <Kicker>{title}</Kicker>
    <div className="flex flex-wrap items-center gap-4">{children}</div>
    <Dashed className="mt-6" />
  </section>
);

export default function KitPage() {
  return (
    <main className="mx-auto max-w-[1100px] space-y-8 px-8 py-10">
      <header>
        <Kicker>Design system</Kicker>
        <h1 className="mt-1 font-serif text-[48px] font-medium leading-none tracking-[-0.015em]">
          UI kit
        </h1>
      </header>

      <Section title="Typography">
        <div className="space-y-2">
          <p className="font-serif text-[28px] font-medium">Serif — Lora for titles</p>
          <p className="font-sans text-[13px]">Sans — Inter for UI, labels and notes</p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-ink-50">MONO — JETBRAINS MONO · № MS-2041 · JUN 02</p>
        </div>
      </Section>

      <Section title="Kicker · Counter">
        <Kicker>Active manuscripts</Kicker>
        <Counter value={3} />
        <Counter value={14} className="text-ink-30" />
        <Counter value={2} className="text-accent" />
        <Counter value={8} suffix="%" />
      </Section>

      <Section title="Dashed">
        <Dashed className="w-48" />
        <div className="flex h-10 items-center gap-4">
          <span className="text-[12px]">left</span>
          <Dashed vertical />
          <span className="text-[12px]">right</span>
        </div>
      </Section>

      <Section title="Buttons">
        <Button>
          <Filter size={12} strokeWidth={1.5} />
          Filter
        </Button>
        <Button variant="solid">
          <Plus size={12} strokeWidth={1.8} />
          New Acquisition
        </Button>
        <Button variant="accent">
          <ArrowRight size={12} strokeWidth={1.8} />
          Advance stage
        </Button>
        <Button variant="subtle" className="w-60">
          <Plus size={11} strokeWidth={1.6} />
          add
        </Button>
        <Button variant="ghost" className="py-2.5">
          <MessageSquare size={12} strokeWidth={1.5} />
          Note
        </Button>
        <Button disabled>Disabled</Button>
        <IconButton label="Close">
          <X size={12} strokeWidth={1.5} />
        </IconButton>
      </Section>

      <Section title="Search">
        <SearchDemo />
      </Section>

      <Section title="Editors">
        <EditorChip name="M. Reyes" />
        <EditorChip name="J. Tanaka" className="size-4.5" />
        <AvatarStack names={editorNames} />
        <AvatarStack names={editorNames.slice(0, 3)} />
      </Section>

      <Section title="Progress">
        <ProgressBar value={42} className="w-60" />
        <ProgressBar value={91} accent className="w-60" />
        <ProgressBar value={100} className="w-60" />
      </Section>

      <section className="space-y-4">
        <Kicker>BookCard — default · urgent · review · selected (hover to reveal details)</Kicker>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 bg-ground">
          <BookCard book={card("MS-2003")} />
          <BookCard book={card("MS-1987")} />
          <BookCard book={card("MS-2041")} />
          <BookCard book={card("MS-1908")} isSelected />
        </div>
      </section>
    </main>
  );
}
