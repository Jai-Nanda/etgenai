import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  getDashboardSummary,
  getTransactions
} from '../controllers/dashboardController.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Get dashboard summary
router.get('/summary', getDashboardSummary);

// Get transactions with pagination and filters
router.get('/transactions', getTransactions);

export default router;
