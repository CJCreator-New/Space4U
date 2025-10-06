import { useState } from 'react'
import { Plus } from 'lucide-react'

function MedicationTracker({ onClose }) {
  const [meds, setMeds] = useState(() => JSON.parse(localStorage.getItem('safespace_medications') || '[]'))
  const [showModal, setShowModal] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'daily', times: ['09:00'] })

  const addMed = () => {
    const med = { ...newMed, id: Date.now(), logs: {} }
    const updated = [...meds, med]
    localStorage.setItem('safespace_medications', JSON.stringify(updated))
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
    localStorage.setItem('safespace_medications', JSON.stringify(updated))
    setMeds(updated)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Medication Tracker</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="w-5 h-5" /> Add Medication</button>
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
              <button onClick={() => toggleTaken(med.id)} className={`px-6 py-3 rounded-xl font-medium ${med.logs[today] ? 'bg-green-500 text-white' : 'bg-hover'}`}>
                {med.logs[today] ? '✓ Taken' : 'Mark Taken'}
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
                <input value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} className="input w-full" placeholder="e.g., Sertraline" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dosage</label>
                <input value={newMed.dosage} onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })} className="input w-full" placeholder="e.g., 50mg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Frequency</label>
                <select value={newMed.frequency} onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })} className="input w-full">
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

export default MedicationTracker
