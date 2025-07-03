import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  adminUpdateUser,
  adminDeleteUser
} from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

router.get('/users', authenticate, authorize(['admin']), getUsers);
router.put('/users/:id', authenticate, authorize(['admin']), adminUpdateUser);
router.delete('/users/:id', authenticate, authorize(['admin']), adminDeleteUser);

export default router;