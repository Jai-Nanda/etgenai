import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getInsights } from '../controllers/insightsController.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Get user insights
router.get('/', getInsights);

export default router;
