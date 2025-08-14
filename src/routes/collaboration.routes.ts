import { Router } from "express"
import {sendRequest,acceptRequest,rejectRequest,getPendingUserRequestForUser} from "../controllers/collaborationRequest.controller"
import {createCollaborationRequestSchema} from "../schemas/collaborationRequest.schema"
import { authenticateToken } from '../middleware/auth.middleware'
import { validateSchema } from '../middleware/validation.middleware'

const collaborationRouter = Router();

collaborationRouter.post("/send",authenticateToken,validateSchema(createCollaborationRequestSchema),sendRequest);
collaborationRouter.patch("/:id/accept",authenticateToken,acceptRequest);
collaborationRouter.patch("/:id/reject",authenticateToken,rejectRequest);
collaborationRouter.patch("/pending/:userId",getPendingUserRequestForUser);


export default collaborationRouter;
