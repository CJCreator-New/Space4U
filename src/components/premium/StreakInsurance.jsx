import { useState, useEffect } from 'react'
import { Shield, Zap, CheckCircle } from 'lucide-react'

function StreakInsurance() {
  const [freezes, setFreezes] = useState({ used: 0, total: 2 })
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('safespace_streak_freezes')
    if (saved) setFreezes(JSON.parse(saved))
    
    const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
    setCurrentStreak(calculateStreak(moods))
  }, [])

  const calculateStreak = (moods) => {
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      if (moods[dateStr]) streak++
      else break
    }
    return streak
  }

  const useFreeze = () => {
    if (freezes.used >= freezes.total) return
    const updated = { ...freezes, used: freezes.used + 1 }
    setFreezes(updated)
    localStorage.setItem('safespace_streak_freezes', JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={32} />
          <div>
            <h3 className="text-xl font-bold">Streak Insurance</h3>
            <p className="opacity-90">Protect your progress</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Current Streak</span>
            <span className="text-2xl font-bold">{currentStreak} days 🔥</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Freezes Available</span>
            <span className="text-2xl font-bold">{freezes.total - freezes.used}/{freezes.total}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="font-semibold text-text-primary mb-4">How It Works</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-medium text-text-primary">2 Free Freezes Per Month</p>
              <p className="text-sm text-text-secondary">Miss a day without losing your streak</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-medium text-text-primary">Automatic Protection</p>
              <p className="text-sm text-text-secondary">Freezes apply automatically when you miss a day</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-medium text-text-primary">Monthly Reset</p>
              <p className="text-sm text-text-secondary">Get 2 new freezes at the start of each month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6">
        <h3 className="font-semibold text-text-primary mb-4">Streak History</h3>
        <div className="space-y-2">
          {[
            { date: 'Today', status: 'active', frozen: false },
            { date: 'Yesterday', status: 'active', frozen: false },
            { date: '2 days ago', status: 'active', frozen: false },
            { date: '3 days ago', status: 'frozen', frozen: true },
            { date: '4 days ago', status: 'active', frozen: false }
          ].map((day, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-background rounded-xl">
              <span className="text-sm text-text-primary">{day.date}</span>
              <div className="flex items-center gap-2">
                {day.frozen ? (
                  <>
                    <Shield size={16} className="text-blue-500" />
                    <span className="text-sm text-blue-500">Freeze Used</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} className="text-green-500" />
                    <span className="text-sm text-green-500">Active</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {freezes.used < freezes.total && (
        <button
          onClick={useFreeze}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
        >
          Use Freeze Now
        </button>
      )}
    </div>
  )
}

export default StreakInsurance
