import { useState, useEffect } from 'react'
import { TrendingDown, AlertTriangle, Sparkles } from 'lucide-react'

function MoodPrediction() {
  const [predictions, setPredictions] = useState([])
  const [isPremium] = useState(false)

  useEffect(() => {
    if (!isPremium) return

    const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
    const entries = Object.values(moods).sort((a, b) => new Date(a.date) - new Date(b.date))
    
    if (entries.length < 7) return

    const last7 = entries.slice(-7)
    const avgMood = last7.reduce((sum, e) => sum + e.mood, 0) / 7
    const trend = last7[6].mood - last7[0].mood

    const next7Days = []
    for (let i = 1; i <= 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const predicted = Math.max(1, Math.min(5, Math.round(avgMood + (trend * 0.3))))
      const confidence = Math.max(60, 100 - (i * 5))
      
      next7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: predicted,
        confidence
      })
    }

    setPredictions(next7Days)
  }, [isPremium])

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😊']

  if (!isPremium) {
    return (
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center">
        <Sparkles size={48} className="mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Mood Prediction AI</h3>
        <p className="mb-6 opacity-90">
          Unlock AI-powered mood forecasting with Premium
        </p>
        <ul className="text-left max-w-md mx-auto mb-6 space-y-2">
          <li className="flex items-center gap-2">
            <span>✓</span> 7-day mood predictions
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span> Risk alerts for low mood periods
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span> Preventive suggestions
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span> Confidence scores
          </li>
        </ul>
        <a
          href="/premium"
          className="inline-block px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-100"
        >
          Upgrade to Premium
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">7-Day Mood Forecast</h3>
        <div className="space-y-3">
          {predictions.map((pred, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{moodEmojis[pred.mood - 1]}</span>
                <div>
                  <p className="font-medium text-text-primary">{pred.date}</p>
                  <p className="text-sm text-text-secondary">Predicted Mood: {pred.mood}/5</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">{pred.confidence}%</p>
                <p className="text-xs text-text-secondary">Confidence</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {predictions.some(p => p.mood <= 2) && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-orange-600 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-orange-900 mb-2">Low Mood Alert</h4>
              <p className="text-sm text-orange-800 mb-3">
                Our AI predicts potential low mood periods ahead. Consider these preventive actions:
              </p>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Schedule time with supportive friends</li>
                <li>• Plan enjoyable activities</li>
                <li>• Ensure adequate sleep</li>
                <li>• Practice self-care routines</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MoodPrediction
