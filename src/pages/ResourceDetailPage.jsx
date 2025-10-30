import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockResources } from '../data/mockResources'
import RequestHelpModal from '../components/resources/RequestHelpModal'
import { Phone, Heart, Book, Play } from 'lucide-react'

function ResourceDetailPage() {
  const { id } = useParams() // expects format "<category>-<id>" e.g. "meditation-3"
  const navigate = useNavigate()
  const [resource, setResource] = useState(null)
  const [category, setCategory] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (!id) return
    const [cat, ...rest] = id.split('-')
    const rawId = rest.join('-')
    setCategory(cat)

    // search through mock resources
    const collections = {
      breathing: mockResources.breathingExercises,
      meditation: mockResources.meditations,
      article: mockResources.articles,
      selfhelp: mockResources.selfHelpGuides,
      crisis: mockResources.crisisResources
    }

    // Try direct mapping first
    let found = null
    Object.keys(collections).forEach((key) => {
      const list = collections[key] || []
      const match = list.find((r) => String(r.id) === rawId || String(`${key}-${r.id}`) === id)
      if (match) found = { ...match, __category: key }
    })

    // fallback: try searching all lists for matching id
    if (!found) {
      const all = [
        ...mockResources.breathingExercises,
        ...mockResources.meditations,
        ...mockResources.articles,
        ...mockResources.selfHelpGuides,
        ...mockResources.crisisResources
      ]
      found = all.find(r => String(r.id) === rawId || String(`${r.category || r.type}-${r.id}`) === id)
      if (found) found = { ...found, __category: found.category || found.type || cat }
    }

    setResource(found)

    // bookmark state (matches ResourceLibraryPage key format)
    const bookmarkKey = `${cat}-${rawId}`
    const saved = JSON.parse(localStorage.getItem('safespace_bookmarks') || '[]')
    setBookmarked(saved.includes(bookmarkKey))
  }, [id])

  const toggleBookmark = () => {
    const saved = JSON.parse(localStorage.getItem('safespace_bookmarks') || '[]')
    const key = `${category}-${id?.split('-').slice(1).join('-')}`
    const newSaved = saved.includes(key) ? saved.filter(k => k !== key) : [...saved, key]
    localStorage.setItem('safespace_bookmarks', JSON.stringify(newSaved))
    setBookmarked(newSaved.includes(key))
  }

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-3">Resource not found</h2>
          <p className="text-text-secondary mb-4">We couldn't find the resource you're looking for.</p>
          <div className="flex gap-2">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-primary text-white rounded-xl">Go back</button>
            <button onClick={() => navigate('/resources')} className="px-4 py-2 border rounded-xl">Browse resources</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{resource.title || resource.name}</h1>
            {resource.summary && <p className="text-text-secondary mb-3">{resource.summary}</p>}
            {resource.theme && <div className="text-sm text-text-secondary mb-2">Theme: {resource.theme}</div>}
            {resource.tags && <div className="text-xs text-text-secondary">Tags: {(resource.tags || []).join(', ')}</div>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <button onClick={toggleBookmark} className={`p-2 rounded-full transition-colors ${bookmarked ? 'text-red-500 bg-red-50' : 'text-text-secondary hover:text-red-500'}`} aria-pressed={bookmarked} aria-label="Toggle bookmark">
              <Heart size={18} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <button onClick={() => setShowHelp(true)} className="px-3 py-2 bg-danger text-white rounded-xl">Request Help</button>
          </div>
        </div>

        <div className="prose text-text-primary mb-6">
          {resource.description || resource.content || resource.steps?.map((s, i) => (<p key={i}>{s}</p>))}
        </div>

        {/* Action area: play, call, read */}
        <div className="flex flex-wrap gap-3">
          {resource.duration && (
            <button className="px-4 py-2 bg-primary text-white rounded-xl flex items-center gap-2">
              <Play size={16} />
              {resource.duration} min
            </button>
          )}

          {resource.number && (
            <a href={`tel:${resource.number}`} className="px-4 py-2 bg-danger text-white rounded-xl flex items-center gap-2">
              <Phone size={16} />
              Call {resource.number}
            </a>
          )}

          {resource.readTime && (
            <button onClick={() => alert('Marked as read — + points')} className="px-4 py-2 bg-success text-white rounded-xl flex items-center gap-2">
              <Book size={16} />
              Read ({resource.readTime} min)
            </button>
          )}
        </div>

      </div>

      <RequestHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} defaultNumber={resource.number || '988'} />
    </div>
  )
}

export default ResourceDetailPage
