import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers
} from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', authenticate, getUsers);


router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

export default router;