import mongoose, { Document, Schema } from "mongoose";
import Project from "./Project";
import Notification from "./Notification";
import Comments from "./Comments";


export interface IUser extends Document {
  name: string;
  image: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationExpires?: Date;
  projects?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

UserSchema.pre("findOneAndDelete", async function (next) {
  const filter = this.getFilter();
  const userId = filter._id;

  if (!userId) return next();

  await Project.deleteMany({ owner: userId });
  await Notification.deleteMany({ user: userId });
  await Comments.deleteMany({ user: userId });
 
  next();
});
export default mongoose.model<IUser>("User", UserSchema);
