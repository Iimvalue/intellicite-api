import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  savePaper,
  removeSavedPaper,
  getSavedPapersByUser,
  updatePersonalNotes
} from '../services/savedPaper.services';

export const addSavedPaper = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { paperId, personalNotes } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    if (!paperId) {
      res.status(400).json({ success: false, message: 'Paper ID is required' });
      return;
    }

    const savedPaper = await savePaper(userId, paperId, personalNotes || '');

    res.status(201).json({
      success: true,
      message: 'Paper saved successfully',
      data: savedPaper,
    });
  } catch (error) {
    console.error('Add saved paper error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteSavedPaper = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { paperId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    if (!paperId) {
      res.status(400).json({ success: false, message: 'Paper ID is required' });
      return;
    }

    const removed = await removeSavedPaper(userId, paperId);
    if (!removed) {
      res.status(404).json({ success: false, message: 'Saved paper not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Saved paper removed successfully' });
  } catch (error) {
    console.error('Delete saved paper error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getSavedPapers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const savedPapers = await getSavedPapersByUser(userId);

    res.status(200).json({
      success: true,
      message: 'Saved papers retrieved successfully',
      data: savedPapers,
    });
  } catch (error) {
    console.error('Get saved papers error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateSavedPaperNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { paperId } = req.params;
    const { personalNotes } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    if (!paperId) {
      res.status(400).json({ success: false, message: 'Paper ID is required' });
      return;
    }

    const updatedPaper = await updatePersonalNotes(userId, paperId, personalNotes || '');

    if (!updatedPaper) {
      res.status(404).json({ success: false, message: 'Saved paper not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Personal notes updated successfully',
      data: updatedPaper,
    });
  } catch (error) {
    console.error('Update personal notes error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};