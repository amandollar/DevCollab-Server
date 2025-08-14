import { Router } from "express";
import {createTask,getTasks,getTask,updateTask,deleteTask} from "../controllers/task.controller";
import { createTaskSchema,updateTaskSchema } from "../schemas/task.schema";
import { validateSchema } from "../middleware/validation.middleware";
import { authenticateToken } from "../middleware/auth.middleware";
const taskRouter = Router();

taskRouter.post("/", authenticateToken, validateSchema(createTaskSchema), createTask);
taskRouter.get("/", authenticateToken, getTasks);
taskRouter.get("/:id", authenticateToken, getTask);
taskRouter.put("/:id", authenticateToken, validateSchema(updateTaskSchema), updateTask);
taskRouter.delete("/:id", authenticateToken, deleteTask);

export default taskRouter;
