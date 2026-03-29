import { apiClient, ApiError } from '../lib/api.js';

class InsightsService {
  // Get user insights
  async getInsights() {
    try {
      const response = await apiClient.get('/api/insights');
      return response;
    } catch (error) {
      console.error('Get insights error:', error);
      throw error;
    }
  }

  // Get spending personality analysis
  async getSpendingPersonality() {
    try {
      const response = await this.getInsights();
      
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            personality: response.data.spendingPersonality,
            summary: response.data.summary
          }
        };
      }

      return response;
    } catch (error) {
      console.error('Get spending personality error:', error);
      throw error;
    }
  }

  // Get spending patterns
  async getSpendingPatterns() {
    try {
      const response = await this.getInsights();
      
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            patterns: response.data.patterns,
            summary: response.data.summary
          }
        };
      }

      return response;
    } catch (error) {
      console.error('Get spending patterns error:', error);
      throw error;
    }
  }

  // Get recommendations
  async getRecommendations() {
    try {
      const response = await this.getInsights();
      
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            recommendations: response.data.recommendations,
            warnings: response.data.warnings
          }
        };
      }

      return response;
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }

  // Get habits analysis
  async getHabitsAnalysis() {
    try {
      const response = await this.getInsights();
      
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            habits: response.data.habits,
            patterns: response.data.patterns
          }
        };
      }

      return response;
    } catch (error) {
      console.error('Get habits analysis error:', error);
      throw error;
    }
  }

  // Get complete insights report
  async getInsightsReport() {
    try {
      const response = await this.getInsights();
      return response;
    } catch (error) {
      console.error('Get insights report error:', error);
      throw error;
    }
  }

  // Format insights for UI consumption
  formatInsightsForUI(insightsData) {
    if (!insightsData || !insightsData.success) {
      return {
        spendingPersonality: 'No Data',
        patterns: [],
        recommendations: [],
        warnings: [],
        habits: { good: [], bad: [] },
        summary: {
          totalTransactions: 0,
          avgTransactionAmount: 0,
          mostActiveDay: null,
          topSpendingCategory: null
        }
      };
    }

    const { data } = insightsData;
    
    return {
      spendingPersonality: data.spendingPersonality || 'No Data',
      patterns: data.patterns || [],
      recommendations: data.recommendations || [],
      warnings: data.warnings || [],
      habits: {
        good: data.habits?.good || [],
        bad: data.habits?.bad || []
      },
      summary: {
        totalTransactions: data.summary?.totalTransactions || 0,
        avgTransactionAmount: data.summary?.avgTransactionAmount || 0,
        mostActiveDay: data.summary?.mostActiveDay || null,
        topSpendingCategory: data.summary?.topSpendingCategory || null
      }
    };
  }

  // Get insights summary for dashboard
  async getInsightsSummary() {
    try {
      const response = await this.getInsights();
      
      if (response.success && response.data) {
        const { data } = response;
        
        return {
          success: true,
          data: {
            personality: data.spendingPersonality,
            patternCount: data.patterns?.length || 0,
            recommendationCount: data.recommendations?.length || 0,
            warningCount: data.warnings?.length || 0,
            goodHabitsCount: data.habits?.good?.length || 0,
            badHabitsCount: data.habits?.bad?.length || 0,
            topCategory: data.summary?.topSpendingCategory
          }
        };
      }

      return response;
    } catch (error) {
      console.error('Get insights summary error:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const insightsService = new InsightsService();

export default insightsService;
