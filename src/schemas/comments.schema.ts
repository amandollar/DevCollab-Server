import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Comment content is required"),
    task: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid task ID"),
  }),
});

export const updateCommentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID"),
  }),
  body: z.object({
    content: z.string().min(1, "Comment content is required"),
  }),
});

export const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID"),
  }),
});
