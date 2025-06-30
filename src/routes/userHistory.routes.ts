// routes/userHistory.routes.ts
import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getUserSearchHistory, addUserSearchHistory } from '../controllers/userHistory.controller';

const router = express.Router();

router.get('/', authenticate, getUserSearchHistory);
router.post('/', authenticate, addUserSearchHistory);

export default router;