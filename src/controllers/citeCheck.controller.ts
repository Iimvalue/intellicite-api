import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { saveCiteCheckResult, getUserCiteChecks, getCiteCheckById } from '../services/citeCheck.service';

/**
 * Create AI-based citation analysis
 */
export const createCiteCheck = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { query, paperId, paperContent } = req.body;

    if (!query || !paperId || !paperContent) {
      res.status(400).json({ message: 'Missing query, paperId, or paperContent' });
      return;
    }

    // Mock AI response (Replace this with real AI analysis)
    const score = Math.floor(Math.random() * 40 + 60); // mock: score between 60-100
    const aiSummary = `The paper is ${score}% relevant to the query "${query}" based on topic similarity.`;

    const newCheck = await saveCiteCheckResult({
      userId,
      query,
      paperId,
      score,
      aiSummary
    });

    res.status(201).json(newCheck);
  } catch (error) {
    console.error('Error creating cite check:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all cite checks for user
 */
export const getCiteChecks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const checks = await getUserCiteChecks(userId);
    res.status(200).json(checks);
  } catch (error) {
    console.error('Error fetching cite checks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a single cite check
 */
export const getSingleCiteCheck = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { checkId } = req.params;
    const check = await getCiteCheckById(userId, checkId);

    if (!check) {
      res.status(404).json({ message: 'Cite check not found' });
      return;
    }

    res.status(200).json(check);
  } catch (error) {
    console.error('Error fetching single cite check:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};