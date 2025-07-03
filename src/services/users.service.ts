import { IUser } from '../models/users.model';
import { UserCollection } from '../models/users.model';




export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await UserCollection.findOne({ email });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return await UserCollection.findById(id);
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: 'user' | 'admin' = 'user'
): Promise<IUser> => {
  return await UserCollection.create({
    name,
    email,
    password,
    role,
  });
};

export const validateUserCredentials = async (
  email: string,
  inputPassword: string
): Promise<IUser | null> => {
  const user = await UserCollection.findOne({ email });
  if (!user) return null;

  const isMatch = await user.comparePassword(inputPassword);
  return isMatch ? user : null;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await UserCollection.find({});
};

export const updateUserById = async (
  id: string,
  update: Partial<{ name: string; email: string; role: 'user' | 'admin'; password: string }>
): Promise<IUser | null> => {
  const user = await UserCollection.findById(id);
  if (!user) return null;
  if (update.name !== undefined) user.name = update.name;
  if (update.email !== undefined) user.email = update.email;
  if (update.role !== undefined) user.role = update.role;
  if (update.password !== undefined) user.password = update.password;
  await user.save();
  return user;
};

export const deleteUserById = async (id: string): Promise<IUser | null> => {
  return await UserCollection.findByIdAndDelete(id);
};