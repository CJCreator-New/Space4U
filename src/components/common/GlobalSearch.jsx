import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { FEATURES } from '../../config/features'

function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!FEATURES.ENABLE_SEARCH || !query.trim()) {
      setResults([])
      return
    }

    const searchData = () => {
      const allResults = []
      const lowerQuery = query.toLowerCase()

      // Search moods
      const moods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
      Object.entries(moods).forEach(([date, mood]) => {
        if (mood.note?.toLowerCase().includes(lowerQuery)) {
          allResults.push({ type: 'mood', date, data: mood })
        }
      })

      // Search gratitude
      const gratitude = JSON.parse(localStorage.getItem('space4u_gratitude') || '{}')
      Object.entries(gratitude).forEach(([date, entries]) => {
        entries.forEach(entry => {
          if (entry.toLowerCase().includes(lowerQuery)) {
            allResults.push({ type: 'gratitude', date, data: entry })
          }
        })
      })

      setResults(allResults.slice(0, 10))
    }

    const debounce = setTimeout(searchData, 300)
    return () => clearTimeout(debounce)
  }, [query])

  if (!FEATURES.ENABLE_SEARCH || !isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-surface rounded-2xl w-full max-w-2xl mx-4 shadow-xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-text-secondary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search moods, journal entries, gratitude..."
              className="flex-1 bg-transparent outline-none text-text-primary"
              autoFocus
            />
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-4">
          {results.length === 0 && query && (
            <p className="text-center text-text-secondary py-8">No results found</p>
          )}
          {results.map((result, idx) => (
            <div key={idx} className="p-3 hover:bg-gray-50 rounded-lg mb-2">
              <div className="text-sm font-medium text-primary capitalize">{result.type}</div>
              <div className="text-text-primary">{result.data.note || result.data}</div>
              <div className="text-xs text-text-secondary mt-1">{result.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GlobalSearch
