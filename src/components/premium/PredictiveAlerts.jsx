import { AlertTriangle, Bell, TrendingDown, Calendar } from 'lucide-react'

function PredictiveAlerts() {
  const predictions = [
    { date: 'Tomorrow', risk: 'Medium', confidence: 72, reason: 'Historical pattern shows mood dips on Wednesdays' },
    { date: 'This Weekend', risk: 'Low', confidence: 85, reason: 'Weekend moods are typically 15% higher' },
    { date: 'Next Week', risk: 'High', confidence: 68, reason: 'Stress patterns suggest challenging period ahead' }
  ]

  const alerts = [
    { type: 'warning', message: 'Mood dip predicted for tomorrow - consider scheduling self-care', time: '2 hours ago' },
    { type: 'info', message: 'Your sleep quality may affect mood this week', time: '1 day ago' }
  ]

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Predictive Alerts</h2>
        <p className="opacity-90">AI-powered mood forecasting and early warnings</p>
      </div>

      <div className="card p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5" />
          Mood Predictions
        </h3>
        <div className="space-y-3">
          {predictions.map((pred, i) => (
            <div key={i} className="p-4 bg-hover rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-text-secondary" />
                  <span className="font-medium">{pred.date}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  pred.risk === 'High' ? 'bg-red-100 text-red-700' :
                  pred.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {pred.risk} Risk
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-2">{pred.reason}</p>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${pred.confidence}%` }} />
                </div>
                <span>{pred.confidence}% confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Recent Alerts
        </h3>
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <div key={i} className={`p-4 rounded-xl border-l-4 ${
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' : 'bg-blue-50 border-blue-500'
            }`}>
              <p className="text-sm font-medium mb-1">{alert.message}</p>
              <p className="text-xs text-text-secondary">{alert.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 bg-orange-50">
        <h3 className="font-bold mb-2">How Predictions Work</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• AI analyzes your mood patterns over time</li>
          <li>• Identifies triggers and risk factors</li>
          <li>• Provides early warnings for mood dips</li>
          <li>• Suggests preventive actions</li>
        </ul>
      </div>
    </div>
  )
}

export default PredictiveAlerts
