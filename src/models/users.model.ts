import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  comparePassword: (input: string) => Promise<boolean>;
  createdAt?: Date;
  updatedAt?: Date;

  userData: {
    id: Types.ObjectId;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
  };
}


const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
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
    role: this.role,
    createdAt: this.createdAt,  
    updatedAt: this.updatedAt   
  };
});


function removePassword(doc: any, ret: any) {
  delete ret.password;
  return ret;
}

userSchema.set('toJSON', { virtuals: true, transform: removePassword });
userSchema.set('toObject', { virtuals: true, transform: removePassword });

export const UserCollection = mongoose.model<IUser>('User', userSchema);
