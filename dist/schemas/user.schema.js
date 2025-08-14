"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserWithIdSchema = exports.userIdSchema = exports.resendVerificationSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// User registration schema
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    image: zod_1.z.string().optional(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters')
});
// User login schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required')
});
// User update schema
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').optional(),
    email: zod_1.z.string().email('Invalid email address').optional(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters').optional()
}).refine((data) => {
    // At least one field must be provided
    return Object.keys(data).length > 0;
}, {
    message: 'At least one field must be provided for update'
});
// Resend verification schema
exports.resendVerificationSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address')
});
// User ID parameter schema
exports.userIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'User ID is required')
});
// Combined schema for update user (params + body)
exports.updateUserWithIdSchema = zod_1.z.object({
    params: exports.userIdSchema,
    body: exports.updateUserSchema
});
