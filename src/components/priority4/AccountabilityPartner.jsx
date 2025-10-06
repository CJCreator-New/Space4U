import { useState, useEffect } from 'react'
import { Users, Plus, CheckCircle, MessageSquare } from 'lucide-react'

function AccountabilityPartner() {
  const [pairs, setPairs] = useState([])
  const [goals, setGoals] = useState('')
  const [checkinMessage, setCheckinMessage] = useState('')
  const [moodRating, setMoodRating] = useState(3)

  useEffect(() => {
    const saved = localStorage.getItem('safespace_accountability_pairs')
    if (saved) setPairs(JSON.parse(saved))
  }, [])

  const createPair = () => {
    const newPair = {
      id: Date.now(),
      status: 'active',
      type: 'anonymous',
      goals: goals.split('\n').filter(g => g.trim()),
      checkins: [],
      createdAt: new Date().toISOString()
    }
    const updated = [...pairs, newPair]
    setPairs(updated)
    localStorage.setItem('safespace_accountability_pairs', JSON.stringify(updated))
    setGoals('')
  }

  const addCheckin = (pairId) => {
    const updated = pairs.map(p => {
      if (p.id === pairId) {
        return {
          ...p,
          checkins: [...p.checkins, {
            id: Date.now(),
            message: checkinMessage,
            mood: moodRating,
            timestamp: new Date().toISOString()
          }]
        }
      }
      return p
    })
    setPairs(updated)
    localStorage.setItem('safespace_accountability_pairs', JSON.stringify(updated))
    setCheckinMessage('')
    setMoodRating(3)
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Create Accountability Partnership</h3>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="Enter shared goals (one per line)&#10;Example:&#10;- Log mood daily&#10;- Practice gratitude&#10;- Exercise 3x/week"
          className="w-full px-4 py-3 bg-background border border-gray-200 rounded-xl resize-none"
          rows={4}
        />
        <button
          onClick={createPair}
          disabled={!goals.trim()}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus size={18} />
          Create Partnership
        </button>
      </div>

      {pairs.map(pair => (
        <div key={pair.id} className="bg-surface rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-primary" size={24} />
            <div>
              <h3 className="font-semibold text-text-primary">Accountability Partner</h3>
              <p className="text-sm text-text-secondary">{pair.type === 'anonymous' ? 'Anonymous' : 'Identified'}</p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-text-primary mb-2">Shared Goals</h4>
            <ul className="space-y-1">
              {pair.goals.map((goal, i) => (
                <li key={i} className="flex items-center gap-2 text-text-secondary">
                  <CheckCircle size={16} className="text-green-500" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-text-primary mb-3">Check-in</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Mood (1-5)</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={moodRating}
                  onChange={(e) => setMoodRating(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-2xl">{['😢', '😕', '😐', '🙂', '😊'][moodRating - 1]}</div>
              </div>
              <textarea
                value={checkinMessage}
                onChange={(e) => setCheckinMessage(e.target.value)}
                placeholder="How are you doing with your goals?"
                className="w-full px-4 py-3 bg-background border border-gray-200 rounded-xl resize-none"
                rows={3}
              />
              <button
                onClick={() => addCheckin(pair.id)}
                disabled={!checkinMessage.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                <MessageSquare size={18} />
                Send Check-in
              </button>
            </div>
          </div>

          {pair.checkins.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="font-medium text-text-primary mb-3">Recent Check-ins</h4>
              <div className="space-y-2">
                {pair.checkins.slice(-3).reverse().map(checkin => (
                  <div key={checkin.id} className="bg-background p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{['😢', '😕', '😐', '🙂', '😊'][checkin.mood - 1]}</span>
                      <span className="text-xs text-text-secondary">
                        {new Date(checkin.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{checkin.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {pairs.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          <Users size={48} className="mx-auto mb-3 opacity-50" />
          <p>No accountability partnerships yet</p>
          <p className="text-sm">Create one to get started!</p>
        </div>
      )}
    </div>
  )
}

export default AccountabilityPartner
