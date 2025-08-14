"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const objectId = zod_1.z
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    owner: objectId,
    collborators: zod_1.z.array(objectId).optional(),
});
exports.updateProjectSchema = zod_1.z.object({
    params: zod_1.z.object({
        projectId: objectId,
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().min(1).optional(),
        collborators: zod_1.z.array(objectId).optional()
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "Atlease one field is updated"
    })
});
