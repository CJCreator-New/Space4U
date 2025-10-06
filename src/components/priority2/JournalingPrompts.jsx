import { useState } from 'react'

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

function JournalingPrompts({ onClose }) {
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [entry, setEntry] = useState('')
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('safespace_journal_entries') || '[]'))

  const saveEntry = () => {
    const newEntry = { id: Date.now(), prompt: selectedPrompt.prompt, entry, created_at: new Date().toISOString() }
    const updated = [newEntry, ...entries]
    localStorage.setItem('safespace_journal_entries', JSON.stringify(updated))
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

export default JournalingPrompts
