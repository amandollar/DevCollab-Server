import express from 'express'
import authRoutes from './auth.routes'
import projectRoutes from './project.routes'
import taskRoutes from './task.routes'
import discussionRoutes from './discussion.routes'
import commentRoutes from './comment.routes'
import collaborationRoutes from './collaboration.routes'
import chatRoutes from './chat.routes'
import notificationRoutes from './notification.routes'

const router = express.Router()

// Health check endpoint for frontend wake-up calls
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'DevCollab Backend is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes
router.use('/auth', authRoutes)
router.use('/projects', projectRoutes)
router.use('/tasks', taskRoutes)
router.use('/discussions', discussionRoutes)
router.use('/comments', commentRoutes)
router.use('/collaborations', collaborationRoutes)
router.use('/chat', chatRoutes)
router.use('/notifications', notificationRoutes)

export default router