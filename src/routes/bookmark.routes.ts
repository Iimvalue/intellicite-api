import { Router } from 'express';
import {
  addBookmark,
  deleteBookmark,
  getBookmarks,
  updateBookmarkNotes,
} from '../controllers/bookmark.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, addBookmark);
router.get('/', authenticate, getBookmarks);
router.put('/:paperId', authenticate, updateBookmarkNotes);  
router.delete('/:paperId', authenticate, deleteBookmark);

export default router;
