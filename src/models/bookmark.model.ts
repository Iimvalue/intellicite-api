import mongoose, { Document, Schema, Types } from 'mongoose';

interface IBookmark extends Document {
  userId: Types.ObjectId;
  paperId: Types.ObjectId;
  personalNotes: string;
}

const bookmarkSchema = new Schema<IBookmark>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paperId: { type: Schema.Types.ObjectId, ref: 'Paper', required: true },
  personalNotes: { type: String, default: '' }
},{timestamps: true});

bookmarkSchema.index({ userId: 1, paperId: 1 }, { unique: true });

export const Bookmark = mongoose.model<IBookmark>('Bookmark', bookmarkSchema);
export type { IBookmark };
