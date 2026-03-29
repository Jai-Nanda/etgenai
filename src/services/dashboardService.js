import { apiClient, ApiError } from '../lib/api.js';

class DashboardService {
  // Get dashboard summary
  async getDashboardSummary() {
    try {
      const response = await apiClient.get('/api/dashboard/summary');
      return response;
    } catch (error) {
      console.error('Dashboard summary error:', error);
      throw error;
    }
  }

  // Get transactions with pagination and filters
  async getTransactions(options = {}) {
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 50,
        category: options.category,
        type: options.type,
        startDate: options.startDate,
        endDate: options.endDate
      };

      // Remove undefined parameters
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await apiClient.get('/api/dashboard/transactions', params);
      return response;
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  }

  // Get transactions by category
  async getTransactionsByCategory(category) {
    return this.getTransactions({ category });
  }

  // Get transactions by type (income/expense)
  async getTransactionsByType(type) {
    return this.getTransactions({ type });
  }

  // Get transactions for date range
  async getTransactionsByDateRange(startDate, endDate) {
    return this.getTransactions({ startDate, endDate });
  }

  // Search transactions
  async searchTransactions(query, options = {}) {
    try {
      // This would require a search endpoint in the backend
      // For now, we'll use the transactions endpoint and filter client-side
      const response = await this.getTransactions({ ...options, limit: 1000 });
      
      if (response.success && response.data.transactions) {
        const filteredTransactions = response.data.transactions.filter(transaction => 
          transaction.description.toLowerCase().includes(query.toLowerCase()) ||
          transaction.category.toLowerCase().includes(query.toLowerCase())
        );

        return {
          success: true,
          data: {
            transactions: filteredTransactions,
            pagination: {
              ...response.data.pagination,
              total: filteredTransactions.length,
              pages: Math.ceil(filteredTransactions.length / (options.limit || 50))
            }
          }
        };
      }

      return response;
    } catch (error) {
      console.error('Search transactions error:', error);
      throw error;
    }
  }

  // Get transaction statistics
  async getTransactionStats() {
    try {
      const summary = await this.getDashboardSummary();
      
      if (summary.success && summary.data.summary) {
        const { summary: stats } = summary.data;
        
        return {
          success: true,
          data: {
            totalSpent: stats.totalSpent,
            totalReceived: stats.totalReceived,
            netBalance: stats.netBalance,
            transactionCount: stats.transactionCount,
            averageMonthlySpending: stats.averageMonthlySpending,
            topCategory: stats.topCategory,
            largestTransaction: stats.largestTransaction
          }
        };
      }

      return summary;
    } catch (error) {
      console.error('Get transaction stats error:', error);
      throw error;
    }
  }

  // Export transactions (placeholder for future feature)
  async exportTransactions(format = 'csv', options = {}) {
    try {
      // This would require an export endpoint in the backend
      const params = { format, ...options };
      const response = await apiClient.get('/api/dashboard/export', params);
      return response;
    } catch (error) {
      console.error('Export transactions error:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const dashboardService = new DashboardService();

export default dashboardService;
