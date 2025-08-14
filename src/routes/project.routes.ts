import {Router} from "express";
import {createProjectSchema,updateProjectSchema} from "../schemas/project.schema";
import { createProject, updateProject,getProjects,getProjectById,deleteProject,removeProjectMember} from "../controllers/project.controller";
import { authenticateToken } from '../middleware/auth.middleware'
import { validateSchema } from '../middleware/validation.middleware'


const projectRouter = Router();

projectRouter.get('/',authenticateToken,getProjects);
projectRouter.get('/:projectId',authenticateToken,getProjectById);
projectRouter.post('/create',authenticateToken,validateSchema(createProjectSchema),createProject)
projectRouter.put('/update/:projectId',authenticateToken,validateSchema(updateProjectSchema),updateProject);
projectRouter.delete('/:projectId/:collaboratorId', authenticateToken, removeProjectMember);
projectRouter.delete('/:projectId',authenticateToken,deleteProject);

export default projectRouter;