import { z } from "zod";

// Production stages in board order: one stage = one board column
export const STAGE_IDS = [
  "acquisition",
  "developmental",
  "copyedit",
  "design",
  "proof",
  "press",
] as const;

export const stageSchema = z.enum(STAGE_IDS);

export type Stage = z.infer<typeof stageSchema>;

export interface StageMeta {
  id: Stage;
  label: string;
  sub: string;
}

export const STAGES: StageMeta[] = [
  { id: "acquisition", label: "Acquisition", sub: "Submitted manuscripts" },
  { id: "developmental", label: "Developmental Edit", sub: "Structural revision" },
  { id: "copyedit", label: "Copy Edit", sub: "Line & consistency" },
  { id: "design", label: "Design & Typesetting", sub: "Cover & interior" },
  { id: "proof", label: "Final Proof", sub: "Pre-press review" },
  { id: "press", label: "To Press", sub: "Cleared for print" },
];
