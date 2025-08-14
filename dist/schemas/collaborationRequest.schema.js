"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollaborationRequestSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
// Helper to validate MongoDB ObjectId
const objectId = zod_1.z
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
exports.createCollaborationRequestSchema = zod_1.z.object({
    sender: objectId,
    receiver: objectId,
    project: objectId,
    status: zod_1.z.enum(["pending", "accepted", "rejected"]).default("pending"),
});
