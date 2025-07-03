import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminStats.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/authorize.middleware';
import { adminDeletePaper, adminListAllPapers } from '../controllers/adminPaper.controller';
import { adminListAllPaperReports } from '../controllers/adminReport.controller';
import { adminListAllUsers, adminUpdateUser, adminDeleteUser, adminCreateUser } from '../controllers/adminUser.controller';

const router = Router();

// all admin routes should be protected
router.get('/dashboard/stats', authenticate, authorize(['admin']), getDashboardStats);
router.get('/papers', authenticate, authorize(['admin']), adminListAllPapers);
router.delete('/papers/:id', authenticate, authorize(['admin']), adminDeletePaper);
router.get('/paper-reports', authenticate, authorize(['admin']), adminListAllPaperReports);
router.get('/users', authenticate, authorize(['admin']), adminListAllUsers);
router.put('/users/:id', authenticate, authorize(['admin']), adminUpdateUser);
router.delete('/users/:id', authenticate, authorize(['admin']), adminDeleteUser);
router.post('/users', authenticate, authorize(['admin']), adminCreateUser);

export default router;
