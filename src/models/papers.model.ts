import mongoose, { Document, Schema, Types } from 'mongoose';

interface IPaper extends Document {
  _id: Types.ObjectId;
  doi?: string;
  title: string;
  authors: string[];
  publicationDate: Date;
  journal: string;
  report: string; 
  citationCount: number;
  badges: string[]; 
  pdfLink: string;
  sourceLink: string;
  isOpenAccess?: boolean;
  isPreprint?: boolean;
}


const paperSchema = new Schema<IPaper>({
  doi: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  authors: [{
    type: String,
    required: true
  }],
  publicationDate: {
    type: Date,
    required: true
  },
  journal: {
    type: String,
    required: true
  },
  report: {
    type: String,
    required: true
  },
  citationCount: {
    type: Number,
    required: true,
    default: 0
  },
  badges: [{
    type: String
  }],
  pdfLink: {
    type: String,
    required: true
  },
  sourceLink: {
    type: String,
    required: true
  },

  isOpenAccess: {
    type: Boolean,
    default: false
  },
  isPreprint: {
    type: Boolean,
    default: false
  },

}, { timestamps: true } );

export const Paper = mongoose.model<IPaper>('Paper', paperSchema);
export type { IPaper };
