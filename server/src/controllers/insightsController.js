import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/response.js';

export const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    if (transactions.length === 0) {
      return ApiResponse.success(res, {
        spendingPersonality: 'No Data',
        patterns: [],
        recommendations: [],
        warnings: [],
        habits: {
          good: [],
          bad: []
        },
        summary: {
          totalTransactions: 0,
          avgTransactionAmount: 0,
          mostActiveDay: null,
          topSpendingCategory: null
        }
      }, 'No insights available - no transactions found');
    }

    // Calculate basic metrics
    const totalTransactions = transactions.length;
    const avgTransactionAmount = transactions.reduce((sum, t) => sum + t.amount, 0) / totalTransactions;
    
    // Spending personality analysis
    const spendingPersonality = analyzeSpendingPersonality(transactions);
    
    // Patterns analysis
    const patterns = analyzePatterns(transactions);
    
    // Recommendations
    const recommendations = generateRecommendations(transactions);
    
    // Warnings
    const warnings = generateWarnings(transactions);
    
    // Habits analysis
    const habits = analyzeHabits(transactions);
    
    // Summary stats
    const summary = {
      totalTransactions,
      avgTransactionAmount: Math.round(avgTransactionAmount * 100) / 100,
      mostActiveDay: getMostActiveDay(transactions),
      topSpendingCategory: getTopSpendingCategory(transactions)
    };

    ApiResponse.success(res, {
      spendingPersonality,
      patterns,
      recommendations,
      warnings,
      habits,
      summary
    }, 'Insights generated successfully');

  } catch (error) {
    console.error('Insights error:', error);
    ApiResponse.serverError(res, 'Failed to generate insights');
  }
};

function analyzeSpendingPersonality(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');
  
  if (expenses.length === 0) return 'Income Focused';
  
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const avgExpense = totalExpenses / expenses.length;
  
  // Category diversity
  const uniqueCategories = new Set(expenses.map(t => t.category)).size;
  
  // Spending frequency (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentExpenses = expenses.filter(t => t.date >= thirtyDaysAgo);
  
  // Determine personality
  if (avgExpense > 1000 && uniqueCategories > 5) {
    return 'High Spender';
  } else if (avgExpense < 100 && uniqueCategories < 3) {
    return 'Conservative';
  } else if (recentExpenses.length > 20) {
    return 'Frequent Spender';
  } else if (uniqueCategories > 6) {
    return 'Diverse Spender';
  } else if (income.length > 0 && income.reduce((sum, t) => sum + t.amount, 0) > totalExpenses) {
    return 'Savvy Saver';
  } else {
    return 'Balanced Spender';
  }
}

function analyzePatterns(transactions) {
  const patterns = [];
  
  // Weekend vs Weekday spending
  const weekendSpending = transactions
    .filter(t => t.type === 'expense' && (t.date.getDay() === 0 || t.date.getDay() === 6))
    .reduce((sum, t) => sum + t.amount, 0);
    
  const weekdaySpending = transactions
    .filter(t => t.type === 'expense' && t.date.getDay() >= 1 && t.date.getDay() <= 5)
    .reduce((sum, t) => sum + t.amount, 0);
    
  if (weekendSpending > weekdaySpending * 1.5) {
    patterns.push({
      type: 'weekend_spender',
      title: 'Weekend Warrior',
      description: 'You tend to spend more on weekends',
      impact: 'high'
    });
  }
  
  // Large transactions pattern
  const largeTransactions = transactions.filter(t => t.amount > avgTransactionAmount(transactions) * 3);
  if (largeTransactions.length > transactions.length * 0.1) {
    patterns.push({
      type: 'large_transactions',
      title: 'Big Ticket Spender',
      description: 'You make frequent large purchases',
      impact: 'medium'
    });
  }
  
  // Category concentration
  const categoryTotals = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  if (topCategory && topCategory[1] > totalExpenses * 0.4) {
    patterns.push({
      type: 'category_focused',
      title: `${topCategory[0]} Enthusiast`,
      description: `You spend most of your money on ${topCategory[0].toLowerCase()}`,
      impact: 'medium'
    });
  }
  
  return patterns;
}

function generateRecommendations(transactions) {
  const recommendations = [];
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Budget recommendations based on categories
  const categoryTotals = {};
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  
  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  // High spending categories
  Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .forEach(([category, amount]) => {
      const percentage = (amount / totalExpenses) * 100;
      if (percentage > 30) {
        recommendations.push({
          type: 'budget_alert',
          title: `Review ${category} Spending`,
          description: `${category} accounts for ${Math.round(percentage)}% of your expenses`,
          priority: 'high'
        });
      }
    });
  
  // Savings recommendation
  const income = transactions.filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  if (income > 0 && totalExpenses > income * 0.9) {
    recommendations.push({
      type: 'savings',
      title: 'Increase Savings',
      description: 'Consider saving at least 10% of your income',
      priority: 'medium'
    });
  }
  
  return recommendations;
}

function generateWarnings(transactions) {
  const warnings = [];
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Unusually large transactions
  const avgAmount = avgTransactionAmount(transactions);
  const largeTransactions = expenses.filter(t => t.amount > avgAmount * 5);
  
  if (largeTransactions.length > 0) {
    warnings.push({
      type: 'large_expense',
      title: 'Unusually Large Expense',
      description: `Found ${largeTransactions.length} transactions larger than typical spending`,
      severity: 'medium'
    });
  }
  
  // Frequent small transactions
  const smallTransactions = expenses.filter(t => t.amount < 50);
  if (smallTransactions.length > expenses.length * 0.7) {
    warnings.push({
      type: 'frequent_small',
      title: 'Frequent Small Purchases',
      description: 'Many small transactions can add up quickly',
      severity: 'low'
    });
  }
  
  return warnings;
}

function analyzeHabits(transactions) {
  const good = [];
  const bad = [];
  
  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');
  
  // Good habits
  if (income.length > 0) {
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    if (totalIncome > totalExpenses) {
      good.push({
        title: 'Positive Cash Flow',
        description: 'Your income exceeds your expenses'
      });
    }
  }
  
  // Diverse spending (can be good or bad)
  const uniqueCategories = new Set(expenses.map(t => t.category)).size;
  if (uniqueCategories > 5 && uniqueCategories < 10) {
    good.push({
      title: 'Balanced Spending',
      description: 'You spread your spending across multiple categories'
    });
  }
  
  // Bad habits
  const avgAmount = avgTransactionAmount(transactions);
  const impulseTransactions = expenses.filter(t => t.amount > avgAmount * 3);
  
  if (impulseTransactions.length > expenses.length * 0.1) {
    bad.push({
      title: 'Impulse Spending',
      description: 'You make frequent large purchases that might be unplanned'
    });
  }
  
  // Same category spending
  const categoryTotals = {};
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  if (topCategory && topCategory[1] > totalExpenses * 0.5) {
    bad.push({
      title: 'Category Dependence',
      description: `Over 50% of spending goes to ${topCategory[0].toLowerCase()}`
    });
  }
  
  return { good, bad };
}

function avgTransactionAmount(transactions) {
  return transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length;
}

function getMostActiveDay(transactions) {
  const dayCounts = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  transactions.forEach(t => {
    const dayName = dayNames[t.date.getDay()];
    dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
  });
  
  return Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

function getTopSpendingCategory(transactions) {
  const categoryTotals = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
  
  return Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}
