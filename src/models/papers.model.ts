import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPaper extends Document {
  _id: Types.ObjectId;
  doi?: string;
  title: string;
  authors: string[];
  publicationDate: Date;
  journal: string;
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
    required: true,
  },
  title: {
    type: String,
  },
  authors: [{
    type: String,
  }],
  publicationDate: {
    type: Date,
  },
  journal: {
    type: String,
  }, 
  citationCount: {
    type: Number,
    required: false,
    default: 0
  },
  badges: [{
    type: String
  }],
  pdfLink: {
    type: String,
  },
  sourceLink: {
    type: String,
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
