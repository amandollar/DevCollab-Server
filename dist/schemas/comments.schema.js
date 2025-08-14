"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentSchema = exports.updateCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, "Comment content is required"),
        task: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid task ID"),
    }),
});
exports.updateCommentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID"),
    }),
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, "Comment content is required"),
    }),
});
exports.deleteCommentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID"),
    }),
});
