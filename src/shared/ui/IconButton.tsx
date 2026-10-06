import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";

interface IconButtonProps extends Omit<ComponentProps<"button">, "aria-label"> {
  label: string; // required: an icon alone has no accessible name
}

export const IconButton = ({
  label,
  type = "button",
  className,
  ...props
}: IconButtonProps) => {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center",
        "border border-dashed border-rule text-ink transition-colors hover:border-ink/40 hover:bg-ground",
        "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ink",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};
