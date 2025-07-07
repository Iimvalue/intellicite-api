import { Request, Response } from 'express';
import { deletePaperById, getAllPapers } from '../services/adminPaper.service';

export const adminDeletePaper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const paper = await deletePaperById(id);
    if (!paper) {
      res.status(404).json({ success: false, message: 'Paper not found' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Paper deleted successfully',
      data: { paper },
    });
  } catch (error) {
    console.error('Admin delete paper error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const adminListAllPapers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const papers = await getAllPapers();
    res.status(200).json({
      success: true,
      data: { papers },
    });
  } catch (error) {
    console.error('Admin list all papers error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
