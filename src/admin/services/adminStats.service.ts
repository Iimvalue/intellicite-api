import { UserCollection } from '../../models/users.model';
import { PaperCollection } from '../../models/papers.model';

export const getUserStats = async () => {
  const total = await UserCollection.countDocuments();
  const admins = await UserCollection.countDocuments({ role: 'admin' });
  const users = await UserCollection.countDocuments({ role: 'user' });
  return { total, admins, users };
};

export const getPaperStats = async () => {
  const total = await PaperCollection.countDocuments();
  return { total };
};

export const getRecentUsers = async (limit = 5) => {
  return await UserCollection.find().sort({ createdAt: -1 }).limit(limit).select('-password');
};

export const getRecentPapers = async (limit = 5) => {
  return await PaperCollection.find().sort({ createdAt: -1 }).limit(limit);
};
