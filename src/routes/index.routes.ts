import { Router } from "express";
import authRouter from '../routes/auth.routes'
import collaborationRouter from '../routes/collaboration.routes';
import projectRouter from '../routes/project.routes';
import taskRouter from '../routes/task.routes';
import commentRouter from "./comment.routes";
import notificationRouter from "./notification.routes";
import chatRouter from "./chat.routes";
import discussionRouter from "./discussion.routes";


const indexRouter = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/collaboration', collaborationRouter);
indexRouter.use('/project', projectRouter);
indexRouter.use('/task', taskRouter);
indexRouter.use('/comment', commentRouter);
indexRouter.use('/notification', notificationRouter);
indexRouter.use('/chat',chatRouter);
indexRouter.use('/discussion', discussionRouter);

export default indexRouter;