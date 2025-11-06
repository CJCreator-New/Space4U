import { useState } from 'react'
import { api } from '../utils/supabase'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { toast } from '../utils/toast'

function TrackMood({ onSaved }) {
  const [rating, setRating] = useState(3)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const emojiMap = { 1: '', 2: '', 3: '', 4: '', 5: '' }

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
        console.warn('Remote save failed', e)
      }

      // Show success state
      setShowSuccess(true)
      
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      })

      // Show success toast
      toast.success('Mood saved successfully! 🎉')

      // Reset success state after animation
      setTimeout(() => setShowSuccess(false), 1000)

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
        <button 
          onClick={handleSave} 
          disabled={saving || showSuccess} 
          className={`btn-micro px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 ${saving ? 'btn-loading' : ''}`}
        >
          {showSuccess ? (
            <span className="btn-success-checkmark">✓</span>
          ) : saving ? (
            'Saving'
          ) : (
            'Save Mood'
          )}
        </button>
        <button 
          onClick={() => { setRating(3); setNote('') }} 
          className="btn-micro px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </motion.div>
  )
}

export default TrackMood

