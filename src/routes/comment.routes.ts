
import { Router } from "express";
import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByTask,
} from "../controllers/comment.controller";
import { authenticateToken } from '../middleware/auth.middleware'
import { validateSchema } from '../middleware/validation.middleware'
import { createCommentSchema, updateCommentSchema ,deleteCommentSchema} from "../schemas/comments.schema";

const commentRouter = Router();

commentRouter.post("/", authenticateToken, validateSchema(createCommentSchema), createComment);
commentRouter.put("/:id", authenticateToken, validateSchema(updateCommentSchema), updateComment);
commentRouter.delete("/:id", authenticateToken, validateSchema(deleteCommentSchema), deleteComment);
commentRouter.get("/task/:taskId", authenticateToken, getCommentsByTask);

export default commentRouter;
