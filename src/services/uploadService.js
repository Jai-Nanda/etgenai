import { apiClient, ApiError } from '../lib/api.js';

class UploadService {
  // Upload CSV file
  async uploadCSV(file) {
    try {
      const response = await apiClient.uploadFile('/api/upload/csv', file);
      return response;
    } catch (error) {
      console.error('CSV upload error:', error);
      throw error;
    }
  }

  // Get upload history
  async getUploadHistory() {
    try {
      const response = await apiClient.get('/api/upload/history');
      return response;
    } catch (error) {
      console.error('Get upload history error:', error);
      throw error;
    }
  }

  // Delete upload and associated transactions
  async deleteUpload(fileId) {
    try {
      const response = await apiClient.delete(`/api/upload/${fileId}`);
      return response;
    } catch (error) {
      console.error('Delete upload error:', error);
      throw error;
    }
  }

  // Validate CSV file before upload
  validateCSVFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['text/csv', 'application/csv'];
    const allowedExtensions = ['.csv'];

    // Check file size
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Check file type
    if (!allowedTypes.includes(file.type) && !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      throw new Error('Only CSV files are allowed');
    }

    return true;
  }

  // Parse CSV file locally for preview (optional)
  async parseCSVPreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            reject(new Error('CSV file must have at least a header and one data row'));
            return;
          }

          // Parse header
          const header = lines[0].split(',').map(col => col.trim().replace(/"/g, ''));
          
          // Parse first few rows for preview
          const previewRows = lines.slice(1, 6).map(line => {
            const values = line.split(',').map(val => val.trim().replace(/"/g, ''));
            return header.reduce((obj, key, index) => {
              obj[key] = values[index] || '';
              return obj;
            }, {});
          });

          resolve({
            header,
            previewRows,
            totalRows: lines.length - 1
          });
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }
}

// Create singleton instance
export const uploadService = new UploadService();

export default uploadService;
