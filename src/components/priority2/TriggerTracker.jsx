import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'

const CATEGORIES = ['person', 'place', 'event', 'situation', 'thought']

function TriggerTracker({ onClose }) {
  const [triggers, setTriggers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newTrigger, setNewTrigger] = useState({ name: '', category: 'situation', description: '', coping_plan: '' })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('safespace_triggers') || '[]')
    setTriggers(saved)
  }, [])

  const addTrigger = () => {
    const trigger = { ...newTrigger, id: Date.now(), logs: [] }
    const updated = [...triggers, trigger]
    localStorage.setItem('safespace_triggers', JSON.stringify(updated))
    setTriggers(updated)
    setShowModal(false)
    setNewTrigger({ name: '', category: 'situation', description: '', coping_plan: '' })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Trigger Tracker</h1>
          <p className="text-text-secondary">Identify and manage mood triggers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" /> Add Trigger
          </button>
          <button onClick={onClose} className="btn-secondary">Back</button>
        </div>
      </div>

      <div className="space-y-4">
        {triggers.map(trigger => (
          <div key={trigger.id} className="card p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold">{trigger.name}</h3>
                <span className="text-sm text-text-secondary capitalize">{trigger.category}</span>
              </div>
              <span className="px-3 py-1 bg-hover rounded-full text-sm">{trigger.logs?.length || 0} logs</span>
            </div>
            {trigger.description && <p className="text-text-secondary mb-2">{trigger.description}</p>}
            {trigger.coping_plan && (
              <div className="mt-3 p-3 bg-green-500/10 rounded-lg">
                <p className="text-sm font-medium">Coping Plan:</p>
                <p className="text-sm text-text-secondary">{trigger.coping_plan}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">New Trigger</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Trigger Name</label>
                <input
                  value={newTrigger.name}
                  onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Crowded places"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newTrigger.category}
                  onChange={(e) => setNewTrigger({ ...newTrigger, category: e.target.value })}
                  className="input w-full"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newTrigger.description}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                  className="input w-full h-20"
                  placeholder="What happens when triggered?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Coping Plan</label>
                <textarea
                  value={newTrigger.coping_plan}
                  onChange={(e) => setNewTrigger({ ...newTrigger, coping_plan: e.target.value })}
                  className="input w-full h-20"
                  placeholder="How will you cope?"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={addTrigger} disabled={!newTrigger.name} className="btn-primary flex-1">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TriggerTracker
