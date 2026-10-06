import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

interface KickerProps {
  children: ReactNode;
  className?: string;
}

export const Kicker = ({ children, className }: KickerProps) => {
  return (
    <span
      className={cn(
        "font-sans text-[10px] uppercase tracking-[0.22em] text-ink-50",
        className,
      )}
    >
      {children}
    </span>
  );
};
