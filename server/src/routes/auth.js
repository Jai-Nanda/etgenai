import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  signup, 
  login, 
  getProfile, 
  updateProfile 
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;
