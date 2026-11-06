import express from 'express';
import {
  getProductReviews,
  createProductReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, createProductReview);
router.delete('/:id', protect, deleteReview);

export default router;

