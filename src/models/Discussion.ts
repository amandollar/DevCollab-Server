import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscussion extends Document {
  name: string;
  description: string;
  topics: string[];
  discussion: string[];
  createdAt: Date;
  updatedAt: Date;
}

const discussionSchema = new Schema<IDiscussion>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  topics: {
    type: [String],
    default: ['Next.js', 'React', 'Interview Experience', 'JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'Web Development', 'Career Advice', 'Learning Resources']
  },
  discussion: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Index for better query performance
discussionSchema.index({ name: 1 });
discussionSchema.index({ topics: 1 });

export default mongoose.model<IDiscussion>('Discussion', discussionSchema);
