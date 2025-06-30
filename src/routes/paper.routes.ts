import { Router } from 'express';
import { searchPapersHandler } from '../controllers/papers.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/papers/search',authenticate, searchPapersHandler);

export default router;
