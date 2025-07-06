import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  saveBookmark,
  removeBookmark,
  getBookmarksByUser,
  updateBookmarkNotes as updateBookmarkNotesService
} from '../services/bookmark.service';

export const addBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const { paperId, personalNotes } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    if (!paperId) {
      res.status(400).json({ success: false, message: 'Paper ID is required' });
      return;
    }

    const bookmark = await saveBookmark(userId, paperId, personalNotes || '');

    res.status(201).json({
      success: true,
      message: 'Paper bookmarked successfully',
      data: bookmark,
    });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const { paperId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    if (!paperId) {
      res.status(400).json({ success: false, message: 'Paper ID is required' });
      return;
    }

    const removed = await removeBookmark(userId, paperId);
    if (!removed) {
      res.status(404).json({ success: false, message: 'Bookmark not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getBookmarks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const bookmarks = await getBookmarksByUser(userId);

    res.status(200).json({
      success: true,
      message: 'Bookmarks retrieved successfully',
      data: bookmarks,
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateBookmarkNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

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

    const updatedBookmark = await updateBookmarkNotesService(userId, paperId, personalNotes || '');

    if (!updatedBookmark) {
      res.status(404).json({ success: false, message: 'Bookmark not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Personal notes updated successfully',
      data: updatedBookmark,
    });
  } catch (error) {
    console.error('Update personal notes error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
