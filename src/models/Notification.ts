import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId | string; // recipient
  actor: mongoose.Types.ObjectId | string; // who triggered
  message: string;
  read: boolean;
  type: 'info' | 'invite' | 'comment';
}

const NotificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['info', 'invite', 'comment'], required: true }
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);
