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
exports.deleteProject = exports.removeProjectMember = exports.getProjectById = exports.getProjects = exports.updateProject = exports.createProject = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description } = req.body;
        // Create project
        const newProject = yield Project_1.default.create({
            title,
            description,
            owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, // comes from auth middleware
        });
        res.status(201).json({
            message: "Project created successfully",
            project: newProject,
        });
    }
    catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.createProject = createProject;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const { title, description } = req.body;
        const updatedProject = yield Project_1.default.findByIdAndUpdate(projectId, { title, description }, { new: true, runValidators: true });
        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res
            .status(200)
            .json({ message: "Project updated successfully", data: updatedProject });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating project", error });
    }
});
exports.updateProject = updateProject;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const projects = yield Project_1.default.find({ owner: userId });
        res
            .status(200)
            .json({ message: "Project fetch successfully", data: projects });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
    }
});
exports.getProjects = getProjects;
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { projectId } = req.params;
        if (!projectId) {
            return res.status(400).json({ message: "Project Id is required" });
        }
        const project = yield Project_1.default.findOne({
            _id: projectId,
            owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        res
            .status(200)
            .json({ message: "Project fetch successfull", data: project });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching project", error });
    }
});
exports.getProjectById = getProjectById;
const removeProjectMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { projectId, collaboratorId } = req.params;
        if (!projectId || !collaboratorId) {
            return res
                .status(400)
                .json({ message: "Both projectId and collaboratorId is required" });
        }
        const project = yield Project_1.default.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (project.owner.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString())) {
            return res.status(403).json({ message: "Not authorized" });
        }
        project.collaborators = project.collaborators.filter((collaborator) => collaborator._id !== collaboratorId);
        yield project.save();
        res.status(200).json({ message: 'Collaborator removed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: "Error removing the memeber", error });
    }
});
exports.removeProjectMember = removeProjectMember;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            return res
                .status(400)
                .json({ message: "Project id is required to update the project" });
        }
        const deletedProject = yield Project_1.default.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return res.status(400).json({ message: "Project not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
    }
});
exports.deleteProject = deleteProject;
