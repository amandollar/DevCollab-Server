import mongoose, { Document, Schema } from 'mongoose'


export interface IChat extends Document {
  project: mongoose.Types.ObjectId | string
  sender: mongoose.Types.ObjectId | string
  message: string
}

const ChatSchema = new Schema<IChat>({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model<IChat>('Chat', ChatSchema)
