import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/response.js';
import { parseCSVFile, deleteCSVFile } from '../utils/csvParser.js';
import fs from 'fs/promises';
import path from 'path';

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return ApiResponse.badRequest(res, 'No file uploaded');
    }

    const userId = req.user.id;
    const file = req.file;

    // Create file record in database
    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        userId,
        originalName: file.originalname,
        fileName: file.filename,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: 'uploaded'
      }
    });

    // Parse CSV file
    const { transactions, errors, totalProcessed, totalErrors } = await parseCSVFile(file.path, file.originalname);

    if (totalProcessed === 0) {
      // Delete the uploaded file if no valid transactions
      await deleteCSVFile(file.path);
      
      // Update file status to failed
      await prisma.uploadedFile.update({
        where: { id: uploadedFile.id },
        data: { status: 'failed' }
      });

      return ApiResponse.badRequest(res, 'No valid transactions found in CSV file');
    }

    // Store transactions in database
    const createdTransactions = await prisma.transaction.createMany({
      data: transactions.map(transaction => ({
        userId,
        uploadedFileId: uploadedFile.id,
        ...transaction
      })),
      skipDuplicates: true
    });

    // Update file status to processed
    await prisma.uploadedFile.update({
      where: { id: uploadedFile.id },
      data: { status: 'processed' }
    });

    // Clean up: delete the uploaded CSV file
    await deleteCSVFile(file.path);

    ApiResponse.success(res, {
      file: {
        id: uploadedFile.id,
        originalName: uploadedFile.originalName,
        status: uploadedFile.status,
        createdAt: uploadedFile.createdAt
      },
      summary: {
        totalProcessed,
        totalErrors,
        transactionsCreated: createdTransactions.count
      },
      errors: errors.slice(0, 10) // Return first 10 errors for debugging
    }, 'CSV file processed successfully');

  } catch (error) {
    console.error('CSV upload error:', error);
    
    // Clean up file on error
    if (req.file) {
      await deleteCSVFile(req.file.path);
    }

    ApiResponse.serverError(res, 'Failed to process CSV file');
  }
};

export const getUploadHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const uploads = await prisma.uploadedFile.findMany({
      where: { userId },
      select: {
        id: true,
        originalName: true,
        fileSize: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            transactions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    ApiResponse.success(res, uploads, 'Upload history retrieved successfully');

  } catch (error) {
    console.error('Get upload history error:', error);
    ApiResponse.serverError(res, 'Failed to retrieve upload history');
  }
};

export const deleteUpload = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    // Check if file belongs to user
    const uploadedFile = await prisma.uploadedFile.findFirst({
      where: {
        id: fileId,
        userId
      }
    });

    if (!uploadedFile) {
      return ApiResponse.notFound(res, 'Upload not found');
    }

    // Delete associated transactions
    await prisma.transaction.deleteMany({
      where: { uploadedFileId: fileId }
    });

    // Delete file record
    await prisma.uploadedFile.delete({
      where: { id: fileId }
    });

    ApiResponse.success(res, null, 'Upload and associated transactions deleted successfully');

  } catch (error) {
    console.error('Delete upload error:', error);
    ApiResponse.serverError(res, 'Failed to delete upload');
  }
};
