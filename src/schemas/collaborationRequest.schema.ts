import { z } from "zod";
import mongoose from "mongoose";

// Helper to validate MongoDB ObjectId
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });


export const createCollaborationRequestSchema = z.object({
  sender: objectId,
  receiver: objectId,
  project: objectId,
  status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
});




export type CreateCollaborationRequestInput = z.infer<typeof createCollaborationRequestSchema>;

