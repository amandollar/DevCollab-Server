import { z } from "zod";

// Reusable ObjectId validation (MongoDB ObjectId is 24 hex chars)
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

// Notification Zod Schema
export const createNotificationSchema = z.object({
  user: objectIdSchema, // recipient
  actor: objectIdSchema, // who triggered
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message too long"),
  read: z.boolean().optional().default(false),
  type: z.enum(["info", "invite", "comment"]),
});


// For updating an existing notification (partial, except ObjectId is required)
export const updateNotificationSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message too long")
    .optional(),
  read: z.boolean().optional(),
  type: z.enum(["info", "invite", "comment"]).optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
