import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICiteCheck extends Document {
  userId: Types.ObjectId;
  query: string;
  paperId: Types.ObjectId;

  aiSummary: string;
  checkedAt: Date;
}

const citeCheckSchema = new Schema<ICiteCheck>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  query: { type: String, required: true },
  paperId: { type: Schema.Types.ObjectId, ref: "Paper", required: true },
  aiSummary: { type: String, required: true },
  checkedAt: { type: Date, default: Date.now },
});

export const CiteCheck = mongoose.model<ICiteCheck>(
  "CiteCheck",
  citeCheckSchema
);
