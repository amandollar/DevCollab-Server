import { Request, Response } from "express";
import Discussion from "../models/Discussion";

export const createDiscussion = async (req: Request, res: Response) => {
  try {
    const { name, description, topics, discussion } = req.body;
    
    // Create discussion
    const newDiscussion = await Discussion.create({
      name,
      description,
      topics: topics || [], // Will use default topics if none provided
      discussion: discussion || []
    });

    res.status(201).json({
      message: "Discussion created successfully",
      discussion: newDiscussion,
    });
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateDiscussion = async (req: Request, res: Response) => {
  try {
    const { discussionId } = req.params;
    const { name, description, topics, discussion } = req.body;
    
    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      discussionId,
      { name, description, topics, discussion },
      { new: true, runValidators: true }
    );

    if (!updatedDiscussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    res
      .status(200)
      .json({ message: "Discussion updated successfully", data: updatedDiscussion });
  } catch (error) {
    res.status(500).json({ message: "Error updating discussion", error });
  }
};

export const getDiscussions = async (req: Request, res: Response) => {
  try {
    const discussions = await Discussion.find({});
    
    res
      .status(200)
      .json({ message: "Discussions fetched successfully", data: discussions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching discussions", error });
  }
};

export const getDiscussionById = async (req: Request, res: Response) => {
  try {
    const { discussionId } = req.params;
    if (!discussionId) {
      return res.status(400).json({ message: "Discussion Id is required" });
    }

    const discussion = await Discussion.findById(discussionId);
    
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    res
      .status(200)
      .json({ message: "Discussion fetched successfully", data: discussion });
  } catch (error) {
    res.status(500).json({ message: "Error fetching discussion", error });
  }
};

export const addTopic = async (req: Request, res: Response) => {
  try {
    const { discussionId } = req.params;
    const { topic } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // Check if topic already exists
    if (discussion.topics.includes(topic)) {
      return res.status(400).json({ message: "Topic already exists" });
    }

    discussion.topics.push(topic);
    await discussion.save();

    res.status(200).json({ 
      message: "Topic added successfully", 
      data: discussion 
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding topic", error });
  }
};

export const addDiscussionToTopic = async (req: Request, res: Response) => {
  try {
    const { discussionId } = req.params;
    const { discussion: discussionText } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    discussion.discussion.push(discussionText);
    await discussion.save();

    res.status(200).json({ 
      message: "Discussion added successfully", 
      data: discussion 
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding discussion", error });
  }
};

export const deleteDiscussion = async (req: Request, res: Response) => {
  try {
    const { discussionId } = req.params;

    if (!discussionId) {
      return res
        .status(400)
        .json({ message: "Discussion id is required to delete the discussion" });
    }

    const deletedDiscussion = await Discussion.findByIdAndDelete(discussionId);

    if (!deletedDiscussion) {
      return res.status(400).json({ message: "Discussion not found" });
    }

    res.status(200).json({ message: "Discussion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting discussion", error });
  }
};
