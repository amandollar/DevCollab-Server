import { Request, Response } from "express";
import Notification from "../models/Notification";



export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({message: "Notification created successfully", notification });
  } catch (error) {
    res.status(500).json({message:'Error creating notification',error });
  }
};


export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const notification = await Notification.findByIdAndUpdate(id, updates, { new: true });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification updated successfully", notification });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};


