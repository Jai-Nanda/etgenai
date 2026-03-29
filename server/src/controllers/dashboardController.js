import { prisma } from '../config/database.js';
import { ApiResponse } from '../utils/response.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    if (transactions.length === 0) {
      return ApiResponse.success(res, {
        summary: {
          totalSpent: 0,
          totalReceived: 0,
          netBalance: 0,
          transactionCount: 0,
          averageMonthlySpending: 0,
          topCategory: null,
          largestTransaction: null
        },
        recentTransactions: [],
        categoryBreakdown: [],
        monthlyTrend: []
      }, 'No transactions found');
    }

    // Calculate summary metrics
    const totalSpent = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalReceived = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalReceived - totalSpent;

    // Find largest transaction
    const largestTransaction = transactions.reduce((max, t) => 
      t.amount > (max?.amount || 0) ? t : max, null);

    // Category breakdown
    const categoryTotals = transactions.reduce((acc, t) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {});

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100,
        transactionCount: transactions.filter(t => t.category === category && t.type === 'expense').length
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categoryBreakdown[0]?.category || null;

    // Monthly trend (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyData = transactions
      .filter(t => t.date >= sixMonthsAgo)
      .reduce((acc, t) => {
        const monthKey = t.date.toISOString().slice(0, 7); // YYYY-MM
        if (!acc[monthKey]) {
          acc[monthKey] = { income: 0, expense: 0, month: monthKey };
        }
        if (t.type === 'income') {
          acc[monthKey].income += t.amount;
        } else {
          acc[monthKey].expense += t.amount;
        }
        return acc;
      }, {});

    const monthlyTrend = Object.values(monthlyData)
      .map(data => ({
        ...data,
        net: data.income - data.expense,
        transactionCount: transactions.filter(t => 
          t.date.toISOString().slice(0, 7) === data.month
        ).length
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate average monthly spending
    const monthsWithData = monthlyTrend.length;
    const averageMonthlySpending = monthsWithData > 0 
      ? monthlyTrend.reduce((sum, m) => sum + m.expense, 0) / monthsWithData
      : 0;

    // Recent transactions (last 10)
    const recentTransactions = transactions.slice(0, 10).map(t => ({
      id: t.id,
      date: t.date,
      description: t.description,
      amount: t.amount,
      type: t.type,
      category: t.category
    }));

    ApiResponse.success(res, {
      summary: {
        totalSpent: Math.round(totalSpent * 100) / 100,
        totalReceived: Math.round(totalReceived * 100) / 100,
        netBalance: Math.round(netBalance * 100) / 100,
        transactionCount: transactions.length,
        averageMonthlySpending: Math.round(averageMonthlySpending * 100) / 100,
        topCategory,
        largestTransaction: largestTransaction ? {
          description: largestTransaction.description,
          amount: Math.round(largestTransaction.amount * 100) / 100,
          date: largestTransaction.date,
          category: largestTransaction.category
        } : null
      },
      recentTransactions,
      categoryBreakdown: categoryBreakdown.map(cat => ({
        ...cat,
        amount: Math.round(cat.amount * 100) / 100,
        percentage: Math.round(cat.percentage * 10) / 10
      })),
      monthlyTrend: monthlyTrend.map(m => ({
        ...m,
        income: Math.round(m.income * 100) / 100,
        expense: Math.round(m.expense * 100) / 100,
        net: Math.round(m.net * 100) / 100
      }))
    }, 'Dashboard summary retrieved successfully');

  } catch (error) {
    console.error('Dashboard summary error:', error);
    ApiResponse.serverError(res, 'Failed to retrieve dashboard summary');
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 50, category, type, startDate, endDate } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = { userId };

    if (category) where.category = category;
    if (type) where.type = type;

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take,
        select: {
          id: true,
          date: true,
          description: true,
          amount: true,
          type: true,
          category: true,
          sourceFileName: true
        }
      }),
      prisma.transaction.count({ where })
    ]);

    ApiResponse.success(res, {
      transactions: transactions.map(t => ({
        ...t,
        amount: Math.round(t.amount * 100) / 100
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Transactions retrieved successfully');

  } catch (error) {
    console.error('Get transactions error:', error);
    ApiResponse.serverError(res, 'Failed to retrieve transactions');
  }
};
