import mongoose, { Document, Schema } from 'mongoose'
import ActivityLog from './ActivityLog'
import Chat from './Chat'
import CollaborationRequest from './CollaborationRequest'
import Notification from './Notification'


export interface IProject extends Document {
  title: string
  description: string
  owner: mongoose.Types.ObjectId | string
  collaborators: (mongoose.Types.ObjectId | string)[]
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })


ProjectSchema.pre("findOneAndDelete", async function (next) {
  const filter = this.getFilter();
  const projectId = filter._id;

  if (!projectId) return next();

  await ActivityLog.deleteMany({project:projectId});
  await Chat.deleteMany({project:projectId});
  await CollaborationRequest.deleteMany({project:projectId});

  next();
});


export default mongoose.model<IProject>('Project', ProjectSchema)