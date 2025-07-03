import { UserCollection } from '../../models/users.model';

export const getAllUsers = async () => {
  return await UserCollection.find();
};

export const updateUserById = async (
  id: string,
  update: Partial<{ name: string; email: string; role: 'user' | 'admin'; password: string }>
) => {
  const user = await UserCollection.findById(id);
  if (!user) return null;
  if (update.name !== undefined) user.name = update.name;
  if (update.email !== undefined) user.email = update.email;
  if (update.role !== undefined) user.role = update.role;
  if (update.password !== undefined) user.password = update.password;
  await user.save();
  return user;
};

export const deleteUserById = async (id: string) => {
  return await UserCollection.findByIdAndDelete(id);
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: 'user' | 'admin' = 'user'
) => {
  return await UserCollection.create({
    name,
    email,
    password,
    role,
  });
};

