import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPaperReport extends Document {
  userId: Types.ObjectId;
  paperId: Types.ObjectId;
  report: string;
  query?: string;
  type?: 'citeCheck' | 'search';
}

const paperReportSchema = new Schema<IPaperReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paperId: {
      type: Schema.Types.ObjectId,
      ref: 'Paper',
      required: true,
    },
    query: {
      type: String,
      required: false,
    },
    report: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['search', 'doi'],
      default: 'search',
    },
  },
  {
    timestamps: true,
  }
);

export const PaperReport = mongoose.model<IPaperReport>(
  'PaperReport',
  paperReportSchema
);
