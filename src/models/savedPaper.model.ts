
import mongoose, { Document, Schema, Types } from 'mongoose';

interface ISavedPaper extends Document {
  userId: Types.ObjectId;
  paperId: Types.ObjectId;
  personalNotes: string;
}

const savedPaperSchema = new Schema<ISavedPaper>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paperId: { type: Schema.Types.ObjectId, ref: 'Paper', required: true },
  personalNotes: { type: String, default: '' }
},{timestamps: true});

savedPaperSchema.index({ userId: 1, paperId: 1 }, { unique: true });

export const SavedPaper = mongoose.model<ISavedPaper>('SavedPaper', savedPaperSchema);
export type { ISavedPaper };