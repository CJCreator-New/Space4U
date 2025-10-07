import { useState, useEffect } from 'react'
import { Heart, Plus, Calendar, TrendingUp, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import GratitudeEntryModal from '../components/gratitude/GratitudeEntryModal'
import GratitudeCard from '../components/gratitude/GratitudeCard'
import GratitudeStats from '../components/gratitude/GratitudeStats'
import SafeComponent from '../components/SafeComponent'

function GratitudeJournalPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    loadEntries()
  }, [user])

  const loadEntries = () => {
    const saved = localStorage.getItem('safespace_gratitude_entries')
    if (saved) {
      const parsed = JSON.parse(saved)
      setEntries(parsed)
      calculateStreak(parsed)
    }
  }

  const calculateStreak = (entries) => {
    if (!entries.length) return setStreak(0)
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
    let count = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const entry of sorted) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === count) {
        count++
        currentDate.setDate(currentDate.getDate() - 1)
      } else break
    }
    setStreak(count)
  }

  const handleSave = (entry) => {
    const saved = JSON.parse(localStorage.getItem('safespace_gratitude_entries') || '[]')
    const existing = saved.findIndex(e => e.date === entry.date)
    
    if (existing >= 0) saved[existing] = entry
    else saved.unshift(entry)
    
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(saved))
    loadEntries()
    setShowModal(false)
    setSelectedEntry(null)
  }

  const handleEdit = (entry) => {
    setSelectedEntry(entry)
    setShowModal(true)
  }

  const handleDelete = (date) => {
    const saved = JSON.parse(localStorage.getItem('safespace_gratitude_entries') || '[]')
    const filtered = saved.filter(e => e.date !== date)
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(filtered))
    loadEntries()
  }

  const todayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0])

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <div>
              <h1 className="text-3xl font-bold">Gratitude Journal</h1>
              <p className="text-text-secondary">What are you grateful for today?</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" /> {todayEntry ? 'Edit Today' : 'Add Entry'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-text-secondary">Current Streak</span>
            </div>
            <p className="text-3xl font-bold">{streak} days</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-text-secondary">Total Entries</span>
            </div>
            <p className="text-3xl font-bold">{entries.length}</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-text-secondary">This Month</span>
            </div>
            <p className="text-3xl font-bold">
              {entries.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}
            </p>
          </div>
        </div>

        <GratitudeStats entries={entries} />
      </div>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="card p-12 text-center">
            <Heart className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Start Your Gratitude Journey</h3>
            <p className="text-text-secondary mb-6">Research shows that practicing gratitude can improve mental health and overall well-being.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              <Plus className="w-5 h-5" /> Create First Entry
            </button>
          </div>
        ) : (
          entries.map(entry => (
            <GratitudeCard
              key={entry.date}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {showModal && (
        <GratitudeEntryModal
          entry={selectedEntry}
          onClose={() => { setShowModal(false); setSelectedEntry(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  
    </SafeComponent>
  )
}

export default GratitudeJournalPage
