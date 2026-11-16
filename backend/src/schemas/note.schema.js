import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().max(10000).default(""),
});

export const updateNoteSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    content: z.string().max(10000),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide title or content",
  });
