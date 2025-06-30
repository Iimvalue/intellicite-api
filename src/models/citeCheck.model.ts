// import mongoose, { Document, Schema, Types } from 'mongoose';

// interface ICiteCheck extends Document {
//   _id: Types.ObjectId;
//   userId: Types.ObjectId;
//   inputText: string; 
//   result: string; 
//   checkedAt: Date;
// }

// const citeCheckSchema = new Schema<ICiteCheck>({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   inputText: {
//     type: String,
//     required: true
//   },
//   result: {
//     type: String,
//     required: true
//   },
//   checkedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export const CiteCheck = mongoose.model<ICiteCheck>('CiteCheckCollection', citeCheckSchema);
// export type { ICiteCheck };
