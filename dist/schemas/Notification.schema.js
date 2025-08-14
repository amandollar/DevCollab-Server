"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationSchema = exports.createNotificationSchema = void 0;
const zod_1 = require("zod");
// Reusable ObjectId validation (MongoDB ObjectId is 24 hex chars)
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");
// Notification Zod Schema
exports.createNotificationSchema = zod_1.z.object({
    user: objectIdSchema, // recipient
    actor: objectIdSchema, // who triggered
    message: zod_1.z
        .string()
        .min(1, "Message cannot be empty")
        .max(500, "Message too long"),
    read: zod_1.z.boolean().optional().default(false),
    type: zod_1.z.enum(["info", "invite", "comment"]),
});
// For updating an existing notification (partial, except ObjectId is required)
exports.updateNotificationSchema = zod_1.z.object({
    message: zod_1.z
        .string()
        .min(1, "Message cannot be empty")
        .max(500, "Message too long")
        .optional(),
    read: zod_1.z.boolean().optional(),
    type: zod_1.z.enum(["info", "invite", "comment"]).optional(),
});
