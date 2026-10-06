import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

export type ButtonVariant = "ghost" | "solid" | "accent" | "subtle";

const VARIANTS: Record<ButtonVariant, string> = {
  ghost: "bg-card text-ink border border-dashed border-rule font-medium hover:bg-ground/50",
  solid: "bg-ink text-ground font-medium hover:bg-ink-70",
  accent: "bg-accent text-card font-semibold tracking-[0.2em] hover:bg-accent/85",
  subtle: "bg-transparent text-ink-50 border border-dashed border-rule font-medium hover:bg-card",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export const Button = ({
  variant = "ghost",
  type = "button",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 px-3 py-2",
        "font-sans text-[10px] uppercase tracking-[0.18em] transition-colors",
        "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ink",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
};
