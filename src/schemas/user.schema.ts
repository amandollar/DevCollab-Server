import { z } from 'zod'

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  image: z.string().optional(), 
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters')
})

// User login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// User update schema
export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters').optional()
}).refine((data) => {
  // At least one field must be provided
  return Object.keys(data).length > 0
}, {
  message: 'At least one field must be provided for update'
})

// Resend verification schema
export const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email address')
})

// User ID parameter schema
export const userIdSchema = z.object({
  id: z.string().min(1, 'User ID is required')
})

// Combined schema for update user (params + body)
export const updateUserWithIdSchema = z.object({
  params: userIdSchema,
  body: updateUserSchema
})

// Export types
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>
export type UserIdInput = z.infer<typeof userIdSchema> 