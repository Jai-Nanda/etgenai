import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/response.js';
import { config } from '../config/env.js';

const SALT_ROUNDS = 12;

// Generate JWT token
function generateToken(userId) {
  return jwt.sign(
    { userId },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

// User signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return ApiResponse.badRequest(res, 'Name, email, and password are required');
    }

    if (password.length < 8) {
      return ApiResponse.badRequest(res, 'Password must be at least 8 characters long');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return ApiResponse.badRequest(res, 'User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken(user.id);

    ApiResponse.created(res, {
      user,
      token
    }, 'Account created successfully');

  } catch (error) {
    console.error('Signup error:', error);
    ApiResponse.serverError(res, 'Failed to create account');
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return ApiResponse.badRequest(res, 'Email and password are required');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    ApiResponse.success(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    ApiResponse.serverError(res, 'Failed to login');
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            transactions: true,
            uploadedFiles: true
          }
        }
      }
    });

    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    ApiResponse.success(res, user, 'Profile retrieved successfully');

  } catch (error) {
    console.error('Get profile error:', error);
    ApiResponse.serverError(res, 'Failed to retrieve profile');
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return ApiResponse.badRequest(res, 'Name must be at least 2 characters long');
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    ApiResponse.success(res, user, 'Profile updated successfully');

  } catch (error) {
    console.error('Update profile error:', error);
    ApiResponse.serverError(res, 'Failed to update profile');
  }
};
