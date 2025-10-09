import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MoodTracker from '../components/MoodTracker'
import MoodCalendar from '../components/MoodCalendar'
import MoodTrends from '../components/MoodTrends'
import SafeComponent from '../components/SafeComponent'

function HomePage() {
  const [user, setUser] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const userData = localStorage.getItem('safespace_user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (err) {
      console.error('Error loading user data:', err)
      setError('Failed to load user data')
    }
  }, [])

  const handleMoodLogged = () => {
    try {
      setRefreshKey(prev => prev + 1)
    } catch (err) {
      console.error('Error refreshing mood data:', err)
    }
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
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
      
      {/* Mood Tracking Section - Wrapped in SafeComponent */}
      <SafeComponent>
        <div className="mb-6">
          <MoodTracker onMoodLogged={handleMoodLogged} />
        </div>
      </SafeComponent>
      
      <SafeComponent>
        <div className="mb-6">
          <MoodCalendar key={refreshKey} />
        </div>
      </SafeComponent>
      
      <SafeComponent>
        <div className="mb-6">
          <MoodTrends key={refreshKey} />
        </div>
      </SafeComponent>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Wellness Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/gratitude" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">❤️</span>
              <h3 className="text-lg font-semibold">Gratitude</h3>
            </div>
            <p className="text-text-secondary text-sm">Daily gratitude practice</p>
          </Link>
          
          <Link to="/habits" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎯</span>
              <h3 className="text-lg font-semibold">Habits</h3>
            </div>
            <p className="text-text-secondary text-sm">Track daily habits</p>
          </Link>
          
          <Link to="/emotions" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">💭</span>
              <h3 className="text-lg font-semibold">Emotions</h3>
            </div>
            <p className="text-text-secondary text-sm">Understand your feelings</p>
          </Link>
          
          <Link to="/coping-skills" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🛠️</span>
              <h3 className="text-lg font-semibold">Coping Skills</h3>
            </div>
            <p className="text-text-secondary text-sm">Strategies for tough times</p>
          </Link>
          
          <Link to="/reminders" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⏰</span>
              <h3 className="text-lg font-semibold">Reminders</h3>
            </div>
            <p className="text-text-secondary text-sm">Stay on track</p>
          </Link>
          
          <Link to="/tools" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🧰</span>
              <h3 className="text-lg font-semibold">Therapy Tools</h3>
            </div>
            <p className="text-text-secondary text-sm">CBT, DBT, and more</p>
          </Link>
          
          <Link to="/wellness" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📊</span>
              <h3 className="text-lg font-semibold">Wellness Score</h3>
            </div>
            <p className="text-text-secondary text-sm">Track overall progress</p>
          </Link>
          
          <Link to="/advanced-tools" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🚀</span>
              <h3 className="text-lg font-semibold">Advanced Tools</h3>
            </div>
            <p className="text-text-secondary text-sm">Triggers, journal, therapy</p>
          </Link>
          
          <Link to="/gamification" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏆</span>
              <h3 className="text-lg font-semibold">Gamification</h3>
            </div>
            <p className="text-text-secondary text-sm">Challenges, quests, streaks</p>
          </Link>
          
          <Link to="/wellness-plan" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📅</span>
              <h3 className="text-lg font-semibold">Wellness Plan</h3>
            </div>
            <p className="text-text-secondary text-sm">Daily routine builder</p>
          </Link>
          
          <Link to="/social" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🤝</span>
              <h3 className="text-lg font-semibold">Social Hub</h3>
            </div>
            <p className="text-text-secondary text-sm">Connect & support</p>
          </Link>
          
          <Link to="/analytics" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📊</span>
              <h3 className="text-lg font-semibold">Analytics</h3>
            </div>
            <p className="text-text-secondary text-sm">Deep insights</p>
          </Link>
          
          <Link to="/professional" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏥</span>
              <h3 className="text-lg font-semibold">Professional</h3>
            </div>
            <p className="text-text-secondary text-sm">Therapist & crisis</p>
          </Link>
          
          <Link to="/technical" className="card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📡</span>
              <h3 className="text-lg font-semibold">Technical</h3>
            </div>
            <p className="text-text-secondary text-sm">Voice, offline, PWA</p>
          </Link>
          
          <Link to="/premium/features" className="card p-6 hover:shadow-xl transition-all duration-300 group border-2 border-yellow-400">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👑</span>
              <h3 className="text-lg font-semibold">Premium Features</h3>
            </div>
            <p className="text-text-secondary text-sm">Exclusive tools</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage