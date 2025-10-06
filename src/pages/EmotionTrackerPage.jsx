import { useState, useEffect } from 'react'
import { Plus, Heart } from 'lucide-react'

const EMOTIONS = {
  joy: { color: 'yellow', secondary: ['Optimistic', 'Proud', 'Content', 'Playful'] },
  trust: { color: 'green', secondary: ['Accepting', 'Confident', 'Secure'] },
  fear: { color: 'purple', secondary: ['Anxious', 'Worried', 'Scared', 'Nervous'] },
  surprise: { color: 'blue', secondary: ['Amazed', 'Confused', 'Startled'] },
  sadness: { color: 'indigo', secondary: ['Lonely', 'Disappointed', 'Hurt', 'Depressed'] },
  disgust: { color: 'pink', secondary: ['Disapproving', 'Uncomfortable', 'Repulsed'] },
  anger: { color: 'red', secondary: ['Frustrated', 'Irritated', 'Furious', 'Resentful'] },
  anticipation: { color: 'orange', secondary: ['Hopeful', 'Excited', 'Eager'] }
}

function EmotionTrackerPage() {
  const [logs, setLogs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [entry, setEntry] = useState({ primary_emotion: '', secondary_emotions: [], intensity: 5, trigger: '' })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('safespace_emotion_logs') || '[]')
    setLogs(saved)
  }, [])

  const saveEntry = () => {
    const newEntry = { ...entry, id: Date.now(), created_at: new Date().toISOString() }
    const updated = [newEntry, ...logs]
    localStorage.setItem('safespace_emotion_logs', JSON.stringify(updated))
    setLogs(updated)
    setShowModal(false)
    setEntry({ primary_emotion: '', secondary_emotions: [], intensity: 5, trigger: '' })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Emotion Tracker</h1>
          <p className="text-text-secondary">Understand your emotional patterns</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" /> Log Emotion
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Start Tracking Emotions</h3>
          <p className="text-text-secondary mb-6">Gain deeper emotional awareness</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" /> Log First Emotion
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold capitalize">{log.primary_emotion}</h3>
                  <p className="text-text-secondary text-sm">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-lg font-bold">Intensity: {log.intensity}/10</span>
              </div>
              {log.secondary_emotions.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {log.secondary_emotions.map((e, i) => (
                    <span key={i} className="px-3 py-1 bg-hover rounded-full text-sm">{e}</span>
                  ))}
                </div>
              )}
              {log.trigger && <p className="text-text-secondary">Trigger: {log.trigger}</p>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Log Emotion</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Emotion</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.keys(EMOTIONS).map(emotion => (
                    <button
                      key={emotion}
                      onClick={() => setEntry({ ...entry, primary_emotion: emotion, secondary_emotions: [] })}
                      className={`p-3 rounded-xl capitalize font-medium ${
                        entry.primary_emotion === emotion ? 'bg-primary text-white' : 'bg-hover'
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>

              {entry.primary_emotion && (
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Emotions</label>
                  <div className="flex gap-2 flex-wrap">
                    {EMOTIONS[entry.primary_emotion].secondary.map(sec => (
                      <button
                        key={sec}
                        onClick={() => {
                          const updated = entry.secondary_emotions.includes(sec)
                            ? entry.secondary_emotions.filter(e => e !== sec)
                            : [...entry.secondary_emotions, sec]
                          setEntry({ ...entry, secondary_emotions: updated })
                        }}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          entry.secondary_emotions.includes(sec) ? 'bg-primary text-white' : 'bg-hover'
                        }`}
                      >
                        {sec}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Intensity (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={entry.intensity}
                  onChange={(e) => setEntry({ ...entry, intensity: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-2xl font-bold">{entry.intensity}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">What triggered this? (Optional)</label>
                <textarea
                  value={entry.trigger}
                  onChange={(e) => setEntry({ ...entry, trigger: e.target.value })}
                  className="input w-full h-24"
                  placeholder="Describe the situation..."
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={saveEntry} disabled={!entry.primary_emotion} className="btn-primary flex-1">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmotionTrackerPage
