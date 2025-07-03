import { Request, Response } from 'express';
import { getUserStats, getPaperStats, getRecentUsers, getRecentPapers } from '../services/adminStats.service';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const userStats = await getUserStats();
    const paperStats = await getPaperStats();
    const recentUsers = await getRecentUsers();
    const recentPapers = await getRecentPapers();
    res.status(200).json({
      success: true,
      data: {
        userStats,
        paperStats,
        recentUsers,
        recentPapers,
      },
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
