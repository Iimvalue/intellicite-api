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

  try {
    const results = await getPapersWithReports(query, userId);
    res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    console.error('Search papers error:', error);
    
    if (error.message && error.message.includes('No papers found for query')) {
      res.status(404).json({ 
        success: false, 
        message: `No papers found for query: ${query}`,
        error: 'Semantic Scholar API may be rate limited. Please try again in a few minutes.'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error', 
        error: 'Failed to search papers. Please try again later.'
      });
    }
  }
};
