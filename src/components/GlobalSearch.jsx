import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { searchAll, getRecentSearches, saveSearch, clearRecentSearches } from '../utils/search'

function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setRecentSearches(getRecentSearches())
    }
  }, [isOpen])

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchAll(query)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query])

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery)
    if (searchQuery.length >= 2) {
      saveSearch(searchQuery)
    }
  }

  const handleResultClick = (result) => {
    saveSearch(query)
    navigate(result.link)
    onClose()
  }

  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[80vh] flex flex-col">
        {/* Search Input */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search moods, circles, posts, habits..."
              className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-primary dark:text-white"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {query.length < 2 && recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Clock size={16} />
                  Recent Searches
                </h3>
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Search size={48} className="mx-auto mb-3 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {result.description}
                      </div>
                      {result.date && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(result.date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                      {result.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">Esc</kbd> to close</span>
            <span className="flex items-center gap-1">
              <TrendingUp size={12} />
              {results.length} results
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalSearch
