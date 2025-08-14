import { Request, response, Response } from "express";
import CollaborationRequest from "../models/CollaborationRequest";
import Project from "../models/Project";


//Send Request
export const sendRequest = async (req: Request, res: Response) => {
  const { sender, receiver, project } = req.params;

  if (sender === receiver) {
    return res
      .status(400)
      .json({ message: "Can not send request to yourself" });
  }

  try {
    const existingRequest = await CollaborationRequest.findOne({
      sender,
      receiver,
      project,
    });
    if (existingRequest) {
      return response.json({ message: "Request already sent" });
    }

    const newRequest = await CollaborationRequest.create({
      sender,
      receiver,
      project,
      status: "pending",
    });
    res.status(201).json({ message: "Request Sent", data: newRequest });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//Accept Request

export const acceptRequest = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Request ID is required" });
  }

  try {
    const request = await CollaborationRequest.findById(id);
    if (!request || request.status !== "pending") {
      return res
        .status(404)
        .json({ message: "Request not found or already handled" });
    }

    //Add reciever to project collborators

    await Project.findByIdAndUpdate(request.project, {
      $addToSet: { collaborators: request.receiver },
    });

    request.status = "accepted";
    await request.save();

    res.status(200).json({ message: "Request accepted", data: request });
  } catch (error) {
    res.status(500).json({ message: "Error accepting request", error });
  }
};

//Reject Request
export const rejectRequest = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Request ID is required" });
  }

  try {
    const request = await CollaborationRequest.findById(id);
    if (!request || request.status !== "pending") {
      return res
        .status(404)
        .json({ message: "Request not found or already handled" });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Request accepted", data: request });
  } catch (error) {
    res.status(500).json({ message: "Error accepting request", error });
  }
};

//Get Pending Request for a User

export const getPendingUserRequestForUser = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Request ID is required" });
  }

  try {
    const requests = await CollaborationRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "name email image")
      .populate("project", "title");

    res.status(200).json({ message: "Pending Request", data: requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching request", error });
  }
};
