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
  password: string
): Promise<IUser> => {
  return await UserCollection.create({
    name,
    email,
    password,
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
}