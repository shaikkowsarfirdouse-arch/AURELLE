import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly); // All admin routes require admin privileges

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

export default router;

