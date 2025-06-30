import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserHistory extends Document {
  userId: Types.ObjectId;
  query: string;
  searchedAt: Date;
  retrievedPaperIds: Types.ObjectId[]; // Talal you can use mock data to test this , until I finish the paper retrieval feature. don't create a paper logic yet.
}

const UserHistorySchema = new Schema<IUserHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  searchedAt: {
    type: Date,
    default: Date.now,
  },
  retrievedPaperIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Paper',
    },
  ],
});

export const UserHistory = mongoose.model<IUserHistory>(
  'UserHistory',
  UserHistorySchema
);
