import { useState, useEffect } from 'react'
import { Search, Heart, Play, Book, Phone, AlertTriangle, Clock, User, Bookmark } from 'lucide-react'
import { mockResources } from '../data/mockResources'
import BreathingExercise from '../components/resources/BreathingExercise'
import { addPoints, POINT_VALUES } from '../utils/badgeSystem'
import SafeComponent from '../components/SafeComponent'
import { useDebounce } from '../hooks/useDebounce'
import Skeleton from '../components/common/Skeleton'

function ResourceLibraryPage() {
  const [activeTab, setActiveTab] = useState('breathing')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('safespace_bookmarks') || '[]')
    setBookmarks(savedBookmarks)
    setTimeout(() => setLoading(false), 500)
  }, [])

  const toggleBookmark = (resourceId, category) => {
    const bookmarkId = `${category}-${resourceId}`
    const newBookmarks = bookmarks.includes(bookmarkId)
      ? bookmarks.filter(id => id !== bookmarkId)
      : [...bookmarks, bookmarkId]
    
    setBookmarks(newBookmarks)
    localStorage.setItem('safespace_bookmarks', JSON.stringify(newBookmarks))
  }

  const isBookmarked = (resourceId, category) => {
    return bookmarks.includes(`${category}-${resourceId}`)
  }

  const filterResources = (resources, category) => {
    let filtered = resources

    if (debouncedSearch) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        resource.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(debouncedSearch.toLowerCase()))
      )
    }

    if (showBookmarksOnly) {
      filtered = filtered.filter(resource => isBookmarked(resource.id, category))
    }

    return filtered
  }

  const handleCallHelpline = (number) => {
    window.location.href = `tel:${number}`
  }

  const renderBreathingExercises = () => {
    return <BreathingExercise />
  }

  const renderMeditations = () => {
    const meditations = filterResources(mockResources.meditations, 'meditation')

    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="card p-6">
              <Skeleton variant="title" className="mb-3" />
              <Skeleton variant="text" width="80%" className="mb-2" />
              <Skeleton variant="text" width="60%" className="mb-4" />
              <Skeleton variant="rect" height="40px" />
            </div>
          ))}
        </div>
      )
    }

    return (
    <SafeComponent>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meditations.map((meditation) => (
          <div key={meditation.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-text-primary mb-2">{meditation.title}</h3>
                <p className="text-text-secondary text-sm mb-3">{meditation.theme}</p>
                <div className="flex items-center gap-4 text-xs text-text-secondary mb-2">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {meditation.duration} min
                  </div>
                  <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                    {meditation.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <User size={12} />
                  {meditation.instructor}
                </div>
              </div>
              <button
                onClick={() => toggleBookmark(meditation.id, 'meditation')}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked(meditation.id, 'meditation')
                    ? 'text-red-500 bg-red-50'
                    : 'text-text-secondary hover:text-red-500'
                }`}
              >
                <Heart size={16} fill={isBookmarked(meditation.id, 'meditation') ? 'currentColor' : 'none'} />
              </button>
            </div>
            <button className="w-full bg-secondary text-white py-3 rounded-xl font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
              <Play size={16} />
              Play Meditation
            </button>
          </div>
        ))}
      </div>
    
    </SafeComponent>
  )
  }

  const renderArticles = () => {
    const articles = filterResources(mockResources.articles, 'article')

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <div key={article.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-text-primary mb-2">{article.title}</h3>
                <p className="text-text-secondary text-sm mb-3">{article.summary}</p>
                <div className="flex items-center gap-4 text-xs text-text-secondary mb-2">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {article.readTime} min read
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    {article.author}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleBookmark(article.id, 'article')}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked(article.id, 'article')
                    ? 'text-red-500 bg-red-50'
                    : 'text-text-secondary hover:text-red-500'
                }`}
              >
                <Heart size={16} fill={isBookmarked(article.id, 'article') ? 'currentColor' : 'none'} />
              </button>
            </div>
            <button
              onClick={() => addPoints(POINT_VALUES.comment, 'Article read')}
              className="w-full bg-success text-white py-3 rounded-xl font-medium hover:bg-success/90 transition-colors flex items-center justify-center gap-2"
            >
              <Book size={16} />
              Read Article
            </button>
          </div>
        ))}
      </div>
    )
  }

  const renderCrisisResources = () => {
    return (
      <div className="space-y-6">
        {/* Emergency Notice */}
        <div className="card p-6 border-l-4 border-danger bg-danger/5">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-danger" size={24} />
            <h3 className="font-bold text-danger text-lg">Emergency</h3>
          </div>
          <p className="text-text-primary font-medium mb-2">
            If you're in immediate danger, call emergency services: <strong>112</strong>
          </p>
          <p className="text-text-secondary text-sm">
            These resources are for support, not emergency situations.
          </p>
        </div>

        {/* Helplines */}
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-4">Crisis Helplines</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {mockResources.crisisResources.map((resource) => (
              <div key={resource.id} className="card p-6">
                <h4 className="font-bold text-text-primary mb-2">{resource.name}</h4>
                <p className="text-text-secondary text-sm mb-4">{resource.description}</p>
                
                <div className="space-y-2 mb-4">
                  {resource.number && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Phone:</span>
                      <button
                        onClick={() => handleCallHelpline(resource.number)}
                        className="flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                      >
                        <Phone size={14} />
                        {resource.number}
                      </button>
                    </div>
                  )}
                  {resource.sms && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">SMS:</span>
                      <span className="text-sm font-mono">{resource.sms}</span>
                    </div>
                  )}
                  {resource.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Email:</span>
                      <a href={`mailto:${resource.email}`} className="text-sm text-primary hover:underline">
                        {resource.email}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-text-secondary">
                  <p>Hours: {resource.hours}</p>
                  <p>Languages: {resource.languages}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Self-Help Guides */}
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-4">Self-Help Guides</h3>
          <div className="grid gap-4">
            {mockResources.selfHelpGuides.map((guide) => (
              <div key={guide.id} className="card p-6">
                <h4 className="font-bold text-text-primary mb-2">{guide.title}</h4>
                <p className="text-text-secondary text-sm mb-4">{guide.description}</p>
                <ol className="space-y-2">
                  {guide.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-text-primary">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'breathing', label: 'Breathing Exercises', icon: '🫁' },
    { id: 'meditation', label: 'Guided Meditations', icon: '🧘' },
    { id: 'articles', label: 'Articles & Tips', icon: '📚' },
    { id: 'crisis', label: 'Crisis Resources', icon: '🆘' }
  ]

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Resource Library</h1>
        <p className="text-text-secondary">Tools and resources for your mental health journey</p>
      </div>

      {/* Search and Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Find resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
              showBookmarksOnly
                ? 'bg-primary text-white'
                : 'border border-gray-200 text-text-secondary hover:text-text-primary'
            }`}
          >
            <Bookmark size={16} />
            Bookmarks Only
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mb-6">
        {activeTab === 'breathing' && renderBreathingExercises()}
        {activeTab === 'meditation' && renderMeditations()}
        {activeTab === 'articles' && renderArticles()}
        {activeTab === 'crisis' && renderCrisisResources()}
      </div>

    </div>
    </SafeComponent>
  )
}

export default ResourceLibraryPage