import mongoose, { Schema, Document, Types } from 'mongoose';


export interface IUserHistoryResult {
  paper: Types.ObjectId;
  report: Types.ObjectId;
}

export interface IUserHistory extends Document {
  userId: Types.ObjectId;
  query: string;
  results: IUserHistoryResult[];
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
  results: [
    {
      paper: {
        type: Schema.Types.ObjectId,
        ref: 'Paper',
        required: true,
      },
      report: {
        type: Schema.Types.ObjectId,
        ref: 'PaperReport',
        required: true,
      },
    },
  ],
},
{
  timestamps: true, });

export const UserHistory = mongoose.model<IUserHistory>(
  'UserHistory',
  UserHistorySchema
);
