import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { config } from '../config/env.js';

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(config.uploadDir);
  } catch {
    await fs.mkdir(config.uploadDir, { recursive: true });
  }
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDir();
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `csv-${uniqueSuffix}${ext}`);
  }
});

// File filter for CSV files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || 
      file.mimetype === 'application/csv' ||
      file.originalname.toLowerCase().endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

// Configure multer
export const uploadCSV = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
    files: 1
  }
});

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File size too large. Maximum size is ${config.maxFileSize / 1024 / 1024}MB`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Only one file can be uploaded at a time'
      });
    }
  }

  if (error.message === 'Only CSV files are allowed') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};
