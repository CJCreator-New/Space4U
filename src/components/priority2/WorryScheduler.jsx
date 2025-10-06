import { useState } from 'react'

function WorryScheduler({ onClose }) {
  const [worries, setWorries] = useState(() => JSON.parse(localStorage.getItem('safespace_worry_logs') || '[]'))
  const [newWorry, setNewWorry] = useState('')
  const [worryTime, setWorryTime] = useState('18:00')

  const addWorry = () => {
    const worry = { id: Date.now(), worry: newWorry, scheduled_time: worryTime, addressed: false, created_at: new Date().toISOString() }
    const updated = [worry, ...worries]
    localStorage.setItem('safespace_worry_logs', JSON.stringify(updated))
    setWorries(updated)
    setNewWorry('')
  }

  const toggleAddressed = (id) => {
    const updated = worries.map(w => w.id === id ? { ...w, addressed: !w.addressed } : w)
    localStorage.setItem('safespace_worry_logs', JSON.stringify(updated))
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
          <input value={newWorry} onChange={(e) => setNewWorry(e.target.value)} className="input flex-1" placeholder="What's worrying you?" />
          <input type="time" value={worryTime} onChange={(e) => setWorryTime(e.target.value)} className="input w-32" />
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
              <button onClick={() => toggleAddressed(worry.id)} className={`px-4 py-2 rounded-lg ${worry.addressed ? 'bg-green-500 text-white' : 'bg-hover'}`}>
                {worry.addressed ? 'Addressed' : 'Mark Done'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorryScheduler
