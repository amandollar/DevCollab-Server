import { z } from "zod";
import mongoose from "mongoose";


const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  owner: objectId,
  collborators: z.array(objectId).optional(),
});

export const updateProjectSchema = z.object({
    params:z.object({
        projectId:objectId,
    }),

    body:z.object({
        title:z.string().min(1).optional(),
        description:z.string().min(1).optional(),
        collborators:z.array(objectId).optional()
    })
    .refine((data)=>Object.keys(data).length>0,{
        message:"Atlease one field is updated"
    })
});



export type createProjectInput = z.infer<typeof createProjectSchema>;
export type updateProjectInput = z.infer<typeof updateProjectSchema>;
