"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const user_schema_1 = require("../schemas/user.schema");
const mutlerMiddleware_1 = __importDefault(require("../middleware/mutlerMiddleware"));
const authRouter = (0, express_1.Router)();
// Public routes
authRouter.post('/register', mutlerMiddleware_1.default.single('image'), (0, validation_middleware_1.validateSchema)(user_schema_1.registerSchema), auth_controller_1.register);
authRouter.post('/login', (0, validation_middleware_1.validateSchema)(user_schema_1.loginSchema), auth_controller_1.login);
authRouter.get('/verify-email/:token', auth_controller_1.verifyEmail);
authRouter.post('/resend-verification', (0, validation_middleware_1.validateSchema)(user_schema_1.resendVerificationSchema), auth_controller_1.resendVerificationEmail);
// Protected routes (require authentication)
authRouter.get('/profile', auth_middleware_1.authenticateToken, auth_controller_1.getCurrentUser);
authRouter.get('/users/:id', auth_middleware_1.authenticateToken, (0, validation_middleware_1.validateSchema)(user_schema_1.userIdSchema), auth_controller_1.getUserById);
authRouter.put('/users/:id', auth_middleware_1.authenticateToken, mutlerMiddleware_1.default.single('image'), (0, validation_middleware_1.validateSchema)(user_schema_1.updateUserSchema), auth_controller_1.updateUserById);
authRouter.delete('/users/:id', auth_middleware_1.authenticateToken, (0, validation_middleware_1.validateSchema)(user_schema_1.userIdSchema), auth_controller_1.deleteUserById);
exports.default = authRouter;
