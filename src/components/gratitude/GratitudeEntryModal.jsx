import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

function GratitudeEntryModal({ entry, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    items: ['', '', ''],
    mood_rating: 3,
    notes: ''
  })

  useEffect(() => {
    if (entry) setFormData(entry)
  }, [entry])

  const updateItem = (index, value) => {
    const newItems = [...formData.items]
    newItems[index] = value
    setFormData({ ...formData, items: newItems })
  }

  const addItem = () => {
    if (formData.items.length < 5) {
      setFormData({ ...formData, items: [...formData.items, ''] })
    }
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) })
    }
  }

  const handleSubmit = () => {
    const filledItems = formData.items.filter(item => item.trim())
    if (filledItems.length === 0) return alert('Add at least one gratitude item')
    
    onSave({
      ...formData,
      items: filledItems,
      id: entry?.id || Date.now()
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gratitude Entry</h2>
          <button onClick={onClose} className="p-2 hover:bg-hover rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">What are you grateful for?</label>
            {formData.items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-3">
                <span className="text-2xl mt-1">✨</span>
                <input
                  value={item}
                  onChange={(e) => updateItem(i, e.target.value)}
                  className="input flex-1"
                  placeholder={`Gratitude #${i + 1}`}
                />
                {formData.items.length > 1 && (
                  <button onClick={() => removeItem(i)} className="p-2 hover:bg-hover rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {formData.items.length < 5 && (
              <button onClick={addItem} className="btn-secondary text-sm w-full">
                <Plus className="w-4 h-4" /> Add Another
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">How do you feel? (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFormData({ ...formData, mood_rating: rating })}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    formData.mood_rating === rating
                      ? 'bg-primary text-white'
                      : 'bg-hover text-text-secondary hover:bg-hover/80'
                  }`}
                >
                  {['😔', '😕', '😊', '😄', '🤩'][rating - 1]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input w-full h-24"
              placeholder="Any reflections or thoughts..."
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-border p-6">
          <button onClick={handleSubmit} className="btn-primary w-full">
            Save Entry
          </button>
        </div>
      </div>
    </div>
  )
}

export default GratitudeEntryModal
