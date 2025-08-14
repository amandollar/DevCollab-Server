import { z } from "zod";
import mongoose from "mongoose";


const objectIdSchema = z.string().refine(
  (id) => mongoose.Types.ObjectId.isValid(id),
  { message: "Invalid ObjectId" }
);



export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  assignees: z.array(objectIdSchema).optional(),
  project: objectIdSchema.optional(),
  createdBy: objectIdSchema.optional(),
  dueDate: z.string().datetime().optional(), // or z.coerce.date().optional()
  priority: z.enum(["low", "medium", "high"]).optional(),
  comments: z.array(objectIdSchema).optional()
});


export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  assignees: z.array(objectIdSchema).optional(),
  project: objectIdSchema.optional(),
  createdBy: objectIdSchema.optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  comments: z.array(objectIdSchema).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;