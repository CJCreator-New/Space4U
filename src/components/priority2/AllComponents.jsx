// JournalingPrompts.jsx
import { useState } from 'react'
import { X } from 'lucide-react'

const PROMPTS = [
  { id: 1, prompt: 'What am I grateful for today?', category: 'gratitude' },
  { id: 2, prompt: 'What is causing me anxiety right now?', category: 'anxiety' },
  { id: 3, prompt: 'How did I take care of myself today?', category: 'reflection' },
  { id: 4, prompt: 'What would I tell a friend in my situation?', category: 'growth' },
  { id: 5, prompt: 'What are my core values?', category: 'growth' },
  { id: 6, prompt: 'What patterns do I notice in my relationships?', category: 'relationships' },
  { id: 7, prompt: 'What am I avoiding and why?', category: 'reflection' },
  { id: 8, prompt: 'What small win can I celebrate today?', category: 'gratitude' },
  { id: 9, prompt: 'What emotions am I feeling right now?', category: 'reflection' },
  { id: 10, prompt: 'What do I need to forgive myself for?', category: 'growth' }
]

export function JournalingPrompts({ onClose }) {
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [entry, setEntry] = useState('')
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('space4u_journal_entries') || '[]'))

  const saveEntry = () => {
    const newEntry = { id: Date.now(), prompt: selectedPrompt.prompt, entry, created_at: new Date().toISOString() }
    const updated = [newEntry, ...entries]
    localStorage.setItem('space4u_journal_entries', JSON.stringify(updated))
    setEntries(updated)
    setSelectedPrompt(null)
    setEntry('')
  }

  if (selectedPrompt) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">{selectedPrompt.prompt}</h2>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="input w-full h-64 mb-4"
            placeholder="Write your thoughts..."
          />
          <div className="flex gap-3">
            <button onClick={() => setSelectedPrompt(null)} className="btn-secondary flex-1">Back</button>
            <button onClick={saveEntry} disabled={!entry} className="btn-primary flex-1">Save Entry</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Journaling Prompts</h1>
        <button onClick={onClose} className="btn-secondary">Back</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROMPTS.map(prompt => (
          <button
            key={prompt.id}
            onClick={() => setSelectedPrompt(prompt)}
            className="card p-6 text-left hover:scale-105 transition-transform"
          >
            <p className="font-medium mb-2">{prompt.prompt}</p>
            <span className="text-sm text-text-secondary capitalize">{prompt.category}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// WorryScheduler.jsx
export function WorryScheduler({ onClose }) {
  const [worries, setWorries] = useState(() => JSON.parse(localStorage.getItem('space4u_worry_logs') || '[]'))
  const [newWorry, setNewWorry] = useState('')
  const [worryTime, setWorryTime] = useState('18:00')

  const addWorry = () => {
    const worry = { id: Date.now(), worry: newWorry, scheduled_time: worryTime, addressed: false, created_at: new Date().toISOString() }
    const updated = [worry, ...worries]
    localStorage.setItem('space4u_worry_logs', JSON.stringify(updated))
    setWorries(updated)
    setNewWorry('')
  }

  const toggleAddressed = (id) => {
    const updated = worries.map(w => w.id === id ? { ...w, addressed: !w.addressed } : w)
    localStorage.setItem('space4u_worry_logs', JSON.stringify(updated))
    setWorries(updated)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Worry Time Scheduler</h1>
          <p className="text-text-secondary">Postpone worries to a designated time</p>
        </div>
        <button onClick={onClose} className="btn-secondary">Back</button>
      </div>

      <div className="card p-6 mb-6">
        <h3 className="font-semibold mb-4">Add New Worry</h3>
        <div className="flex gap-3">
          <input
            value={newWorry}
            onChange={(e) => setNewWorry(e.target.value)}
            className="input flex-1"
            placeholder="What's worrying you?"
          />
          <input
            type="time"
            value={worryTime}
            onChange={(e) => setWorryTime(e.target.value)}
            className="input w-32"
          />
          <button onClick={addWorry} disabled={!newWorry} className="btn-primary">Add</button>
        </div>
      </div>

      <div className="space-y-4">
        {worries.map(worry => (
          <div key={worry.id} className={`card p-6 ${worry.addressed ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={worry.addressed ? 'line-through' : ''}>{worry.worry}</p>
                <p className="text-sm text-text-secondary mt-1">Scheduled: {worry.scheduled_time}</p>
              </div>
              <button
                onClick={() => toggleAddressed(worry.id)}
                className={`px-4 py-2 rounded-lg ${worry.addressed ? 'bg-green-500 text-white' : 'bg-hover'}`}
              >
                {worry.addressed ? 'Addressed' : 'Mark Done'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// SelfCompassion.jsx
export function SelfCompassion({ onClose }) {
  const [type, setType] = useState('prompt')
  const [content, setContent] = useState('')
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('space4u_self_compassion') || '[]'))

  const PROMPTS = [
    'Write a letter to yourself as if you were your best friend',
    'What would you say to comfort a friend in your situation?',
    'Acknowledge three things you did well today',
    'What do you need to hear right now?'
  ]

  const saveLog = () => {
    const log = { id: Date.now(), exercise_type: type, content, created_at: new Date().toISOString() }
    const updated = [log, ...logs]
    localStorage.setItem('space4u_self_compassion', JSON.stringify(updated))
    setLogs(updated)
    setContent('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Self-Compassion Exercises</h1>
        <button onClick={onClose} className="btn-secondary">Back</button>
      </div>

      <div className="card p-6 mb-6">
        <h3 className="font-semibold mb-4">Choose a Prompt</h3>
        <div className="space-y-2 mb-4">
          {PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setContent(prompt + '\n\n')}
              className="w-full text-left p-3 bg-hover hover:bg-hover/80 rounded-lg"
            >
              {prompt}
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input w-full h-48 mb-4"
          placeholder="Write with kindness to yourself..."
        />
        <button onClick={saveLog} disabled={!content} className="btn-primary w-full">Save</button>
      </div>

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="card p-6">
            <p className="text-sm text-text-secondary mb-2">{new Date(log.created_at).toLocaleDateString()}</p>
            <p className="whitespace-pre-wrap">{log.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// TherapyPrep.jsx
export function TherapyPrep({ onClose }) {
  const [sessions, setSessions] = useState(() => JSON.parse(localStorage.getItem('space4u_therapy_sessions') || '[]'))
  const [showModal, setShowModal] = useState(false)
  const [newSession, setNewSession] = useState({ session_date: '', topics_to_discuss: [''], goals: [''] })

  const addSession = () => {
    const session = { ...newSession, id: Date.now() }
    const updated = [session, ...sessions]
    localStorage.setItem('space4u_therapy_sessions', JSON.stringify(updated))
    setSessions(updated)
    setShowModal(false)
    setNewSession({ session_date: '', topics_to_discuss: [''], goals: [''] })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Therapy Session Prep</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="btn-primary">New Session</button>
          <button onClick={onClose} className="btn-secondary">Back</button>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="card p-6">
            <h3 className="text-xl font-semibold mb-3">{new Date(session.session_date).toLocaleDateString()}</h3>
            <div className="mb-3">
              <p className="font-medium mb-1">Topics to Discuss:</p>
              <ul className="list-disc list-inside">
                {session.topics_to_discuss.map((topic, i) => <li key={i}>{topic}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Goals:</p>
              <ul className="list-disc list-inside">
                {session.goals.map((goal, i) => <li key={i}>{goal}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">New Session</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Session Date</label>
                <input
                  type="date"
                  value={newSession.session_date}
                  onChange={(e) => setNewSession({ ...newSession, session_date: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Topics</label>
                <input
                  value={newSession.topics_to_discuss[0]}
                  onChange={(e) => setNewSession({ ...newSession, topics_to_discuss: [e.target.value] })}
                  className="input w-full"
                  placeholder="What to discuss?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Goals</label>
                <input
                  value={newSession.goals[0]}
                  onChange={(e) => setNewSession({ ...newSession, goals: [e.target.value] })}
                  className="input w-full"
                  placeholder="Session goals?"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={addSession} disabled={!newSession.session_date} className="btn-primary flex-1">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// MedicationTracker.jsx
export function MedicationTracker({ onClose }) {
  const [meds, setMeds] = useState(() => JSON.parse(localStorage.getItem('space4u_medications') || '[]'))
  const [showModal, setShowModal] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'daily', times: ['09:00'] })

  const addMed = () => {
    const med = { ...newMed, id: Date.now(), logs: {} }
    const updated = [...meds, med]
    localStorage.setItem('space4u_medications', JSON.stringify(updated))
    setMeds(updated)
    setShowModal(false)
    setNewMed({ name: '', dosage: '', frequency: 'daily', times: ['09:00'] })
  }

  const toggleTaken = (medId) => {
    const today = new Date().toISOString().split('T')[0]
    const updated = meds.map(m => {
      if (m.id === medId) {
        const logs = { ...m.logs }
        logs[today] = !logs[today]
        return { ...m, logs }
      }
      return m
    })
    localStorage.setItem('space4u_medications', JSON.stringify(updated))
    setMeds(updated)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Medication Tracker</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="btn-primary">Add Medication</button>
          <button onClick={onClose} className="btn-secondary">Back</button>
        </div>
      </div>

      <div className="space-y-4">
        {meds.map(med => (
          <div key={med.id} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{med.name}</h3>
                <p className="text-text-secondary">{med.dosage} • {med.frequency}</p>
                <p className="text-sm text-text-secondary">Times: {med.times.join(', ')}</p>
              </div>
              <button
                onClick={() => toggleTaken(med.id)}
                className={`px-6 py-3 rounded-xl font-medium ${
                  med.logs[today] ? 'bg-green-500 text-white' : 'bg-hover'
                }`}
              >
                {med.logs[today] ? 'âœ“ Taken' : 'Mark Taken'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">New Medication</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Medication Name</label>
                <input
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Sertraline"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dosage</label>
                <input
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., 50mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Frequency</label>
                <select
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  className="input w-full"
                >
                  <option value="daily">Daily</option>
                  <option value="twice_daily">Twice Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="as_needed">As Needed</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={addMed} disabled={!newMed.name || !newMed.dosage} className="btn-primary flex-1">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

