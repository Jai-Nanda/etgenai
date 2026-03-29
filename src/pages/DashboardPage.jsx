import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  PieChart,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import PageContainer from '../components/PageContainer'
import SectionHeader from '../components/SectionHeader'
import GlassCard from '../components/GlassCard'
import SummaryCard from '../components/SummaryCard'
import StoryPanel from '../components/StoryPanel'
import Button from '../components/Button'
import LoadingOverlay from '../components/LoadingOverlay'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { dashboardService } from '../services/dashboardService'
import { formatCurrency } from '../utils/formatCurrency'

const maxTrend = 10000 // Default max trend value

export default function DashboardPage() {
  const navigate = useNavigate()
  const { storySourceName, setStorySourceName } = useApp()
  const { user, isGuest } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)

  const welcomeName = user?.name || storySourceName?.replace(/\.csv$/i, '') || null

  useEffect(() => {
    if (isGuest) {
      // For guest users, show a message to sign up
      setLoading(false)
      return
    }

    loadDashboardData()
  }, [isGuest])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await dashboardService.getDashboardSummary()
      
      if (response.success) {
        setDashboardData(response.data)
      } else {
        setError(response.message || 'Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Dashboard load error:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (isGuest) {
    // Check if guest has uploaded data
    const hasUploadedData = storySourceName && storySourceName !== 'demo_data.csv'
    
    // Show demo data for guest users (or uploaded data if available)
    const demoData = {
      summary: {
        totalSpent: hasUploadedData ? Math.floor(Math.random() * 4000) + 2000 : 3456.78,
        totalReceived: hasUploadedData ? Math.floor(Math.random() * 6000) + 3000 : 5234.12,
        netBalance: hasUploadedData ? Math.floor(Math.random() * 3000) + 500 : 1777.34,
        transactionCount: hasUploadedData ? Math.floor(Math.random() * 80) + 30 : 47,
        averageMonthlySpending: hasUploadedData ? Math.floor(Math.random() * 1500) + 500 : 1152.26,
        topCategory: hasUploadedData ? 'Shopping' : 'Food',
        largestTransaction: {
          description: hasUploadedData ? 'Online Purchase' : 'Monthly Rent Payment',
          amount: hasUploadedData ? Math.floor(Math.random() * 500) + 200 : 1200.00,
          date: new Date('2024-01-01'),
          category: hasUploadedData ? 'Shopping' : 'Bills'
        }
      },
      recentTransactions: hasUploadedData ? [
        {
          id: '1',
          date: new Date('2024-01-20'),
          description: 'Online Shopping',
          amount: 156.99,
          type: 'expense',
          category: 'Shopping'
        },
        {
          id: '2',
          date: new Date('2024-01-19'),
          description: 'Restaurant',
          amount: 42.50,
          type: 'expense',
          category: 'Food'
        },
        {
          id: '3',
          date: new Date('2024-01-18'),
          description: 'Gas Station',
          amount: 35.00,
          type: 'expense',
          category: 'Travel'
        },
        {
          id: '4',
          date: new Date('2024-01-17'),
          description: 'Grocery Store',
          amount: 87.43,
          type: 'expense',
          category: 'Food'
        },
        {
          id: '5',
          date: new Date('2024-01-16'),
          description: 'Subscription',
          amount: 12.99,
          type: 'expense',
          category: 'Entertainment'
        }
      ] : [
        {
          id: '1',
          date: new Date('2024-01-15'),
          description: 'Grocery Shopping',
          amount: 85.32,
          type: 'expense',
          category: 'Food'
        },
        {
          id: '2',
          date: new Date('2024-01-14'),
          description: 'Salary Credit',
          amount: 2500.00,
          type: 'income',
          category: 'Income'
        },
        {
          id: '3',
          date: new Date('2024-01-13'),
          description: 'Netflix Subscription',
          amount: 15.99,
          type: 'expense',
          category: 'Entertainment'
        },
        {
          id: '4',
          date: new Date('2024-01-12'),
          description: 'Gas Station',
          amount: 45.00,
          type: 'expense',
          category: 'Travel'
        },
        {
          id: '5',
          date: new Date('2024-01-11'),
          description: 'Restaurant Dinner',
          amount: 62.50,
          type: 'expense',
          category: 'Food'
        }
      ],
      categoryBreakdown: hasUploadedData ? [
        { category: 'Shopping', amount: 1450.78, percentage: 38.5, transactionCount: 12 },
        { category: 'Food', amount: 980.45, percentage: 26.0, transactionCount: 18 },
        { category: 'Travel', amount: 420.15, percentage: 11.2, transactionCount: 8 },
        { category: 'Entertainment', amount: 280.99, percentage: 7.5, transactionCount: 6 },
        { category: 'Bills', amount: 625.19, percentage: 16.8, transactionCount: 5 }
      ] : [
        { category: 'Food', amount: 1250.45, percentage: 36.2, transactionCount: 15 },
        { category: 'Bills', amount: 1450.00, percentage: 42.0, transactionCount: 8 },
        { category: 'Travel', amount: 320.15, percentage: 9.3, transactionCount: 12 },
        { category: 'Entertainment', amount: 180.99, percentage: 5.2, transactionCount: 6 },
        { category: 'Shopping', amount: 255.19, percentage: 7.3, transactionCount: 6 }
      ],
      monthlyTrend: [
        { month: '2023-09', income: 4500.00, expense: 2100.45, net: 2399.55, transactionCount: 12 },
        { month: '2023-10', income: 4800.00, expense: 2890.12, net: 1909.88, transactionCount: 18 },
        { month: '2023-11', income: 4500.00, expense: 3156.78, net: 1343.22, transactionCount: 22 },
        { month: '2023-12', income: 5234.12, expense: 3456.78, net: 1777.34, transactionCount: 25 }
      ]
    }

    const { summary, recentTransactions, categoryBreakdown, monthlyTrend } = demoData
    const maxTrendValue = Math.max(...monthlyTrend.map(m => Math.max(m.income, m.expense)), 1000)

    return (
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <SectionHeader
            title={hasUploadedData ? `Demo Dashboard - ${storySourceName}` : "Demo Dashboard"}
            description={hasUploadedData 
              ? "Your uploaded data processed in demo mode. Sign up to save permanently." 
              : "Explore Expense Genie AI with sample data. Sign up to track your real finances."
            }
          />
          
          <GlassCard className="p-4 border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary">
                  {hasUploadedData ? 'Demo Upload Processed' : 'Demo Mode Active'}
                </h4>
                <p className="text-sm text-on-surface-variant">
                  {hasUploadedData 
                    ? `Your ${storySourceName} file was processed in demo mode. Data is temporary. ` 
                    : 'You\'re exploring with sample data. '
                  }
                  <span className="underline cursor-pointer" onClick={() => navigate('/signup')}>Sign up</span> to {hasUploadedData ? 'save your data permanently' : 'track your real finances'}.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              label="Total Spent"
              value={formatCurrency(summary.totalSpent)}
              icon={CreditCard}
              trend={summary.averageMonthlySpending > 0 ? 'up' : 'neutral'}
              hint={`Avg ${formatCurrency(summary.averageMonthlySpending)}/month`}
            />
            <SummaryCard
              label="Total Received"
              value={formatCurrency(summary.totalReceived)}
              icon={Wallet}
              trend={summary.totalReceived > summary.totalSpent ? 'up' : 'down'}
              hint="Income this period"
            />
            <SummaryCard
              label="Net Balance"
              value={formatCurrency(summary.netBalance)}
              icon={TrendingUp}
              trend={summary.netBalance >= 0 ? 'up' : 'down'}
              hint="Income minus expenses"
            />
            <SummaryCard
              label="Transactions"
              value={summary.transactionCount}
              icon={BarChart3}
              trend="neutral"
              hint="Total recorded"
            />
          </div>

          {/* Category Breakdown */}
          <GlassCard hoverLift>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-on-surface">Category Breakdown</h3>
                <PieChart className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div className="space-y-4">
                {categoryBreakdown.map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-on-surface-variant min-w-[80px]">
                        {c.category}
                      </span>
                      <div className="flex-1 mt-2 h-2.5 overflow-hidden rounded-full bg-surface-container-highest/80">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-on-surface ml-4 min-w-[100px] text-right">
                      {formatCurrency(c.amount)} ({Math.round(c.percentage)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Recent Transactions */}
          <GlassCard hoverLift>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-on-surface">Recent Transactions</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/insights')}>
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {recentTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low/40">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        t.type === 'income' ? 'bg-secondary' : 'bg-primary'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-on-surface">{t.description}</p>
                        <p className="text-xs text-on-surface-variant">{t.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        t.type === 'income' ? 'text-secondary' : 'text-primary'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {t.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/upload')}>
              {hasUploadedData ? 'Upload Another File' : 'Try Upload Demo'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/insights')}>
              View Insights
            </Button>
            {!hasUploadedData && (
              <Button variant="outline" onClick={() => navigate('/signup')}>
                Sign Up for Real
              </Button>
            )}
          </div>
        </motion.div>
      </PageContainer>
    )
  }

  if (loading) {
    return <LoadingOverlay message="Loading your financial data..." />
  }

  if (error) {
    return (
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <SectionHeader
            title="Dashboard Error"
            description="We couldn't load your financial data"
          />
          
          <GlassCard className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-error/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-error" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">
                  Something went wrong
                </h3>
                <p className="text-on-surface-variant mb-6">
                  {error}
                </p>
              </div>
              
              <Button onClick={loadDashboardData}>
                Try Again
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </PageContainer>
    )
  }

  if (!dashboardData) {
    return (
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <SectionHeader
            title="No Data Yet"
            description="Upload your first CSV file to see your spending insights"
          />
          
          <GlassCard className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">
                  Start Tracking Your Spending
                </h3>
                <p className="text-on-surface-variant mb-6">
                  Upload your bank statement CSV to get personalized insights
                </p>
              </div>
              
              <Button onClick={() => navigate('/upload')}>
                Upload CSV File
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </PageContainer>
    )
  }

  const { summary, recentTransactions, categoryBreakdown, monthlyTrend } = dashboardData
  const maxTrendValue = Math.max(...monthlyTrend.map(m => Math.max(m.income, m.expense)), 1000)

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        <SectionHeader
          title={welcomeName ? `Welcome back, ${welcomeName}` : 'Dashboard'}
          description="Your financial overview and spending insights"
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            label="Total Spent"
            value={formatCurrency(summary.totalSpent)}
            icon={CreditCard}
            trend={summary.averageMonthlySpending > 0 ? 'up' : 'neutral'}
            hint={`Avg ${formatCurrency(summary.averageMonthlySpending)}/month`}
          />
          <SummaryCard
            label="Total Received"
            value={formatCurrency(summary.totalReceived)}
            icon={Wallet}
            trend={summary.totalReceived > summary.totalSpent ? 'up' : 'down'}
            hint="Income this period"
          />
          <SummaryCard
            label="Net Balance"
            value={formatCurrency(summary.netBalance)}
            icon={TrendingUp}
            trend={summary.netBalance >= 0 ? 'up' : 'down'}
            hint="Income minus expenses"
          />
          <SummaryCard
            label="Transactions"
            value={summary.transactionCount}
            icon={BarChart3}
            trend="neutral"
            hint="Total recorded"
          />
        </div>

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <GlassCard hoverLift>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-on-surface">Category Breakdown</h3>
                <PieChart className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div className="space-y-4">
                {categoryBreakdown.map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-on-surface-variant min-w-[80px]">
                        {c.category}
                      </span>
                      <div className="flex-1 mt-2 h-2.5 overflow-hidden rounded-full bg-surface-container-highest/80">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-on-surface ml-4 min-w-[100px] text-right">
                      {formatCurrency(c.amount)} ({c.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <GlassCard hoverLift>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-on-surface">Recent Transactions</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/insights')}>
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {recentTransactions.map((t, i) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low/40">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        t.type === 'income' ? 'bg-secondary' : 'bg-primary'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-on-surface">{t.description}</p>
                        <p className="text-xs text-on-surface-variant">{t.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        t.type === 'income' ? 'text-secondary' : 'text-primary'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Monthly Trend */}
        {monthlyTrend.length > 0 && (
          <GlassCard hoverLift>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-on-surface">Monthly Trend</h3>
                <TrendingUp className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div className="space-y-4">
                {monthlyTrend.map((m) => (
                  <div key={m.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-on-surface-variant">
                        {new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <div className="flex gap-4">
                        <span className="text-secondary">Income: {formatCurrency(m.income)}</span>
                        <span className="text-primary">Expense: {formatCurrency(m.expense)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(m.income / maxTrendValue) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex-1 bg-secondary rounded-full"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(m.expense / maxTrendValue) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex-1 bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Story Panel */}
        {summary.largestTransaction && (
          <StoryPanel
            title="Largest Transaction"
            body={`Your biggest expense was ${summary.largestTransaction.description} for ${formatCurrency(summary.largestTransaction.amount)} in the ${summary.largestTransaction.category} category on ${new Date(summary.largestTransaction.date).toLocaleDateString()}.`}
          />
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/upload')}>
            Upload New CSV
          </Button>
          <Button variant="secondary" onClick={() => navigate('/insights')}>
            View Insights
          </Button>
        </div>
      </motion.div>
    </PageContainer>
  )
}
