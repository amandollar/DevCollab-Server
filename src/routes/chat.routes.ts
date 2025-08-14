import { Router } from "express";
import { createChat,updateChat,deleteChat } from "../controllers/chat.controller";
import { createChatSchema,updateChatSchema } from "../schemas/chat.schema";
import { authenticateToken } from '../middleware/auth.middleware'
import { validateSchema } from '../middleware/validation.middleware'

const chatRouter = Router();

chatRouter.post("/", authenticateToken, validateSchema(createChatSchema), createChat);
chatRouter.put("/:id", authenticateToken, validateSchema(updateChatSchema), updateChat);
chatRouter.delete("/:id", authenticateToken, deleteChat);


export default chatRouter;