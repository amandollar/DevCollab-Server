import mongoose, { Document, Schema } from "mongoose";

export interface ICollaborationRequest extends Document {
  sender: mongoose.Types.ObjectId | string;
  receiver: mongoose.Types.ObjectId | string;
  project: mongoose.Types.ObjectId | string;
  status: "pending" | "accepted" | "rejected";
}

const CollaborationRequestSchema = new Schema<ICollaborationRequest>(
  {
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      required: true,
    },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICollaborationRequest>(
  "CollaborationRequest",
  CollaborationRequestSchema
);
