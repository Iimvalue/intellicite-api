import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserHistory extends Document {
  userId: Types.ObjectId;
  query: string; // The search query comes from the user , from the frontend.
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
  retrievedPaperIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Paper',
    },
  ],
},
{
  timestamps: true, });

export const UserHistory = mongoose.model<IUserHistory>(
  'UserHistory',
  UserHistorySchema
);
