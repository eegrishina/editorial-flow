import { cn } from "@/shared/lib";

interface DashedProps {
  vertical?: boolean;
  className?: string;
}

export const Dashed = ({ vertical, className }: DashedProps) => {
  return (
    <div
      aria-hidden
      className={cn(
        "shrink-0 opacity-18",
        vertical
          ? "w-px self-stretch bg-[repeating-linear-gradient(to_bottom,var(--color-ink)_0_4px,transparent_4px_8px)]"
          : "h-px w-full bg-[repeating-linear-gradient(to_right,var(--color-ink)_0_4px,transparent_4px_8px)]",
        className,
      )}
    />
  );
};
