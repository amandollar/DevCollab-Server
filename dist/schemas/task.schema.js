"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const objectIdSchema = zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), { message: "Invalid ObjectId" });
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    assignees: zod_1.z.array(objectIdSchema).optional(),
    project: objectIdSchema.optional(),
    createdBy: objectIdSchema.optional(),
    dueDate: zod_1.z.string().datetime().optional(), // or z.coerce.date().optional()
    priority: zod_1.z.enum(["low", "medium", "high"]).optional(),
    comments: zod_1.z.array(objectIdSchema).optional()
});
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").optional(),
    description: zod_1.z.string().min(1, "Description is required").optional(),
    assignees: zod_1.z.array(objectIdSchema).optional(),
    project: objectIdSchema.optional(),
    createdBy: objectIdSchema.optional(),
    dueDate: zod_1.z.coerce.date().optional(),
    priority: zod_1.z.enum(["low", "medium", "high"]).optional(),
    comments: zod_1.z.array(objectIdSchema).optional(),
});
