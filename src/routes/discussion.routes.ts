import { Router } from "express";
import { 
  createDiscussionSchema, 
  updateDiscussionSchema, 
  addTopicSchema, 
  addDiscussionSchema
} from "../schemas/discussion.schema";
import { 
  createDiscussion, 
  updateDiscussion, 
  getDiscussions, 
  getDiscussionById, 
  addTopic, 
  addDiscussionToTopic, 
  deleteDiscussion
} from "../controllers/discussion.controller";
import { authenticateToken } from '../middleware/auth.middleware';
import { validateSchema } from '../middleware/validation.middleware';

const discussionRouter = Router();

// Public routes (no authentication required)
discussionRouter.get('/', getDiscussions);
discussionRouter.get('/:discussionId', getDiscussionById);

// Protected routes (authentication required)
discussionRouter.post('/create', authenticateToken, validateSchema(createDiscussionSchema), createDiscussion);
discussionRouter.put('/update/:discussionId', authenticateToken, validateSchema(updateDiscussionSchema), updateDiscussion);
discussionRouter.post('/:discussionId/topic', authenticateToken, validateSchema(addTopicSchema), addTopic);
discussionRouter.post('/:discussionId/discussion', authenticateToken, validateSchema(addDiscussionSchema), addDiscussionToTopic);
discussionRouter.delete('/:discussionId', authenticateToken, deleteDiscussion);

export default discussionRouter;
