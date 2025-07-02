import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getPapersWithReports } from '../services/papers.service';

export const searchPapersHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const query = req.query.q as string;
  if (!query) {
    res.status(400).json({ success: false, message: 'Missing search query' });
    return;
  }

  const results = await getPapersWithReports(query, userId);
  res.status(200).json({ success: true, data: results });
};
