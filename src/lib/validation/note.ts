import { z } from "zod";

// Schema Validation when creating a note
export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional(),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

// Schema for validating a when updating a Note

export const updateNoteSchema = createNoteSchema.extend({
  id: z.string().min(1),
});

export const deleteNoteSchema = z.object({
  id: z.string().min(1),
});
