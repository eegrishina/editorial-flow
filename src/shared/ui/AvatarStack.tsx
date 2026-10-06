import { cn } from "@/shared/lib";
import { EditorChip } from "./EditorChip";

interface AvatarStackProps {
  names: string[];
  max?: number; // chips shown before collapsing the rest into "+N"
  className?: string;
}

export const AvatarStack = ({ names, max = 4, className }: AvatarStackProps) => {
  const visible = names.slice(0, max);
  const hidden = names.slice(max);

  return (
    <div className={cn("flex items-center -space-x-1.5", className)}>
      {visible.map((name, index) => (
        <span key={`${name}-${index}`} className="rounded-full bg-card">
          <EditorChip name={name} className="size-6.5" />
        </span>
      ))}
      {hidden.length > 0 && (
        <span
          title={hidden.join(", ")}
          className="inline-flex size-6.5 items-center justify-center rounded-full bg-card border border-dashed border-ink-30/40 font-mono text-[10px] text-ink-50"
        >
          +{hidden.length}
        </span>
      )}
    </div>
  );
};
