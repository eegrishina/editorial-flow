import { cn } from "@/shared/lib";

interface ProgressBarProps {
  value: number; // 0–100
  accent?: boolean; // fill with the accent color instead of ink
  label?: string; // accessible name of the bar
  className?: string;
}

export const ProgressBar = ({
  value,
  accent,
  label = "Progress",
  className,
}: ProgressBarProps) => {
  return (
    <div className={cn("flex items-center gap-2 w-full", className)}>
      <progress
        value={value}
        max={100}
        aria-label={label}
        className={cn(
          "flex-1 h-0.75 rounded-full overflow-hidden appearance-none bg-ink-30/10",
          "[&::-webkit-progress-bar]:bg-ink-30/10",
          accent
            ? "[&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent"
            : "[&::-webkit-progress-value]:bg-ink [&::-moz-progress-bar]:bg-ink",
        )}
      />

      <span className="font-mono text-[10px] tabular-nums text-ink-50 min-w-6.5 text-right">
        {value.toString().padStart(2, "0")}%
      </span>
    </div>
  );
};
