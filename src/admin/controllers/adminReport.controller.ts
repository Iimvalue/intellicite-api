import { Request, Response } from 'express';
import { getAllPaperReports } from '../services/adminReport.service';

export const adminListAllPaperReports = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reports = await getAllPaperReports();
    res.status(200).json({
      success: true,
      data: { reports },
    });
  } catch (error) {
    console.error('Admin list all paper reports error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
