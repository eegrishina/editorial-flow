import { z } from "zod";
import { stageSchema } from "@/entities/stage/@x/book";
import { editorSchema } from "@/entities/editor/@x/book";

export const bookFlagSchema = z.enum(["urgent", "review"]);

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
  flag: bookFlagSchema.optional(),
  note: z.string(), // latest note
  editor: editorSchema.optional(),
  coverImage: z.url().optional(),
});

export type Book = z.infer<typeof bookSchema>;
export type BookFlag = z.infer<typeof bookFlagSchema>;
