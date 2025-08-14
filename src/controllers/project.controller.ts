import { Request, Response } from "express";
import Project from "../models/Project";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    // Create project
    const newProject = await Project.create({
      title,
      description,
      owner: req.user?._id, // comes from auth middleware
    });

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res
      .status(200)
      .json({ message: "Project updated successfully", data: updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const projects = await Project.find({ owner: userId });
    res
      .status(200)
      .json({ message: "Project fetch successfully", data: projects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ message: "Project Id is required" });
    }

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user?.id,
    });
    res
      .status(200)
      .json({ message: "Project fetch successfull", data: project });
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error });
  }
};

export const removeProjectMember = async (req: Request, res: Response) => {
  try {
    const { projectId, collaboratorId } = req.params;
    if (!projectId || !collaboratorId) {
      return res
        .status(400)
        .json({ message: "Both projectId and collaboratorId is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user?.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    project.collaborators = project.collaborators.filter(
      (collaborator: any) => collaborator._id !== collaboratorId
    );

    await project.save();
    res.status(200).json({message:'Collaborator removed successfully'})
  } catch (error) {
    res.status(500).json({ message: "Error removing the memeber", error });
  }
};


export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res
        .status(400)
        .json({ message: "Project id is required to update the project" });
    }

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(400).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};
