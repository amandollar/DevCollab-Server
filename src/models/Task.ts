import mongoose, { Document, Schema } from 'mongoose'

export interface ITask extends Document {
  title: string
  description: string
  assignees?: mongoose.Types.ObjectId[]
  project: mongoose.Types.ObjectId,
  createdBy: mongoose.Types.ObjectId,
  dueDate?: Date,
  priority?: 'low' | 'medium' | 'high'
  comments: mongoose.Types.ObjectId[]
}

const Task = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true })

export default mongoose.model<ITask>('Task', Task)