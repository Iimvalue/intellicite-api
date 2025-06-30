import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPaperReport extends Document {
  userId: Types.ObjectId;
  paperId: Types.ObjectId;
  report: string;
  generatedAt: Date;
}

const paperReportSchema = new Schema<IPaperReport>({
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
  report: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const PaperReport = mongoose.model<IPaperReport>('PaperReport', paperReportSchema);
