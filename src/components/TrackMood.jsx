import { useState } from 'react'
import { api } from '../utils/supabase'
import { motion } from 'framer-motion'

function TrackMood({ onSaved }) {
  const [rating, setRating] = useState(3)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const emojiMap = { 1: 'ðŸ˜°', 2: 'ðŸ˜¢', 3: 'ðŸ˜', 4: 'ðŸ™‚', 5: 'ðŸ˜Š' }

  const handleSave = async () => {
    setSaving(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const stored = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
      stored[today] = {
        mood: Number(rating),
        emoji: emojiMap[rating],
        label: rating === 5 ? 'Amazing' : rating === 4 ? 'Good' : rating === 3 ? 'Okay' : rating === 2 ? 'Low' : 'Struggling',
        note: note || '',
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('space4u_moods', JSON.stringify(stored))

      // Try to persist to backend but don't block the UI if it fails
      try {
        if (api && api.saveMood) {
          await api.saveMood(stored[today])
        }
      } catch (e) {
        // ignore backend errors for now
        console.warn('Remote save failed', e)
      }

      if (onSaved) onSaved()
    } catch (err) {
      console.error('Failed to save mood', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4 mb-6">
      <h3 className="font-semibold text-text-primary mb-2">Track Your Mood</h3>
      <div className="flex items-center gap-3 mb-3">
        {([1,2,3,4,5]).map(v => (
          <button key={v} onClick={() => setRating(v)} className={`px-3 py-2 rounded-2xl text-lg ${rating===v? 'bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-200' : 'bg-gray-100'}`} aria-pressed={rating===v}>
            {emojiMap[v]}
          </button>
        ))}
      </div>

      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note (optional)" className="w-full p-3 border border-gray-200 rounded-xl mb-3 resize-none" rows={3} />

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
          {saving ? 'Saving...' : 'Save Mood'}
        </button>
        <button onClick={() => { setRating(3); setNote('') }} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">Reset</button>
      </div>
    </motion.div>
  )
}

export default TrackMood

