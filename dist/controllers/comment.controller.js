"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsByTask = exports.deleteComment = exports.updateComment = exports.createComment = void 0;
const Comments_1 = __importDefault(require("../models/Comments"));
const Task_1 = __importDefault(require("../models/Task"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content, task } = req.body;
        // Check if task exists
        const existingTask = yield Task_1.default.findById(task);
        if (!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        const comment = yield Comments_1.default.create({
            content,
            task,
            author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, // assuming auth middleware sets req.user
        });
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.createComment = createComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { content } = req.body;
        const comment = yield Comments_1.default.findOneAndUpdate({ _id: id, author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, { content }, { new: true });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found or unauthorized" });
        }
        res.json(comment);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const comment = yield Comments_1.default.findOneAndDelete({
            _id: id,
            author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found or unauthorized" });
        }
        res.json({ message: "Comment deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.deleteComment = deleteComment;
const getCommentsByTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const comments = yield Comments_1.default.find({ task: taskId })
            .populate("author", "name email")
            .sort({ createdAt: -1 });
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getCommentsByTask = getCommentsByTask;
