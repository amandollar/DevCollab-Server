import { Router } from 'express'
import { 
  login, 
  register, 
  verifyEmail, 
  resendVerificationEmail,
  getUserById,
  updateUserById,
  deleteUserById,
  getCurrentUser
} from '../controllers/auth.controller'
import { authenticateToken } from '../middleware/auth.middleware'
import { validateSchema } from '../middleware/validation.middleware'
import { 
  registerSchema, 
  loginSchema, 
  updateUserSchema, 
  resendVerificationSchema,
  userIdSchema
} from '../schemas/user.schema'
import upload from '../middleware/mutlerMiddleware'

const authRouter = Router()

// Public routes
authRouter.post('/register', upload.single('image'), validateSchema(registerSchema), register)
authRouter .post('/login', validateSchema(loginSchema), login)
authRouter.get('/verify-email/:token', verifyEmail)
authRouter.post('/resend-verification', validateSchema(resendVerificationSchema), resendVerificationEmail)

// Protected routes (require authentication)
authRouter.get('/profile', authenticateToken, getCurrentUser)
authRouter.get('/users/:id', authenticateToken, validateSchema(userIdSchema), getUserById)
authRouter.put('/users/:id', authenticateToken, upload.single('image'), validateSchema(updateUserSchema), updateUserById)
authRouter .delete('/users/:id', authenticateToken, validateSchema(userIdSchema), deleteUserById)

export default authRouter;
