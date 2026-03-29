import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { uploadCSV, handleUploadError } from '../middleware/upload.js';
import { 
  uploadCSV as uploadCSVController,
  getUploadHistory,
  deleteUpload
} from '../controllers/uploadController.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Upload CSV file
router.post('/csv', uploadCSV.single('csv'), handleUploadError, uploadCSVController);

// Get upload history
router.get('/history', getUploadHistory);

// Delete upload and associated transactions
router.delete('/:fileId', deleteUpload);

export default router;
