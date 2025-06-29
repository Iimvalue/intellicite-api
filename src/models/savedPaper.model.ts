// import mongoose, { Document, Schema, Types } from 'mongoose';

// interface ISavedPaper extends Document {
//   _id: Types.ObjectId;
//   userId: Types.ObjectId;
//   paperId: Types.ObjectId;
//   savedAt: Date;
//   personalNotes: string;
// }

// const savedPaperSchema = new Schema<ISavedPaper>({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   paperId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Paper',
//     required: true
//   },
//   savedAt: {
//     type: Date,
//     default: Date.now
//   },
//   personalNotes: {
//     type: String,
//     default: ''
//   }
// });

// savedPaperSchema.index({ userId: 1, paperId: 1 }, { unique: true });

// export const SavedPaper = mongoose.model<ISavedPaper>('SavedPaper', savedPaperSchema);
// export type { ISavedPaper };

import mongoose, { Document, Schema, Types } from 'mongoose';

interface ISavedPaper extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  paperId: Types.ObjectId;
  savedAt: Date;
  personalNotes: string;
}

const savedPaperSchema = new Schema<ISavedPaper>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paperId: { type: Schema.Types.ObjectId, ref: 'Paper', required: true },
  savedAt: { type: Date, default: Date.now },
  personalNotes: { type: String, default: '' }
});

savedPaperSchema.index({ userId: 1, paperId: 1 }, { unique: true });

export const SavedPaper = mongoose.model<ISavedPaper>('SavedPaper', savedPaperSchema);
export type { ISavedPaper };