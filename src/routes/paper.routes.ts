import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { searchPapersHandler } from '../controllers/paper.controller';
import { generateCiteCheck } from '../controllers/citationCheck.controller';

const router = Router();

// search academic papers by topic (Semantic Scholar(plus other apis) + openAI assistant generate usefulness report)
router.get('/search', authenticate, searchPapersHandler);

// cite check: user provides DOI and their query, gets usefulness report
router.post('/citeCheck', authenticate, generateCiteCheck);

export default router;
