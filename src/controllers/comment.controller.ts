import { Request, Response } from "express";
import Comments from "../models/Comments";
import Task from "../models/Task";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, task } = req.body;

    // Check if task exists
    const existingTask = await Task.findById(task);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = await Comments.create({
      content,
      task,
      author: req.user?._id, // assuming auth middleware sets req.user
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comments.findOneAndUpdate(
      { _id: id, author: req.user?._id },
      { content },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found or unauthorized" });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await Comments.findOneAndDelete({
      _id: id,
      author: req.user?._id,
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found or unauthorized" });
    }

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCommentsByTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const comments = await Comments.find({ task: taskId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
