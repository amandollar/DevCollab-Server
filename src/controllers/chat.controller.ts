import { Request, Response } from "express";
import Chat from "../models/Chat";




export const createChat = async (req: Request, res: Response) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).json({ message: "Chat created successfully", chat });
  } catch (error) {
    res.status(500).json({ message: "Error creating chat", error });
  }
};


export const updateChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const chat = await Chat.findByIdAndUpdate(id, updates, { new: true });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json({ message: "Chat updated successfully", chat });
  } catch (error) {
    res.status(500).json({ message: "Error updating chat", error });
  }
};


export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findByIdAndDelete(id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json({ message: "Chat deleted successfully", chat });
  } catch (error) {
    res.status(500).json({ message: "Error deleting chat", error });
  }
};