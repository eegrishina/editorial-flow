import { cn } from "@/shared/lib";

interface EditorChipProps {
  name: string;
  className?: string;
}

export const EditorChip = ({ name, className }: EditorChipProps) => {
  // "M. Reyes" → "MR"; size via className, e.g. "size-6.5"
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-mono text-[10px] tracking-[0.04em]",
        "size-5.5 text-ink border border-dashed border-ink-30/40 bg-transparent",
        className,
      )}
      title={name}
    >
      {initials}
    </span>
  );
};
