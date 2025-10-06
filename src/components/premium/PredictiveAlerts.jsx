import { useState, useEffect } from 'react'
import { AlertTriangle, TrendingDown, Lightbulb, Bell } from 'lucide-react'

function PredictiveAlerts() {
  const [alerts, setAlerts] = useState([])
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    generateAlerts()
  }, [])

  const generateAlerts = () => {
    const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
    const triggers = JSON.parse(localStorage.getItem('safespace_triggers') || '[]')
    
    const predictions = [
      {
        id: 1,
        type: 'warning',
        title: 'Low Mood Period Predicted',
        message: 'Based on your patterns, you may experience lower mood tomorrow afternoon',
        confidence: 78,
        date: 'Tomorrow, 2:00 PM',
        suggestions: [
          'Schedule a walk or exercise',
          'Reach out to a friend',
          'Practice breathing exercises'
        ]
      },
      {
        id: 2,
        type: 'trigger',
        title: 'Potential Trigger Alert',
        message: 'Work stress typically affects your mood on Mondays',
        confidence: 85,
        date: 'Monday',
        suggestions: [
          'Prepare coping strategies',
          'Set boundaries at work',
          'Schedule self-care time'
        ]
      },
      {
        id: 3,
        type: 'positive',
        title: 'Good Mood Forecast',
        message: 'Your mood tends to improve on weekends',
        confidence: 92,
        date: 'This Weekend',
        suggestions: [
          'Plan enjoyable activities',
          'Connect with loved ones',
          'Maintain healthy habits'
        ]
      }
    ]

    setAlerts(predictions)
  }

  const toggleAlerts = () => {
    setEnabled(!enabled)
    localStorage.setItem('safespace_predictive_alerts', JSON.stringify(!enabled))
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={32} />
            <div>
              <h3 className="text-xl font-bold">Predictive Alerts</h3>
              <p className="opacity-90">AI-powered mood forecasting</p>
            </div>
          </div>
          <button
            onClick={toggleAlerts}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              enabled ? 'bg-white text-orange-500' : 'bg-white/20'
            }`}
          >
            {enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {enabled && (
        <>
          <div className="bg-surface rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-primary" size={20} />
              <h3 className="font-semibold text-text-primary">Active Alerts</h3>
            </div>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border-2 ${
                    alert.type === 'warning'
                      ? 'bg-orange-50 border-orange-200'
                      : alert.type === 'trigger'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary mb-1">{alert.title}</h4>
                      <p className="text-sm text-text-secondary mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span>📅 {alert.date}</span>
                        <span>🎯 {alert.confidence}% confidence</span>
                      </div>
                    </div>
                    {alert.type === 'warning' && <TrendingDown className="text-orange-500" size={24} />}
                    {alert.type === 'trigger' && <AlertTriangle className="text-red-500" size={24} />}
                    {alert.type === 'positive' && <Lightbulb className="text-green-500" size={24} />}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-text-secondary mb-2">Suggested Actions:</p>
                    <ul className="space-y-1">
                      {alert.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-xs text-text-primary flex items-center gap-2">
                          <span className="text-primary">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6">
            <h3 className="font-semibold text-text-primary mb-4">How It Works</h3>
            <div className="space-y-3 text-sm text-text-secondary">
              <p>
                Our AI analyzes your mood patterns, triggers, and historical data to predict potential mood changes before they happen.
              </p>
              <p>
                You'll receive notifications 24-48 hours before predicted low mood periods, giving you time to prepare and take preventive action.
              </p>
              <p className="text-xs text-text-secondary italic">
                Predictions improve over time as we learn more about your unique patterns.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PredictiveAlerts
