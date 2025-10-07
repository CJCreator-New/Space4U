import { useState, useEffect } from 'react'
import { Trophy, Target, Zap, Star, Calendar } from 'lucide-react'
import SafeComponent from '../components/SafeComponent'

const CHALLENGES = [
  { id: 1, title: '7-Day Mood Tracker', description: 'Track mood daily for 7 days', duration: 7, progress: 0, badge: '🎯' },
  { id: 2, title: '30-Day Gratitude', description: 'Write gratitude daily for 30 days', duration: 30, progress: 0, badge: '🙏' },
  { id: 3, title: 'Mindfulness Week', description: 'Complete 5 mindfulness sessions', duration: 7, progress: 0, badge: '🧘' },
  { id: 4, title: 'Habit Builder', description: 'Complete habits for 14 days', duration: 14, progress: 0, badge: '💪' }
]

const QUESTS = [
  { id: 1, title: 'Getting Started', description: 'Complete your first week', xp: 100, badge: '🌟', tasks: ['Log 3 moods', 'Join a circle'] },
  { id: 2, title: 'Wellness Warrior', description: 'Use 5 different tools', xp: 250, badge: '⚔️', tasks: ['Use 5 tools'] },
  { id: 3, title: 'Master of Mindfulness', description: 'Complete 20 sessions', xp: 500, badge: '🧘', tasks: ['20 mindfulness sessions'], premium: true }
]

function GamificationPage() {
  const [userLevel, setUserLevel] = useState({ level: 1, xp: 0, badges: [] })
  const [streaks, setStreaks] = useState({ mood: 0, gratitude: 0, habits: 0 })
  const [activeTab, setActiveTab] = useState('challenges')

  useEffect(() => {
    const level = JSON.parse(localStorage.getItem('safespace_user_level') || '{"level":1,"xp":0,"badges":[]}')
    setUserLevel(level)
    
    // Calculate streaks
    const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
    const gratitude = JSON.parse(localStorage.getItem('safespace_gratitude_entries') || '[]')
    const habits = JSON.parse(localStorage.getItem('safespace_habits') || '[]')
    
    setStreaks({
      mood: calculateStreak(Object.keys(moods)),
      gratitude: calculateStreak(gratitude.map(g => g.date)),
      habits: habits.length > 0 ? calculateHabitStreak(habits[0]) : 0
    })
  }, [])

  const calculateStreak = (dates) => {
    if (!dates.length) return 0
    const sorted = dates.sort().reverse()
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const dateStr of sorted) {
      const date = new Date(dateStr)
      date.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24))
      
      if (diffDays === streak) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else break
    }
    return streak
  }

  const calculateHabitStreak = (habit) => {
    let streak = 0
    let date = new Date()
    while (habit.completions?.[date.toISOString().split('T')[0]]) {
      streak++
      date.setDate(date.getDate() - 1)
    }
    return streak
  }

  const xpToNextLevel = userLevel.level * 100

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gamification Hub</h1>
        <p className="text-text-secondary">Level up your mental wellness journey</p>
      </div>

      {/* User Level Card */}
      <div className="card p-6 mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
              {userLevel.level}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Level {userLevel.level}</h2>
              <p className="text-text-secondary">{userLevel.xp} / {xpToNextLevel} XP</p>
            </div>
          </div>
          <div className="flex gap-2">
            {userLevel.badges.map((badge, i) => (
              <span key={i} className="text-3xl">{badge}</span>
            ))}
          </div>
        </div>
        <div className="w-full h-3 bg-hover rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${(userLevel.xp / xpToNextLevel) * 100}%` }} />
        </div>
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h3 className="font-semibold">Mood Streak</h3>
          </div>
          <p className="text-3xl font-bold">{streaks.mood} days</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-pink-500" />
            <h3 className="font-semibold">Gratitude Streak</h3>
          </div>
          <p className="text-3xl font-bold">{streaks.gratitude} days</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold">Habit Streak</h3>
          </div>
          <p className="text-3xl font-bold">{streaks.habits} days</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-6 py-3 rounded-xl font-medium ${activeTab === 'challenges' ? 'bg-primary text-white' : 'bg-hover'}`}
        >
          <Trophy className="w-5 h-5 inline mr-2" />
          Challenges
        </button>
        <button
          onClick={() => setActiveTab('quests')}
          className={`px-6 py-3 rounded-xl font-medium ${activeTab === 'quests' ? 'bg-primary text-white' : 'bg-hover'}`}
        >
          <Target className="w-5 h-5 inline mr-2" />
          Quests
        </button>
      </div>

      {/* Content */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHALLENGES.map(challenge => (
            <div key={challenge.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{challenge.badge}</span>
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                  </div>
                  <p className="text-text-secondary text-sm">{challenge.description}</p>
                </div>
                <span className="px-3 py-1 bg-hover rounded-full text-sm">{challenge.duration}d</span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{challenge.progress}/{challenge.duration}</span>
                </div>
                <div className="w-full h-2 bg-hover rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(challenge.progress / challenge.duration) * 100}%` }} />
                </div>
              </div>
              <button className="btn-primary w-full">Join Challenge</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'quests' && (
        <div className="space-y-4">
          {QUESTS.map(quest => (
            <div key={quest.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{quest.badge}</span>
                    <h3 className="text-xl font-semibold">{quest.title}</h3>
                    {quest.premium && <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs font-medium">PREMIUM</span>}
                  </div>
                  <p className="text-text-secondary mb-3">{quest.description}</p>
                  <div className="space-y-1">
                    {quest.tasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded border-2 border-text-secondary" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">+{quest.xp}</div>
                  <div className="text-sm text-text-secondary">XP</div>
                </div>
              </div>
              <button className="btn-primary w-full mt-4">Start Quest</button>
            </div>
          ))}
        </div>
      )}
    </div>
  
    </SafeComponent>
  )
}

export default GamificationPage
