import { useState, useEffect } from 'react'
import { Shield, Zap, CheckCircle } from 'lucide-react'

function StreakInsurance() {
  const [freezes, setFreezes] = useState({ used: 0, total: 2 })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('space4u_streak_freezes') || '{"used":0,"total":2}')
    setFreezes(saved)
  }, [])

  const useFreeze = () => {
    if (freezes.used >= freezes.total) return
    const updated = { ...freezes, used: freezes.used + 1 }
    localStorage.setItem('space4u_streak_freezes', JSON.stringify(updated))
    setFreezes(updated)
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <Shield className="w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Streak Insurance</h2>
        <p className="opacity-90">Protect your streaks with 2 free freezes per month</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Available Freezes</h3>
            <p className="text-text-secondary">Resets monthly</p>
          </div>
          <div className="text-4xl font-bold text-primary">{freezes.total - freezes.used}/{freezes.total}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[...Array(freezes.total)].map((_, i) => (
            <div key={i} className={`p-4 rounded-xl border-2 ${i < freezes.used ? 'border-gray-300 bg-gray-50' : 'border-primary bg-primary/5'}`}>
              {i < freezes.used ? (
                <CheckCircle className="w-8 h-8 text-gray-400 mx-auto" />
              ) : (
                <Zap className="w-8 h-8 text-primary mx-auto" />
              )}
              <p className="text-center text-sm mt-2 font-medium">{i < freezes.used ? 'Used' : 'Available'}</p>
            </div>
          ))}
        </div>

        <button onClick={useFreeze} disabled={freezes.used >= freezes.total} className="btn-primary w-full">
          Use Streak Freeze
        </button>
      </div>

      <div className="card p-6 bg-blue-50">
        <h3 className="font-bold mb-2">How It Works</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>â€¢ Miss a day? Use a freeze to protect your streak</li>
          <li>â€¢ Get 2 freezes per month as a premium member</li>
          <li>â€¢ Freezes reset on the 1st of each month</li>
          <li>â€¢ Use them wisely for unexpected situations</li>
        </ul>
      </div>
    </div>
  )
}

export default StreakInsurance

