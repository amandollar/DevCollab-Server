//Not used yet

import mongoose, { Document, Schema } from 'mongoose'


export interface IActivityLog extends Document {
  action: string
  user: mongoose.Types.ObjectId | string
  project: mongoose.Types.ObjectId | string

}

const ActivityLogSchema = new Schema<IActivityLog>({
  action: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true }
}, { timestamps: true })

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema)
