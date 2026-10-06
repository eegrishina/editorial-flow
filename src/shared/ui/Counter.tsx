import { cn } from "@/shared/lib";

interface CounterProps {
  value: number;
  pad?: number; // minimum digits, zero-padded: 3 → "03"
  suffix?: string;
  className?: string;
}

export const Counter = ({ value, pad = 2, suffix = "", className }: CounterProps) => {
  return (
    <span className={cn("font-mono text-[10px] tabular-nums text-ink-50", className)}>
      {String(value).padStart(pad, "0")}
      {suffix}
    </span>
  );
};
