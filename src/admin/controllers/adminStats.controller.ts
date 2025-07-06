import { Request, Response } from 'express';
import { 
  getUserStats, 
  getPaperStats, 
  getReportStats,
  getRecentUsers, 
  getRecentPapers,
  getRecentReports,
  getRecentUsersCount,
  getRecentPapersCount,
  getRecentReportsCount
} from '../services/adminStats.service';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const userStats = await getUserStats();
    const paperStats = await getPaperStats();
    const reportStats = await getReportStats();
    const recentUsersCount = await getRecentUsersCount();
    const recentPapersCount = await getRecentPapersCount();
    const recentReportsCount = await getRecentReportsCount();
    const recentUsers = await getRecentUsers();
    const recentPapers = await getRecentPapers();
    const recentReports = await getRecentReports();
    
    res.status(200).json({
      success: true,
      data: {
        userStats,
        paperStats,
        reportStats,
        recentCounts: {
          users: recentUsersCount,
          papers: recentPapersCount,
          reports: recentReportsCount,
        },
        recentUsers,
        recentPapers,
        recentReports,
      },
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
