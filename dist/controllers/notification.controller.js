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
exports.updateNotification = exports.createNotification = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = new Notification_1.default(req.body);
        yield notification.save();
        res.status(201).json({ message: "Notification created successfully", notification });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating notification', error });
    }
});
exports.createNotification = createNotification;
const updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const notification = yield Notification_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.json({ message: "Notification updated successfully", notification });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating notification", error });
    }
});
exports.updateNotification = updateNotification;
