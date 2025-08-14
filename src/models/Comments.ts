import mongoose, { Document, Schema } from 'mongoose'

export interface IComment extends Document {
  content: string,
  author: mongoose.Types.ObjectId | string,
  task: mongoose.Types.ObjectId | string
}

const CommentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: Schema.Types.ObjectId, ref: 'Task', required: true }
}, { timestamps: true })

export default mongoose.model<IComment>('Comment', CommentSchema)