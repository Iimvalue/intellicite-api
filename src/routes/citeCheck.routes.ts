import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createCiteCheck,
  getCiteChecks,
  getSingleCiteCheck
} from '../controllers/citeCheck.controller';

const router = express.Router();

router.post('/', authenticate, createCiteCheck);
router.get('/', authenticate, getCiteChecks);
router.get('/:checkId', authenticate, getSingleCiteCheck);

export default router;