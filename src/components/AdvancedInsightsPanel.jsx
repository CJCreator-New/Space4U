import { TrendingUp, Brain, Target, Lightbulb, Calendar } from 'lucide-react'
import { 
  calculateMoodCorrelations, 
  predictNextMood, 
  detectMoodPatterns,
  generatePersonalizedInsights,
  generateRecommendations
} from '../utils/advancedAnalytics'

function AdvancedInsightsPanel({ moods }) {
  if (moods.length < 7) return null

  const correlations = calculateMoodCorrelations(moods)
  const prediction = predictNextMood(moods)
  const patterns = detectMoodPatterns(moods)
  const insights = generatePersonalizedInsights(moods, {})
  const recommendations = generateRecommendations(moods, patterns)

  return (
    <div className="space-y-6">
      {/* Mood Prediction */}
      {prediction && (
        <div className="card p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="text-purple-600 dark:text-purple-400" size={24} />
            <h3 className="text-lg font-semibold text-text-primary dark:text-white">Mood Forecast</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-5xl">
              {['😰', '😢', '😐', '🙂', '😊'][prediction.prediction - 1]}
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-text-primary dark:text-white mb-1">
                Predicted: {['Struggling', 'Low', 'Okay', 'Good', 'Amazing'][prediction.prediction - 1]}
              </div>
              <div className="text-sm text-text-secondary dark:text-gray-400">
                {prediction.confidence}% confidence • Trend: {prediction.trend}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day of Week Analysis */}
      {correlations && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-text-primary dark:text-white">Best Days</h3>
          </div>
          <div className="space-y-2">
            {correlations.slice(0, 3).map((day, idx) => (
              <div key={day.day} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary dark:text-white">{day.day}</div>
                  <div className="text-sm text-text-secondary dark:text-gray-400">{day.count} entries</div>
                </div>
                <div className="text-xl font-bold text-primary">{day.average}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patterns Detected */}
      {patterns.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            <h3 className="text-lg font-semibold text-text-primary dark:text-white">Patterns Detected</h3>
          </div>
          <div className="space-y-3">
            {patterns.map((pattern, idx) => (
              <div key={idx} className={`p-4 rounded-xl ${
                pattern.impact === 'positive' ? 'bg-green-50 dark:bg-green-900/20' :
                pattern.impact === 'attention' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                'bg-blue-50 dark:bg-blue-900/20'
              }`}>
                <div className="font-medium text-text-primary dark:text-white mb-1">
                  {pattern.description}
                </div>
                <div className="text-sm text-text-secondary dark:text-gray-400">
                  Impact: {pattern.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Insights */}
      {insights.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-orange-600 dark:text-orange-400" size={24} />
            <h3 className="text-lg font-semibold text-text-primary dark:text-white">Personal Insights</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl">{insight.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary dark:text-white mb-1">{insight.title}</div>
                  <div className="text-sm text-text-secondary dark:text-gray-400">{insight.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="text-yellow-600 dark:text-yellow-400" size={24} />
            <h3 className="text-lg font-semibold text-text-primary dark:text-white">Recommendations</h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                <div className="font-medium text-text-primary dark:text-white mb-2">{rec.title}</div>
                <div className="text-sm text-text-secondary dark:text-gray-400 mb-3">{rec.description}</div>
                <button className="text-sm font-medium text-primary hover:text-primary-dark">
                  {rec.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedInsightsPanel
