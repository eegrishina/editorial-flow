import { z } from "zod";
import { stageSchema } from "@/entities/stage/@x/book";
import { editorSchema } from "@/entities/editor/@x/book";

export const bookSchema = z.object({
  id: z.string().min(1), // manuscript number, e.g. "MS-2041"
  title: z.string().min(1),
  author: z.string().min(1),
  status: stageSchema, // board column
  position: z.int().nonnegative(), // order within the column
  genre: z.string().min(1),
  wordCount: z.int().nonnegative(),
  chapters: z.int().nonnegative(),
  submitted: z.iso.date(), // YYYY-MM-DD
  deadline: z.iso.date(), // YYYY-MM-DD
  progress: z.int().min(0).max(100),
  urgent: z.boolean(),
  awaiting: z.boolean(), // waiting for someone else's decision; not a stage
  note: z.string(), // latest note
  editor: editorSchema.optional(),
  coverImage: z.url().optional(),
});

export type Book = z.infer<typeof bookSchema>;
