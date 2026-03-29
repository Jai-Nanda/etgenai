import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Compass,
  Lightbulb,
  LineChart,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Target,
  Heart,
  AlertCircle
} from 'lucide-react'
import PageContainer from '../components/PageContainer'
import SectionHeader from '../components/SectionHeader'
import InsightCard from '../components/InsightCard'
import StoryPanel from '../components/StoryPanel'
import GlassCard from '../components/GlassCard'
import Button from '../components/Button'
import LoadingOverlay from '../components/LoadingOverlay'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { insightsService } from '../services/insightsService'

export default function InsightsPage() {
  const navigate = useNavigate()
  const { user, isGuest } = useAuth()
  const { storySourceName } = useApp()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [insightsData, setInsightsData] = useState(null)

  useEffect(() => {
    if (isGuest) {
      setLoading(false)
      return
    }

    loadInsights()
  }, [isGuest, loadInsights])

  const loadInsights = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await insightsService.getInsights()
      
      if (response.success) {
        setInsightsData(response.data)
      } else {
        setError(response.message || 'Failed to load insights')
        setInsightsData(null)
      }
    } catch (error) {
      console.error('Insights load error:', error)
      setError('Failed to load insights. Please try again later.')
      setInsightsData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  if (isGuest) {
    // Check if guest has uploaded data - add safety check
    const hasUploadedData = storySourceName && storySourceName !== 'demo_data.csv'
    
    // Show demo insights for guest users (or uploaded data insights if available)
    const demoInsights = {
      spendingPersonality: hasUploadedData ? 'Diverse Spender' : 'Balanced Spender',
      patterns: hasUploadedData ? [
        {
          type: 'category_focused',
          title: 'Shopping Enthusiast',
          description: 'Shopping accounts for 38.5% of your expenses, indicating a focus on retail therapy and lifestyle purchases',
          impact: 'medium'
        },
        {
          type: 'large_transactions',
          title: 'Big Ticket Spender',
          description: 'You make several large purchases over $200, suggesting comfort with significant spending decisions',
          impact: 'high'
        }
      ] : [
        {
          type: 'weekend_spender',
          title: 'Weekend Warrior',
          description: 'You tend to spend more on weekends, particularly on dining out and entertainment',
          impact: 'medium'
        },
        {
          type: 'category_focused',
          title: 'Food Enthusiast',
          description: 'Food and dining account for 36% of your expenses, showing your passion for culinary experiences',
          impact: 'medium'
        }
      ],
      recommendations: hasUploadedData ? [
        {
          type: 'budget_alert',
          title: 'Review Shopping Budget',
          description: 'Shopping accounts for 38.5% of your expenses. Consider setting a monthly shopping budget to optimize spending',
          priority: 'high'
        },
        {
          type: 'savings',
          title: 'Increase Savings Rate',
          description: 'You have a positive cash flow. Consider saving at least 20% of your income for future goals',
          priority: 'high'
        }
      ] : [
        {
          type: 'budget_alert',
          title: 'Review Food Spending',
          description: 'Food accounts for 36% of your expenses. Consider setting a monthly food budget to optimize spending',
          priority: 'medium'
        },
        {
          type: 'savings',
          title: 'Increase Savings Rate',
          description: 'You have a positive cash flow. Consider saving at least 20% of your income for future goals',
          priority: 'high'
        }
      ],
      warnings: [
        {
          type: 'frequent_small',
          title: 'Frequent Small Purchases',
          description: 'Multiple small transactions can add up quickly. Consider tracking daily spending more closely',
          severity: 'low'
        }
      ],
      habits: {
        good: [
          {
            title: 'Positive Cash Flow',
            description: 'Your income exceeds your expenses, showing good financial management'
          },
          {
            title: 'Diverse Spending',
            description: 'You spread your spending across multiple categories, indicating balanced lifestyle choices'
          }
        ],
        bad: [
          {
            title: 'Weekend Overspending',
            description: 'Weekend spending is significantly higher than weekday spending, potentially affecting budget'
          }
        ]
      }
    }

    const { spendingPersonality, patterns, recommendations, warnings, habits } = demoInsights

    return (
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeader
              eyebrow={hasUploadedData ? "Demo Insights" : "Demo Insights"}
              title={hasUploadedData ? `Analysis of ${storySourceName}` : "Sample Spending Analysis"}
              description={hasUploadedData 
                ? "AI-powered insights from your uploaded data in demo mode. Sign up to save and get ongoing analysis."
                : "Explore AI-powered insights with demo data. Sign up to analyze your real spending patterns."
              }
            />
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <GlassCard className="p-4 border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary">
                  {hasUploadedData ? 'Demo Analysis Complete' : 'Demo Mode Active'}
                </h4>
                <p className="text-sm text-on-surface-variant">
                  {hasUploadedData 
                    ? `Analysis of your ${storySourceName} file in demo mode. Insights are temporary. ` 
                    : 'Sample insights based on demo data. '
                  }
                  <span className="underline cursor-pointer" onClick={() => navigate('/signup')}>Sign up</span> to {hasUploadedData ? 'save your analysis permanently' : 'get personalized insights'}.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Spending Personality */}
          <InsightCard
            type="trend"
            icon={Sparkles}
            title="Your Spending Personality"
            accent="primary"
          >
            <div className="space-y-4">
              <div className="text-2xl font-bold text-primary">
                {spendingPersonality}
              </div>
              <p className="text-on-surface-variant">
                Based on your spending patterns, you exhibit traits of a {spendingPersonality.toLowerCase()}. This suggests balanced financial behavior with room for optimization.
              </p>
            </div>
          </InsightCard>

          {/* Patterns */}
          {patterns.length > 0 && (
            <div className="space-y-6">
              <SectionHeader
                title="Spending Patterns"
                description="We've identified these interesting patterns in your spending behavior"
              />
              <div className="grid gap-6 md:grid-cols-2">
                {patterns.map((pattern, index) => (
                  <InsightCard
                    key={index}
                    type={pattern.impact === 'high' ? 'warning' : 'insight'}
                    icon={pattern.impact === 'high' ? AlertTriangle : Lightbulb}
                    title={pattern.title}
                    accent={pattern.impact === 'high' ? 'error' : 'primary'}
                  >
                    <p className="text-on-surface-variant">
                      {pattern.description}
                    </p>
                  </InsightCard>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-6">
              <SectionHeader
                title="Personalized Recommendations"
                description="Actionable insights to improve your financial health"
              />
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <InsightCard
                    key={index}
                    type="positive"
                    icon={Target}
                    title={rec.title}
                    accent="secondary"
                  >
                    <p className="text-on-surface-variant">
                      {rec.description}
                    </p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'high' 
                          ? 'bg-error/20 text-error' 
                          : rec.priority === 'medium'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary/20 text-secondary'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                  </InsightCard>
                ))}
              </div>
            </div>
          )}

          {/* Habits Analysis */}
          {(habits.good.length > 0 || habits.bad.length > 0) && (
            <div className="space-y-6">
              <SectionHeader
                title="Spending Habits"
                description="Your financial behaviors broken down into good and bad habits"
              />
              
              {habits.good.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5" />
                    Good Habits
                  </h3>
                  {habits.good.map((habit, index) => (
                    <InsightCard
                      key={index}
                      type="positive"
                      icon={Heart}
                      title={habit.title}
                      accent="secondary"
                    >
                      <p className="text-on-surface-variant">
                        {habit.description}
                      </p>
                    </InsightCard>
                  ))}
                </div>
              )}

              {habits.bad.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-error flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Areas for Improvement
                  </h3>
                  {habits.bad.map((habit, index) => (
                    <InsightCard
                      key={index}
                      type="warning"
                      icon={AlertCircle}
                      title={habit.title}
                      accent="error"
                    >
                      <p className="text-on-surface-variant">
                        {habit.description}
                      </p>
                    </InsightCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/dashboard')}>
              View Dashboard
            </Button>
            <Button variant="secondary" onClick={() => navigate('/signup')}>
              Sign Up for Real Insights
            </Button>
          </div>
        </motion.div>
      </PageContainer>
    )
  }

  if (loading) {
    return <LoadingOverlay message="Analyzing your spending patterns..." />
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
            title="Insights Error"
            description="We couldn't analyze your spending data"
          />
          
          <GlassCard className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-error/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-error" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">
                  Analysis Failed
                </h3>
                <p className="text-on-surface-variant mb-6">
                  {error}
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
                <Button variant="secondary" onClick={loadInsights}>
                  Try Again
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </PageContainer>
    )
  }

  if (!isGuest && !insightsData) {
    return (
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <SectionHeader
            title="No Data Available"
            description="Upload your financial data to get spending insights"
          />
          
          <GlassCard className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Compass className="w-8 h-8 text-primary" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">
                  Start Your Analysis
                </h3>
                <p className="text-on-surface-variant mb-6">
                  Upload your financial data to get personalized spending insights and recommendations.
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/upload')}>
                  Upload Data
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </PageContainer>
    )
  }

  // For authenticated users, use the loaded insights data
  const { spendingPersonality, patterns, recommendations, warnings, habits } = insightsData || {
    spendingPersonality: 'No Data',
    patterns: [],
    recommendations: [],
    warnings: [],
    habits: { good: [], bad: [] }
  }

  return (
    <PageContainer>
      <LoadingOverlay open={loading} />
      
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
        className="space-y-12"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            eyebrow="AI-Powered Analysis"
            title="Your Spending Story Revealed"
            description={`Hello ${user?.name || 'there'}! Here's what your spending patterns tell us about your financial personality.`}
          />
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Spending Personality */}
        <InsightCard
          type="trend"
          icon={Sparkles}
          title="Your Spending Personality"
          accent="primary"
        >
          <div className="space-y-4">
            <div className="text-2xl font-bold text-primary">
              {spendingPersonality}
            </div>
            <p className="text-on-surface-variant">
              Based on your spending patterns, you exhibit traits of a {spendingPersonality.toLowerCase()}. This suggests certain behaviors and tendencies in how you manage your finances.
            </p>
          </div>
        </InsightCard>

        {/* Patterns */}
        {patterns && patterns.length > 0 && (
          <div className="space-y-6">
            <SectionHeader
              title="Spending Patterns"
              description="We've identified these interesting patterns in your spending behavior"
            />
            <div className="grid gap-6 md:grid-cols-2">
              {patterns.map((pattern, index) => (
                <InsightCard
                  key={index}
                  type={pattern.impact === 'high' ? 'warning' : 'insight'}
                  icon={pattern.impact === 'high' ? AlertTriangle : Lightbulb}
                  title={pattern.title}
                  accent={pattern.impact === 'high' ? 'error' : 'primary'}
                >
                  <p className="text-on-surface-variant">
                    {pattern.description}
                  </p>
                </InsightCard>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-6">
            <SectionHeader
              title="Personalized Recommendations"
              description="Actionable insights to improve your financial health"
            />
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <InsightCard
                  key={index}
                  type="positive"
                  icon={Target}
                  title={rec.title}
                  accent="secondary"
                >
                  <p className="text-on-surface-variant">
                    {rec.description}
                  </p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.priority === 'high' 
                        ? 'bg-error/20 text-error' 
                        : rec.priority === 'medium'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary/20 text-secondary'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                </InsightCard>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings && warnings.length > 0 && (
          <div className="space-y-6">
            <SectionHeader
              title="Areas of Concern"
              description="Keep an eye on these spending behaviors"
            />
            <div className="space-y-4">
              {warnings.map((warning, index) => (
                <InsightCard
                  key={index}
                  type="warning"
                  icon={AlertCircle}
                  title={warning.title}
                  accent="error"
                >
                  <p className="text-on-surface-variant">
                    {warning.description}
                  </p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      warning.severity === 'high' 
                        ? 'bg-error/20 text-error' 
                        : warning.severity === 'medium'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary/20 text-secondary'
                    }`}>
                      {warning.severity} severity
                    </span>
                  </div>
                </InsightCard>
              ))}
            </div>
          </div>
        )}

        {/* Habits Analysis */}
        {(habits && ((habits.good && habits.good.length > 0) || (habits.bad && habits.bad.length > 0))) && (
          <div className="space-y-6">
            <SectionHeader
              title="Spending Habits"
              description="Your financial behaviors broken down into good and bad habits"
            />
            
            {(habits && habits.good && habits.good.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5" />
                  Good Habits
                </h3>
                {habits.good.map((habit, index) => (
                  <InsightCard
                    key={index}
                    type="positive"
                    icon={Heart}
                    title={habit.title}
                    accent="secondary"
                  >
                    <p className="text-on-surface-variant">
                      {habit.description}
                    </p>
                  </InsightCard>
                ))}
              </div>
            )}

            {(habits && habits.bad && habits.bad.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-error flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Areas for Improvement
                </h3>
                {habits.bad.map((habit, index) => (
                  <InsightCard
                    key={index}
                    type="warning"
                    icon={AlertCircle}
                    title={habit.title}
                    accent="error"
                  >
                    <p className="text-on-surface-variant">
                      {habit.description}
                    </p>
                  </InsightCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Story Panel */}
        <StoryPanel
          title="Your Financial Story"
          body={`As a ${spendingPersonality.toLowerCase()}, you show ${patterns.length > 0 ? 'distinctive patterns' : 'consistent behavior'} in your spending. ${recommendations.length > 0 ? `Consider focusing on ${recommendations[0]?.title?.toLowerCase() || 'our recommendations'} to improve your financial health.` : ''} ${warnings.length > 0 ? `Be mindful of ${warnings[0]?.title?.toLowerCase() || 'potential issues'} that could impact your financial goals.` : ''}`}
        />

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/dashboard')}>
            View Dashboard
          </Button>
          <Button variant="secondary" onClick={() => navigate('/upload')}>
            Upload New Data
          </Button>
        </div>
      </motion.div>
    </PageContainer>
  )
}
