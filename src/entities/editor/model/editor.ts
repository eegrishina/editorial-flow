import { z } from "zod";

export const editorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  avatarUrl: z.url().optional(),
});

export type Editor = z.infer<typeof editorSchema>;
