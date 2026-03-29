import { ApiResponse } from '../utils/response.js';
import { config } from '../config/env.js';

export const errorHandler = (error, req, res, next) => {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return ApiResponse.badRequest(res, 'Validation failed', error.errors);
  }

  if (error.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token expired');
  }

  if (error.code === 'P2002') {
    // Prisma unique constraint violation
    return ApiResponse.badRequest(res, 'Resource already exists');
  }

  if (error.code === 'P2025') {
    // Prisma record not found
    return ApiResponse.notFound(res, 'Resource not found');
  }

  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return ApiResponse.badRequest(res, `File size too large. Maximum size is ${config.maxFileSize / 1024 / 1024}MB`);
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return ApiResponse.badRequest(res, 'Too many files uploaded');
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return ApiResponse.badRequest(res, 'Unexpected file field');
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = config.nodeEnv === 'production' 
    ? 'Internal server error' 
    : error.message || 'Something went wrong';

  return ApiResponse.error(res, message, statusCode);
};

// Async error wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
