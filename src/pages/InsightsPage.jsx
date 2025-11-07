import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, TrendingUp, TrendingDown, Calendar, Target, Award, Users, Clock, Heart, Zap, Book, Info, Shield, Crown, Sparkles, Activity, BarChart3, ArrowUpRight, ArrowDownRight, PieChart, CheckCircle2 } from 'lucide-react'
import SafeComponent from '../components/SafeComponent'
import { CardSkeleton } from '../components/Skeleton'
import { cacheManager as cache } from '../utils/cacheManager'

import WellnessBreakdown from '../components/premium/WellnessBreakdown'
import AnimatedNumber from '../components/common/AnimatedNumber'
import OnboardingTip from '../components/common/OnboardingTip'
import InfoTooltip from '../components/common/InfoTooltip'
import { getPremiumStatus } from '../utils/premiumUtils'
import { trackEvent, EVENTS, trackPageView } from '../utils/analytics'
import { 
  calculateAverageMood, 
  detectWeekdayPatterns, 
  calculateTrend, 
  findBestAndWorstDays,
  calculateConsistencyScore,
  calculateStreak,
  detectMoodTriggers,
  generateInsights,
  generateSuggestions,
  getMoodBreakdown
} from '../utils/moodAnalysis'
import { useMoodsSWR } from '../hooks/useMoodsSWR'
import MoodTrendChart from '../components/MoodTrendChart'
import { motion } from 'framer-motion'

const moodLabels = {
  5: { label: 'Amazing', emoji: '' },
  4: { label: 'Good', emoji: '' },
  3: { label: 'Okay', emoji: '' },
  2: { label: 'Low', emoji: '' },
  1: { label: 'Struggling', emoji: '' }
}

function InsightsPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('week')
  const [analysis, setAnalysis] = useState(null)
  const { isPremium } = getPremiumStatus()

  // Use SWR hook for mood data
  const { allMoods, loading: moodsLoading } = useMoodsSWR()

  // Filter moods based on period using SWR data
  const moods = useMemo(() => {
    if (!allMoods || Object.keys(allMoods).length === 0) return []

    const moodEntries = Object.entries(allMoods).map(([date, mood]) => ({
      date,
      mood: mood.mood,
      emoji: mood.emoji,
      label: mood.label,
      note: mood.note,
      timestamp: mood.timestamp
    })).sort((a, b) => new Date(a.date) - new Date(b.date))

    // Filter by period
    const now = new Date()
    let filteredMoods = moodEntries

    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredMoods = moodEntries.filter(m => new Date(m.date) >= weekAgo)
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filteredMoods = moodEntries.filter(m => new Date(m.date) >= monthAgo)
    }

    return filteredMoods
  }, [allMoods, period])

  // Analyze data when moods change
  useEffect(() => {
    if (moods.length >= 3) {
      const analysisData = analyzeData(moods, Object.values(allMoods).map(mood => ({
        date: Object.keys(allMoods).find(key => allMoods[key] === mood),
        ...mood
      })))
      setAnalysis(analysisData)
    } else {
      setAnalysis(null)
    }
  }, [moods, allMoods])

  useEffect(() => {
    // Track page view only once on mount
    trackPageView('insights')
  }, [])

  const analyzeData = (currentMoods, allMoods) => {
    const userData = JSON.parse(localStorage.getItem('space4u_user') || '{}')
    const circleActivity = JSON.parse(localStorage.getItem('space4u_user_posts') || '[]')
    
    const averageMood = calculateAverageMood(currentMoods)
    const breakdown = getMoodBreakdown(currentMoods)
    const weekdayPatterns = detectWeekdayPatterns(currentMoods)
    const { best, worst } = findBestAndWorstDays(currentMoods)
    const streak = calculateStreak(allMoods)
    const triggers = detectMoodTriggers(currentMoods)
    const insights = generateInsights(currentMoods, circleActivity, userData)
    const suggestions = generateSuggestions(currentMoods, userData, circleActivity)
    
    // Calculate trend
    let trend = 0
    if (period === 'week' && allMoods.length >= 14) {
      const lastWeek = allMoods.slice(-14, -7)
      trend = calculateTrend(currentMoods, lastWeek)
    } else if (period === 'month' && allMoods.length >= 60) {
      const lastMonth = allMoods.slice(-60, -30)
      trend = calculateTrend(currentMoods, lastMonth)
    }

    const totalDays = period === 'week' ? 7 : period === 'month' ? 30 : allMoods.length
    const consistencyScore = calculateConsistencyScore(currentMoods, totalDays)

    const analysisData = {
      averageMood,
      breakdown,
      weekdayPatterns,
      best,
      worst,
      streak,
      triggers,
      insights,
      suggestions,
      trend,
      consistencyScore,
      totalEntries: allMoods.length
    }
    
    setAnalysis(analysisData)
    return analysisData
  }

  const getPeriodLabel = () => {
    switch (period) {
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'all': return 'All Time'
      default: return 'This Week'
    }
  }

  const getMinDataMessage = () => {
    const needed = period === 'week' ? 7 : period === 'month' ? 15 : 7
    const current = moods.length
    return {
      needed,
      current,
      message: `${current}/${needed} days needed for ${period === 'week' ? 'weekly' : period === 'month' ? 'monthly' : ''} insights`
    }
  }

  if (moodsLoading) {
    return (
      <SafeComponent>
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 rounded-3xl animate-pulse"></div>
            <CardSkeleton />
            <div className="grid gap-4 md:grid-cols-2">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      </SafeComponent>
    )
  }

  const minData = getMinDataMessage()

  return (
    <SafeComponent>
    <div className="max-w-4xl mx-auto animate-fade-in">
      <OnboardingTip page="insights" />
      
      {/* Disclaimer Banner */}
      <div className="card p-4 bg-blue-50 border border-blue-200 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1 text-gray-900">About Your Insights</p>
            <p className="text-gray-700">
              These insights are generated from your mood tracking data using pattern recognition algorithms. 
              They are meant to help you understand your emotional patterns, not to diagnose or treat any condition. 
              For professional mental health support, please consult a licensed therapist or counselor.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-6 md:p-8 mb-6 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-8 h-8 text-white" />
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Your Insights</h1>
              </div>
              <p className="text-white/90">AI-powered patterns from your mood data</p>
            </div>
            {isPremium && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                <Crown size={14} />
                Premium
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['week', 'month', 'all'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                  period === p 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                {p === 'week' ? '7 Days' : p === 'month' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Insufficient Data */}
      {!analysis ? (
        <div className="card p-8 text-center mb-6">
          <Brain className="mx-auto text-primary mb-4" size={48} />
          <h3 className="text-xl font-semibold text-text-primary mb-2">Keep logging to unlock insights!</h3>
          <p className="text-text-secondary mb-4">We need a bit more data to generate meaningful patterns</p>
          <div className="bg-gray-100 rounded-full h-3 mb-2 max-w-xs mx-auto">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${(minData.current / minData.needed) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-text-secondary">{minData.message}</p>
        </div>
      ) : (
        <>
          {/* Premium Wellness Breakdown */}
          {isPremium && (
            <div className="mb-6">
              <WellnessBreakdown />
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-4 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs text-text-secondary">Avg Mood</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">
                <AnimatedNumber value={parseFloat(analysis.averageMood.toFixed(1))} duration={1000} decimals={1} />
                <span className="text-sm text-text-secondary">/5</span>
              </div>
              {analysis.trend !== 0 && (
                <div className={`flex items-center gap-1 text-xs mt-1 ${analysis.trend > 0 ? 'text-success' : 'text-warning'}`}>
                  {analysis.trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(analysis.trend).toFixed(1)}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-4 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-xs text-text-secondary">Streak</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">
                <AnimatedNumber value={analysis.streak.current} duration={800} />
                <span className="text-sm text-text-secondary"> days</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">Best: {analysis.streak.longest}</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-4 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-xs text-text-secondary">Consistency</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">
                <AnimatedNumber value={analysis.consistencyScore} duration={800} />
                <span className="text-sm text-text-secondary">%</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">{analysis.totalEntries} entries</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-4 hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs text-text-secondary">Best Day</span>
              </div>
              <div className="text-xl font-bold text-text-primary">
                {analysis.best?.emoji || '😊'}
              </div>
              <div className="text-xs text-text-secondary mt-1 truncate">
                {analysis.best ? new Date(analysis.best.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
              </div>
            </motion.div>
          </div>

          {/* Mood Trend Chart */}
          <MoodTrendChart moods={moods} />

          {/* Mood Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                {getPeriodLabel()} Overview
              </h2>
              <InfoTooltip content="Your mood distribution shows patterns in your emotional well-being." />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Average Mood */}
              <div className="text-center">
                <div className="text-4xl mb-2">{moodLabels[Math.round(analysis.averageMood)]?.emoji}</div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  <AnimatedNumber value={parseFloat(analysis.averageMood.toFixed(1)) * 10} duration={1000} />
                  <span className="text-lg">/50</span>
                </div>
                <div className="text-sm text-text-secondary flex items-center justify-center gap-1">
                  Average Mood
                  <InfoTooltip content="Your average mood score across all logged entries. Higher scores indicate better overall mood." />
                </div>
                {analysis.trend !== 0 && (
                  <div className={`text-sm mt-1 ${
                    analysis.trend > 0 ? 'text-success' : 'text-warning'
                  }`}>
                    {analysis.trend > 0 ? 'â†‘' : 'â†“'} {Math.abs(analysis.trend).toFixed(1)} from last {period}
                  </div>
                )}
              </div>

              {/* Mood Breakdown */}
              <div>
                <h4 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                  Mood Distribution
                  <InfoTooltip content="Shows how often you experienced each mood level. This helps identify patterns in your emotional well-being." />
                </h4>
                <div className="space-y-2">
                  {Object.entries(analysis.breakdown).reverse().map(([mood, count]) => {
                    const percentage = (count / moods.length) * 100
                    return count > 0 ? (
                      <div key={mood} className="flex items-center gap-2">
                        <span className="text-lg">{moodLabels[mood]?.emoji}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-text-secondary w-8">{count}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>

              {/* Streak & Consistency */}
              <div>
                <h4 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                  Your Progress
                  <InfoTooltip content="Tracking consistency builds self-awareness. Regular check-ins help you understand your emotional patterns better." />
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <div>
                      <div className="font-medium text-text-primary">
                        <AnimatedNumber value={analysis.streak.current} duration={800} /> day streak
                      </div>
                      <div className="text-xs text-text-secondary">Longest: {analysis.streak.longest} days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <div>
                      <div className="font-medium text-text-primary">
                        <AnimatedNumber value={analysis.consistencyScore} duration={800} />% consistent
                      </div>
                      <div className="text-xs text-text-secondary">
                        <AnimatedNumber value={analysis.totalEntries} duration={1000} /> total check-ins
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Patterns We've Noticed */}
          {analysis.insights.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Patterns We've Noticed
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {analysis.insights.map((insight, index) => (
                  <div key={index} className="card p-4 hover:scale-105 hover:shadow-2xl transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-2xl">{insight.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">{insight.title}</h3>
                        <p className="text-sm text-text-secondary">{insight.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          trackEvent(EVENTS.INSIGHT_EXPLORE_TOOLS, { insightType: insight.title })
                          navigate('/resources')
                        }}
                        className="flex-1 text-xs py-2 px-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
                      >
                        Explore Tools
                      </button>
                      <button 
                        onClick={() => {
                          trackEvent(EVENTS.INSIGHT_FIND_SUPPORT, { insightType: insight.title })
                          navigate('/circles')
                        }}
                        className="flex-1 text-xs py-2 px-3 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors font-medium"
                      >
                        Find Support
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Mood Triggers */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="card p-6">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="text-lg">💔</span>
                When you feel down
              </h3>
              {analysis.triggers.negative.length > 0 ? (
                <div className="space-y-2">
                  {analysis.triggers.negative.map((trigger, index) => (
                    <div key={index} className="text-sm text-text-secondary bg-gray-50 p-2 rounded-lg">
                      {trigger}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">No clear patterns detected yet</p>
              )}
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="text-lg">✨</span>
                What lifts you up
              </h3>
              {analysis.triggers.positive.length > 0 ? (
                <div className="space-y-2">
                  {analysis.triggers.positive.map((trigger, index) => (
                    <div key={index} className="text-sm text-text-secondary bg-success/10 p-2 rounded-lg">
                      {trigger}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">Keep logging to discover what helps!</p>
              )}
            </div>
          </div>

          {/* Personalized Suggestions */}
          {analysis.suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Personalized Suggestions
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{suggestion.icon}</div>
                        <div>
                          <h3 className="font-semibold text-text-primary mb-1">{suggestion.title}</h3>
                          <p className="text-sm text-text-secondary mb-3">{suggestion.description}</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-primary text-white py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                      {suggestion.action}
                    </button>
                  </div>
                ))}
                
                {/* Resource Library Suggestion */}
                <div className="card p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/resources')}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">📚</div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">Explore Resources</h3>
                      <p className="text-sm text-text-secondary mb-3">Access breathing exercises, articles, and wellness tools</p>
                    </div>
                  </div>
                  <button className="w-full bg-secondary text-white py-2 rounded-xl font-medium hover:bg-secondary/90 transition-colors">
                    Browse Library
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Best & Worst Days */}
          {analysis.best && analysis.worst && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="card p-6">
                <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Award className="text-success" size={20} />
                  Your Best Day
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{analysis.best.emoji}</div>
                  <div>
                    <div className="font-medium text-text-primary">
                      {new Date(analysis.best.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    {analysis.best.note && (
                      <div className="text-sm text-text-secondary mt-1">
                        "{analysis.best.note.slice(0, 60)}..."
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Heart className="text-warning" size={20} />
                  A Tough Day
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{analysis.worst.emoji}</div>
                  <div>
                    <div className="font-medium text-text-primary">
                      {new Date(analysis.worst.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-text-secondary mt-1">
                      Remember: tough days don't last, but you do 
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resource Library CTA */}
          <div className="card p-6 mb-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/resources')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Book className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-1">Need Support Right Now?</h3>
                <p className="text-text-secondary text-sm">Access breathing exercises, crisis resources, and wellness articles</p>
              </div>
              <button className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                Get Help
              </button>
            </div>
          </div>
        </>
      )}

      {/* Privacy & Professional Help Notice */}
      <div className="space-y-4">
        <div className="card p-4 bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-gray-900 mb-1">Privacy First</p>
              <p className="text-gray-700">
                Your data is private and stored only on your device. Insights are generated locally - we never see your moods or personal information.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4 bg-purple-50 border border-purple-200">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-gray-900 mb-1">When to Seek Professional Help</p>
              <p className="text-gray-700">
                If you're experiencing persistent low moods, anxiety, or thoughts of self-harm, please reach out to a mental health professional. 
                These insights are educational tools, not a substitute for professional care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SafeComponent>
  )
}

export default InsightsPage
