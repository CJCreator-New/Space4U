import { useState } from 'react'
import { Plus } from 'lucide-react'

function TherapyPrep({ onClose }) {
  const [sessions, setSessions] = useState(() => JSON.parse(localStorage.getItem('safespace_therapy_sessions') || '[]'))
  const [showModal, setShowModal] = useState(false)
  const [newSession, setNewSession] = useState({ session_date: '', topics_to_discuss: [''], goals: [''] })

  const addSession = () => {
    const session = { ...newSession, id: Date.now() }
    const updated = [session, ...sessions]
    localStorage.setItem('safespace_therapy_sessions', JSON.stringify(updated))
    setSessions(updated)
    setShowModal(false)
    setNewSession({ session_date: '', topics_to_discuss: [''], goals: [''] })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Therapy Session Prep</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="w-5 h-5" /> New Session</button>
          <button onClick={onClose} className="btn-secondary">Back</button>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="card p-6">
            <h3 className="text-xl font-semibold mb-3">{new Date(session.session_date).toLocaleDateString()}</h3>
            <div className="mb-3">
              <p className="font-medium mb-1">Topics to Discuss:</p>
              <ul className="list-disc list-inside">{session.topics_to_discuss.map((topic, i) => <li key={i}>{topic}</li>)}</ul>
            </div>
            <div>
              <p className="font-medium mb-1">Goals:</p>
              <ul className="list-disc list-inside">{session.goals.map((goal, i) => <li key={i}>{goal}</li>)}</ul>
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
                <input type="date" value={newSession.session_date} onChange={(e) => setNewSession({ ...newSession, session_date: e.target.value })} className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Topics</label>
                <input value={newSession.topics_to_discuss[0]} onChange={(e) => setNewSession({ ...newSession, topics_to_discuss: [e.target.value] })} className="input w-full" placeholder="What to discuss?" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Goals</label>
                <input value={newSession.goals[0]} onChange={(e) => setNewSession({ ...newSession, goals: [e.target.value] })} className="input w-full" placeholder="Session goals?" />
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

export default TherapyPrep
