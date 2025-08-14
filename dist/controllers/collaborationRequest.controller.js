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
exports.getPendingUserRequestForUser = exports.rejectRequest = exports.acceptRequest = exports.sendRequest = void 0;
const express_1 = require("express");
const CollaborationRequest_1 = __importDefault(require("../models/CollaborationRequest"));
const Project_1 = __importDefault(require("../models/Project"));
//Send Request
const sendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sender, receiver, project } = req.params;
    if (sender === receiver) {
        return res
            .status(400)
            .json({ message: "Can not send request to yourself" });
    }
    try {
        const existingRequest = yield CollaborationRequest_1.default.findOne({
            sender,
            receiver,
            project,
        });
        if (existingRequest) {
            return express_1.response.json({ message: "Request already sent" });
        }
        const newRequest = yield CollaborationRequest_1.default.create({
            sender,
            receiver,
            project,
            status: "pending",
        });
        res.status(201).json({ message: "Request Sent", data: newRequest });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.sendRequest = sendRequest;
//Accept Request
const acceptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Request ID is required" });
    }
    try {
        const request = yield CollaborationRequest_1.default.findById(id);
        if (!request || request.status !== "pending") {
            return res
                .status(404)
                .json({ message: "Request not found or already handled" });
        }
        //Add reciever to project collborators
        yield Project_1.default.findByIdAndUpdate(request.project, {
            $addToSet: { collaborators: request.receiver },
        });
        request.status = "accepted";
        yield request.save();
        res.status(200).json({ message: "Request accepted", data: request });
    }
    catch (error) {
        res.status(500).json({ message: "Error accepting request", error });
    }
});
exports.acceptRequest = acceptRequest;
//Reject Request
const rejectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Request ID is required" });
    }
    try {
        const request = yield CollaborationRequest_1.default.findById(id);
        if (!request || request.status !== "pending") {
            return res
                .status(404)
                .json({ message: "Request not found or already handled" });
        }
        request.status = "rejected";
        yield request.save();
        res.status(200).json({ message: "Request accepted", data: request });
    }
    catch (error) {
        res.status(500).json({ message: "Error accepting request", error });
    }
});
exports.rejectRequest = rejectRequest;
//Get Pending Request for a User
const getPendingUserRequestForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "Request ID is required" });
    }
    try {
        const requests = yield CollaborationRequest_1.default.find({
            receiver: userId,
            status: "pending",
        })
            .populate("sender", "name email image")
            .populate("project", "title");
        res.status(200).json({ message: "Pending Request", data: requests });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching request", error });
    }
});
exports.getPendingUserRequestForUser = getPendingUserRequestForUser;
