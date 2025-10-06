import { useState, useEffect } from 'react'
import { Lightbulb, ThumbsUp, ThumbsDown } from 'lucide-react'

function MoodSuggestions() {
  const [currentMood, setCurrentMood] = useState(3)
  const [suggestions, setSuggestions] = useState([])
  const [history, setHistory] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('safespace_suggestion_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const suggestionsByMood = {
    1: [
      { type: 'breathing', title: 'Try 4-7-8 Breathing', description: 'Breathe in for 4, hold for 7, out for 8' },
      { type: 'activity', title: 'Take a Short Walk', description: 'Even 5 minutes can help shift your mood' },
      { type: 'crisis', title: 'Crisis Resources', description: 'Access immediate support if needed' }
    ],
    2: [
      { type: 'journaling', title: 'Write About Your Feelings', description: 'Express what you\'re experiencing' },
      { type: 'coping', title: 'Use a Coping Skill', description: 'Try one of your favorite techniques' },
      { type: 'social', title: 'Reach Out', description: 'Connect with someone you trust' }
    ],
    3: [
      { type: 'gratitude', title: 'List 3 Gratitudes', description: 'What are you thankful for today?' },
      { type: 'mindfulness', title: 'Quick Meditation', description: '5-minute mindfulness exercise' },
      { type: 'habit', title: 'Check Your Habits', description: 'Complete a wellness habit' }
    ],
    4: [
      { type: 'social', title: 'Connect with Friends', description: 'Share your positive energy' },
      { type: 'exercise', title: 'Physical Activity', description: 'Channel your energy into movement' },
      { type: 'creative', title: 'Creative Expression', description: 'Try art, music, or writing' }
    ],
    5: [
      { type: 'celebrate', title: 'Celebrate Your Mood!', description: 'Acknowledge what\'s going well' },
      { type: 'help', title: 'Support Others', description: 'Share your positivity with the community' },
      { type: 'plan', title: 'Plan Ahead', description: 'Set goals while you\'re feeling great' }
    ]
  }

  const getSuggestions = () => {
    setSuggestions(suggestionsByMood[currentMood] || [])
  }

  const rateSuggestion = (suggestion, helpful) => {
    const entry = {
      id: Date.now(),
      mood: currentMood,
      suggestion: suggestion.title,
      helpful,
      timestamp: new Date().toISOString()
    }
    const updated = [entry, ...history].slice(0, 50)
    setHistory(updated)
    localStorage.setItem('safespace_suggestion_history', JSON.stringify(updated))
  }

  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Great']
  const moodEmojis = ['😢', '😕', '😐', '🙂', '😊']

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Get Mood-Based Suggestions</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-3">
            How are you feeling right now?
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={currentMood}
            onChange={(e) => setCurrentMood(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between mt-2">
            {moodEmojis.map((emoji, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl">{emoji}</div>
                <div className="text-xs text-text-secondary">{moodLabels[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={getSuggestions}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
        >
          <Lightbulb size={18} />
          Get Suggestions
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary">Suggested Activities</h3>
          {suggestions.map((suggestion, i) => (
            <div key={i} className="bg-surface rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-text-secondary">{suggestion.description}</p>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg capitalize">
                  {suggestion.type}
                </span>
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => rateSuggestion(suggestion, true)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                >
                  <ThumbsUp size={14} />
                  Helpful
                </button>
                <button
                  onClick={() => rateSuggestion(suggestion, false)}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                >
                  <ThumbsDown size={14} />
                  Not Helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-surface rounded-2xl p-6">
          <h3 className="font-semibold text-text-primary mb-4">Suggestion History</h3>
          <div className="space-y-2">
            {history.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{moodEmojis[entry.mood - 1]}</span>
                  <span className="text-text-primary">{entry.suggestion}</span>
                </div>
                <span className={entry.helpful ? 'text-green-600' : 'text-gray-400'}>
                  {entry.helpful ? <ThumbsUp size={14} /> : <ThumbsDown size={14} />}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MoodSuggestions
