import { useState, useEffect } from 'react'
import MoodTracker from '../components/MoodTracker'
import MoodCalendar from '../components/MoodCalendar'
import MoodTrends from '../components/MoodTrends'

function HomePage() {
  const [user, setUser] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem('safespace_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleMoodLogged = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 mb-6 shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          {user?.avatar && (
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white/30 shadow-lg">
              {user.avatar}
            </div>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Welcome back{user?.username ? `, ${user.username}` : ''}! 👋
            </h1>
            <p className="text-white/90 text-lg mt-1">Your mental health support companion</p>
          </div>
        </div>
      </div>
      
      <MoodTracker onMoodLogged={handleMoodLogged} />
      
      <MoodCalendar key={refreshKey} />
      
      <MoodTrends key={refreshKey} />
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Wellness Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <a href="/gratitude" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">❤️</span>
              <h3 className="text-lg font-semibold">Gratitude</h3>
            </div>
            <p className="text-text-secondary text-sm">Daily gratitude practice</p>
          </a>
          
          <a href="/habits" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎯</span>
              <h3 className="text-lg font-semibold">Habits</h3>
            </div>
            <p className="text-text-secondary text-sm">Track daily habits</p>
          </a>
          
          <a href="/emotions" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">💭</span>
              <h3 className="text-lg font-semibold">Emotions</h3>
            </div>
            <p className="text-text-secondary text-sm">Understand your feelings</p>
          </a>
          
          <a href="/coping-skills" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🛠️</span>
              <h3 className="text-lg font-semibold">Coping Skills</h3>
            </div>
            <p className="text-text-secondary text-sm">Strategies for tough times</p>
          </a>
          
          <a href="/reminders" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⏰</span>
              <h3 className="text-lg font-semibold">Reminders</h3>
            </div>
            <p className="text-text-secondary text-sm">Stay on track</p>
          </a>
          
          <a href="/tools" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🧰</span>
              <h3 className="text-lg font-semibold">Therapy Tools</h3>
            </div>
            <p className="text-text-secondary text-sm">CBT, DBT, and more</p>
          </a>
          
          <a href="/wellness" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📊</span>
              <h3 className="text-lg font-semibold">Wellness Score</h3>
            </div>
            <p className="text-text-secondary text-sm">Track overall progress</p>
          </a>
          
          <a href="/advanced-tools" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🚀</span>
              <h3 className="text-lg font-semibold">Advanced Tools</h3>
            </div>
            <p className="text-text-secondary text-sm">Triggers, journal, therapy</p>
          </a>
          
          <a href="/gamification" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏆</span>
              <h3 className="text-lg font-semibold">Gamification</h3>
            </div>
            <p className="text-text-secondary text-sm">Challenges, quests, streaks</p>
          </a>
          
          <a href="/wellness-plan" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📅</span>
              <h3 className="text-lg font-semibold">Wellness Plan</h3>
            </div>
            <p className="text-text-secondary text-sm">Daily routine builder</p>
          </a>
          
          <a href="/social" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🤝</span>
              <h3 className="text-lg font-semibold">Social Hub</h3>
            </div>
            <p className="text-text-secondary text-sm">Connect & support</p>
          </a>
          
          <a href="/analytics" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📊</span>
              <h3 className="text-lg font-semibold">Analytics</h3>
            </div>
            <p className="text-text-secondary text-sm">Deep insights</p>
          </a>
          
          <a href="/professional" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏥</span>
              <h3 className="text-lg font-semibold">Professional</h3>
            </div>
            <p className="text-text-secondary text-sm">Therapist & crisis</p>
          </a>
          
          <a href="/technical" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📡</span>
              <h3 className="text-lg font-semibold">Technical</h3>
            </div>
            <p className="text-text-secondary text-sm">Voice, offline, PWA</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default HomePage