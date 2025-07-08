import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPaper extends Document {
  doi?: string;
  title: string;
  authors: string[];
  publicationDate: Date;
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  citationCount: number;
  badges: string[];
  pdfLink: string;
  sourceLink: string;
  isOpenAccess?: boolean;
  isPreprint?: boolean;
  abstract?: string;
  keywords?: string[];
  language?: string;
  type?: string;
  license?: string;
  publisher?: string;
  issn?: string[];
  fwci?: number;
  citationPercentile?: number;
  isHighlyCited?: boolean;
  isInTop10Percent?: boolean;
  authorCount?: number;
  institutionCount?: number;
  countryCount?: number;
  isRetracted?: boolean;
  hasFulltext?: boolean;
  topics?: Array<{
    id: string;
    name: string;
    score: number;
    field?: string;
    subfield?: string;
  }>;
  funders?: Array<{
    id: string;
    name: string;
    awardId?: string;
  }>;
  venueType?: string;
  venueRank?: string;
  authorInstitutions?: Array<{
    authorName: string;
    institutions: string[];
    countries: string[];
  }>;
  citationsByYear?: Array<{
    year: number;
    count: number;
  }>;
  relatedWorks?: string[];
  referencedWorks?: string[];
}


const paperSchema = new Schema<IPaper>({
  doi: {
    type: String,
    required: false,
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
  volume: {
    type: String,
    required: false
  },
  issue: {
    type: String,
    required: false
  },
  pages: {
    type: String,
    required: false
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

  abstract: {
    type: String,
    required: false
  },
  keywords: [{
    type: String
  }],
  language: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  license: {
    type: String,
    required: false
  },
  publisher: {
    type: String,
    required: false
  },
  issn: [{
    type: String
  }],

  fwci: {
    type: Number,
    required: false
  },
  citationPercentile: {
    type: Number,
    required: false
  },
  isHighlyCited: {
    type: Boolean,
    default: false
  },
  isInTop10Percent: {
    type: Boolean,
    default: false
  },
  authorCount: {
    type: Number,
    required: false
  },
  institutionCount: {
    type: Number,
    required: false
  },
  countryCount: {
    type: Number,
    required: false
  },
  isRetracted: {
    type: Boolean,
    default: false
  },
  hasFulltext: {
    type: Boolean,
    default: false
  },
  topics: [{
    id: String,
    name: String,
    score: Number,
    field: String,
    subfield: String
  }],
  funders: [{
    id: String,
    name: String,
    awardId: String
  }],
  venueType: {
    type: String,
    required: false
  },
  venueRank: {
    type: String,
    required: false
  },
  authorInstitutions: [{
    authorName: String,
    institutions: [String],
    countries: [String]
  }],
  citationsByYear: [{
    year: Number,
    count: Number
  }],
  relatedWorks: [{
    type: String
  }],
  referencedWorks: [{
    type: String
  }]
}, { timestamps: true });

// export the paper model
export const Paper = mongoose.model<IPaper>('Paper', paperSchema);
export const PaperCollection = Paper;
