import { Router } from "express";
import {createNotification,updateNotification} from "../controllers/notification.controller";
import { createNotificationSchema,updateNotificationSchema } from "../schemas/Notification.schema";
import { authenticateToken } from '../middleware/auth.middleware'
import { validateSchema } from '../middleware/validation.middleware'

const notificationRouter = Router();

notificationRouter.post(
  '/',
  authenticateToken,
  validateSchema(createNotificationSchema),
  createNotification
);

notificationRouter.put(
  '/:id',
  authenticateToken,
  validateSchema(updateNotificationSchema),
  updateNotification
);


export default notificationRouter;