import { Router } from 'express';
import {
  addSavedPaper,
  deleteSavedPaper,
  getSavedPapers,
  updateSavedPaperNotes,
} from '../controllers/savedPaper.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, addSavedPaper);
router.get('/', authenticate, getSavedPapers);
router.put('/:paperId', authenticate, updateSavedPaperNotes);  
router.delete('/:paperId', authenticate, deleteSavedPaper);

export default router;