import { z } from "zod";

export const createDiscussionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be at most 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be at most 500 characters"),
  topics: z.array(z.string().min(1, "Topic must not be empty").max(100, "Topic must be at most 100 characters")).optional(),
  discussion: z.array(z.string().min(1, "Discussion must not be empty").max(500, "Discussion must be at most 500 characters")).optional()
});

export const updateDiscussionSchema = z.object({
  params: z.object({
    discussionId: z.string().min(1, "Discussion ID is required")
  }),
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be at most 50 characters").optional(),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be at most 500 characters").optional(),
    topics: z.array(z.string().min(1, "Topic must not be empty").max(100, "Topic must be at most 100 characters")).optional(),
    discussion: z.array(z.string().min(1, "Discussion must not be empty").max(500, "Discussion must be at most 500 characters")).optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be updated"
  })
});

export const addTopicSchema = z.object({
  params: z.object({
    discussionId: z.string().min(1, "Discussion ID is required")
  }),
  body: z.object({
    topic: z.string().min(1, "Topic must not be empty").max(100, "Topic must be at most 100 characters")
  })
});

export const addDiscussionSchema = z.object({
  params: z.object({
    discussionId: z.string().min(1, "Discussion ID is required")
  }),
  body: z.object({
    discussion: z.string().min(1, "Discussion must not be empty").max(500, "Discussion must be at most 500 characters")
  })
});

export type createDiscussionInput = z.infer<typeof createDiscussionSchema>;
export type updateDiscussionInput = z.infer<typeof updateDiscussionSchema>;
export type addTopicInput = z.infer<typeof addTopicSchema>;
export type addDiscussionInput = z.infer<typeof addDiscussionSchema>;
