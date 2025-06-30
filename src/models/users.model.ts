import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

interface ISearchHistory {
  query: string;
  date: Date;
  results: Types.ObjectId[];
}

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  searchHistory: ISearchHistory[];
  comparePassword: (input: string) => Promise<boolean>;
  userData: {
    id: Types.ObjectId;
    name: string;
    email: string;
    searchHistory: ISearchHistory[];
  };
}

const searchHistorySchema = new Schema<ISearchHistory>({
  query: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  results: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Paper',
    },
  ],
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    searchHistory: [searchHistorySchema],
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

userSchema.methods.comparePassword = async function (input: string): Promise<boolean> {
  return await bcrypt.compare(input, this.password);
};

userSchema.virtual('userData').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    searchHistory: this.searchHistory,
  };
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export const UserCollection = mongoose.model<IUser>('User', userSchema);
export type { IUser, ISearchHistory };
