import { UserCollection } from '../../models/users.model';
import { PaperCollection } from '../../models/papers.model';
import { PaperReport } from '../../models/PaperReport.model';

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

export const getReportStats = async () => {
  const total = await PaperReport.countDocuments();
  return { total };
};
export const getRecentPapersCount = async () => {
  return await PaperCollection.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  });
};
export const getRecentUsersCount = async () => {
  return await UserCollection.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  });
};

export const getRecentReportsCount = async () => {
  return await PaperReport.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  });
};

export const getRecentUsers = async (limit = 5) => {
  return await UserCollection.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-password');
};

export const getRecentPapers = async (limit = 5) => {
  return await PaperCollection.find().sort({ createdAt: -1 }).limit(limit);
};

export const getRecentReports = async (limit = 5) => {
  return await PaperReport.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .populate('paperId', 'title');
};
