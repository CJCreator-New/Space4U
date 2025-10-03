import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, TrendingUp, Calendar, Target, Award, Users, Clock, Heart, Zap, Book } from 'lucide-react'
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

const moodLabels = {
  5: { label: 'Amazing', emoji: '😊' },
  4: { label: 'Good', emoji: '🙂' },
  3: { label: 'Okay', emoji: '😐' },
  2: { label: 'Low', emoji: '😢' },
  1: { label: 'Struggling', emoji: '😰' }
}

function InsightsPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('week')
  const [moods, setMoods] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMoodData()
  }, [period])

  const loadMoodData = () => {
    const savedMoods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
    const moodEntries = Object.entries(savedMoods).map(([date, mood]) => ({
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

    setMoods(filteredMoods)
    
    if (filteredMoods.length >= 3) {
      analyzeData(filteredMoods, moodEntries)
    } else {
      setAnalysis(null)
    }
    
    setLoading(false)
  }

  const analyzeData = (currentMoods, allMoods) => {
    const userData = JSON.parse(localStorage.getItem('safespace_user') || '{}')
    const circleActivity = JSON.parse(localStorage.getItem('safespace_user_posts') || '[]')
    
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

    setAnalysis({
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
    })
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="card p-6">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="card p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const minData = getMinDataMessage()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Your Insights</h1>
            <p className="text-text-secondary">AI-powered patterns and suggestions</p>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'all'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  period === p ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'All Time'}
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
          {/* Hero Summary Card */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">{getPeriodLabel()} at a Glance</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Average Mood */}
              <div className="text-center">
                <div className="text-4xl mb-2">{moodLabels[Math.round(analysis.averageMood)]?.emoji}</div>
                <div className="text-2xl font-bold text-text-primary mb-1">{analysis.averageMood.toFixed(1)}</div>
                <div className="text-sm text-text-secondary">Average Mood</div>
                {analysis.trend !== 0 && (
                  <div className={`text-sm mt-1 ${
                    analysis.trend > 0 ? 'text-success' : 'text-warning'
                  }`}>
                    {analysis.trend > 0 ? '↑' : '↓'} {Math.abs(analysis.trend).toFixed(1)} from last {period}
                  </div>
                )}
              </div>

              {/* Mood Breakdown */}
              <div>
                <h4 className="font-medium text-text-primary mb-3">Mood Distribution</h4>
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
                <h4 className="font-medium text-text-primary mb-3">Your Progress</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <div>
                      <div className="font-medium text-text-primary">{analysis.streak.current} day streak</div>
                      <div className="text-xs text-text-secondary">Longest: {analysis.streak.longest} days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <div>
                      <div className="font-medium text-text-primary">{analysis.consistencyScore}% consistent</div>
                      <div className="text-xs text-text-secondary">{analysis.totalEntries} total check-ins</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Patterns We've Noticed */}
          {analysis.insights.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Patterns We've Noticed</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {analysis.insights.map((insight, index) => (
                  <div key={index} className="card p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{insight.icon}</div>
                      <div>
                        <h3 className="font-semibold text-text-primary mb-1">{insight.title}</h3>
                        <p className="text-sm text-text-secondary">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood Triggers */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="card p-6">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="text-lg">😢</span>
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
                <span className="text-lg">😊</span>
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Try This Week</h2>
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
            </div>
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
                      Remember: tough days don't last, but you do 💪
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

      {/* Privacy Note */}
      <div className="card p-4 bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="text-lg">🔒</span>
          <div>
            <span className="font-medium">Your data is private and stored only on your device.</span>
            <span className="ml-1">AI insights are generated locally - we never see your moods.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InsightsPage