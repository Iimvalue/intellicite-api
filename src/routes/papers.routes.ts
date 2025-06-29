import { Router } from 'express';
import {
  getPapers,
  getPaperById,
  createOrFindPaper,
  updatePaper,
  deletePaper
} from '../controllers/paper.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getPapers);
router.get('/:id', getPaperById);
router.post('/', authenticate, createOrFindPaper);
router.put('/:id', authenticate, updatePaper);
router.delete('/:id', authenticate, deletePaper);

export default router;