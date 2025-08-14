import {z} from "zod";

export const createChatSchema = z.object({
  project: z.string().uuid(),
  sender: z.string().uuid(),
  message: z.string().min(1).max(500)
});

export const updateChatSchema = z.object({
  project: z.string().uuid().optional(),
  sender: z.string().uuid().optional(),
  message: z.string().min(1).max(500).optional()
});


export type CreateChatInput = z.infer<typeof createChatSchema>;
export type UpdateChatInput = z.infer<typeof updateChatSchema>;