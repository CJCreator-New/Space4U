import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Users, Shield, Heart, AlertTriangle, Info, Crown, Lock } from 'lucide-react'
import { mockCircles } from '../data/mockCircles'
import CircleCard from '../components/CircleCard'
import FilterModal from '../components/FilterModal'
import { formatNumber } from '../utils/helpers'
import EmptyState from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import SafeComponent from '../components/SafeComponent'
import OnboardingTip from '../components/common/OnboardingTip'
import { getPremiumStatus } from '../utils/premiumUtils'
import { useDebounce } from '../hooks/useDebounce'

function CirclesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('discover')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ category: 'all', sort: 'recommended' })
  const [joinedCircles, setJoinedCircles] = useState([])
  const [circles, setCircles] = useState([])
  const [loading, setLoading] = useState(true)
  const { isPremium } = getPremiumStatus()
  
  const FREE_CIRCLE_LIMIT = 3

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Ensure global circles list exists in localStorage
    const existingAll = JSON.parse(localStorage.getItem('safespace_circles') || 'null')
    if (!existingAll) localStorage.setItem('safespace_circles', JSON.stringify(mockCircles))

    // User's joined circles are stored as an array of ids under safespace_user_circles
    const savedJoined = JSON.parse(localStorage.getItem('safespace_user_circles') || '[]')
    setJoinedCircles(savedJoined)

    setCircles(mockCircles)
    setLoading(false)
  }

  const handleJoinCircle = (circleId) => {
    if (!isPremium && joinedCircles.length >= FREE_CIRCLE_LIMIT) {
      navigate('/premium')
      return
    }
    try {
      if (joinedCircles.includes(circleId)) return
      const newJoined = [...joinedCircles, circleId]
      setJoinedCircles(newJoined)
      localStorage.setItem('safespace_user_circles', JSON.stringify(newJoined))

      // Update member count safely
      setCircles(prev => prev.map(circle => 
        circle.id === circleId 
          ? { ...circle, members: (Number(circle.members) || 0) + 1, isJoined: true }
          : circle
      ))

      // Feedback
      const toast = document.createElement('div')
      toast.textContent = 'Joined circle'
      toast.className = 'fixed top-4 right-4 bg-success text-white px-4 py-2 rounded-xl shadow-lg z-50'
      document.body.appendChild(toast)
      setTimeout(() => document.body.removeChild(toast), 1600)
    } catch (err) {
      console.error('Failed to join circle', err)
    }
  }

  const handleLeaveCircle = (circleId) => {
    try {
      const newJoined = joinedCircles.filter(id => id !== circleId)
      setJoinedCircles(newJoined)
      localStorage.setItem('safespace_user_circles', JSON.stringify(newJoined))

      setCircles(prev => prev.map(circle => 
        circle.id === circleId 
          ? { ...circle, members: Math.max(0, (Number(circle.members) || 0) - 1), isJoined: false }
          : circle
      ))

      const toast = document.createElement('div')
      toast.textContent = 'Left circle'
      toast.className = 'fixed top-4 right-4 bg-warning text-white px-4 py-2 rounded-xl shadow-lg z-50'
      document.body.appendChild(toast)
      setTimeout(() => document.body.removeChild(toast), 1600)
    } catch (err) {
      console.error('Failed to leave circle', err)
    }
  }

  const handleCircleClick = (circleId) => {
    navigate(`/circles/${circleId}`)
  }

  const getFilteredCircles = () => {
    let filtered = circles

    // Filter by debounced search query
    if (debouncedSearch) {
      filtered = filtered.filter(circle => 
        circle.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        circle.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(circle => circle.category === filters.category)
    }

    // Filter by tab
    if (activeTab === 'my-circles') {
      filtered = filtered.filter(circle => joinedCircles.includes(circle.id))
    }

    // Sort
    switch (filters.sort) {
      case 'members':
        filtered.sort((a, b) => b.members - a.members)
        break
      case 'active':
        filtered.sort((a, b) => b.posts - a.posts)
        break
      case 'recent':
        filtered = filtered.filter(circle => joinedCircles.includes(circle.id))
        break
      default: // recommended
        break
    }

    return filtered
  }

  const getRecommendedCircles = () => {
    const user = JSON.parse(localStorage.getItem('safespace_user') || '{}')
    const userInterests = user.interests || []
    
    return circles.filter(circle => {
      if (userInterests.includes('anxiety') && circle.name.includes('Anxiety')) return true
      if (userInterests.includes('depression') && circle.name.includes('Depression')) return true
      if (userInterests.includes('work') && circle.name.includes('Work')) return true
      if (userInterests.includes('wellness') && circle.name.includes('Wellness')) return true
      return false
    }).slice(0, 4)
  }

  const filteredCircles = getFilteredCircles()
  const recommendedCircles = getRecommendedCircles()

  if (loading) {
    return (
    <SafeComponent>
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <LoadingState key={i} type="circleCard" />
            ))}
          </div>
        </div>
      </div>
    
    </SafeComponent>
  )
  }

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto">
      <OnboardingTip page="circles" />
      
      {/* Community Guidelines Banner */}
      <div className="card p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 mb-6">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1 text-gray-900">Safe & Supportive Community</p>
            <p className="text-gray-700">
              Our circles are peer support spaces, not therapy groups. Be kind, respectful, and supportive. 
              If you're in crisis, please contact a mental health professional or call 988.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8 mb-6 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Support Circles</h1>
          </div>
          <p className="text-white/90 text-lg">Find your community, share your journey, support others</p>
        </div>
      </div>

      <div className="mb-6">
        {/* Premium Limit Warning */}
        {!isPremium && joinedCircles.length >= FREE_CIRCLE_LIMIT && (
          <div className="card p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-orange-600" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Circle Limit Reached</p>
                  <p className="text-gray-700">You've joined {FREE_CIRCLE_LIMIT} circles. Upgrade to Premium for unlimited circles and private groups.</p>
                </div>
              </div>
              <button onClick={() => navigate('/premium')} className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap">
                <Crown size={16} />
                Upgrade
              </button>
            </div>
          </div>
        )}
        
        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search circles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              activeTab === 'discover'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('my-circles')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              activeTab === 'my-circles'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            My Circles ({joinedCircles.length})
          </button>
        </div>
      </div>

      {/* Recommended Circles */}
      {activeTab === 'discover' && recommendedCircles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Recommended for You</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recommendedCircles.map((circle) => (
              <div key={circle.id} className="flex-shrink-0 w-64">
                <CircleCard
                  circle={circle}
                  isJoined={joinedCircles.includes(circle.id)}
                  onJoin={handleJoinCircle}
                  onLeave={handleLeaveCircle}
                  onClick={handleCircleClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {activeTab === 'my-circles' && joinedCircles.length === 0 ? (
        <EmptyState
          icon="🌐"
          title="No Circles Yet"
          description="Join circles to connect with supportive communities and share your journey"
          action={() => setActiveTab('discover')}
          actionLabel="Discover Circles"
        />
      ) : filteredCircles.length === 0 && debouncedSearch ? (
        <EmptyState
          icon="🔍"
          title="No Results Found"
          description={`No circles match "${debouncedSearch}". Try different keywords or browse all circles.`}
          action={() => setSearchQuery('')}
          actionLabel="Clear Search"
        />
      ) : filteredCircles.length === 0 ? (
        <EmptyState
          icon="🌟"
          title="No Circles Available"
          description="Check back soon for new support circles"
        />
      ) : (
        /* Circle Grid */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCircles.map((circle, index) => (
            <div key={circle.id} className="stagger-item" style={{ animationDelay: `${index * 50}ms` }}>
              <CircleCard
                circle={circle}
                isJoined={joinedCircles.includes(circle.id)}
                onJoin={handleJoinCircle}
                onLeave={handleLeaveCircle}
                onClick={handleCircleClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Community Guidelines & Safety */}
      <div className="mt-8 space-y-4">
        <div className="card p-4 bg-green-50 border border-green-200">
          <div className="flex gap-3">
            <Heart className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1 text-gray-900">Community Guidelines</p>
              <ul className="text-gray-700 space-y-1">
                <li>• Be respectful and supportive - everyone's journey is unique</li>
                <li>• Share your experiences, not medical advice</li>
                <li>• Respect privacy - what's shared here stays here</li>
                <li>• Report harmful content using the report button</li>
                <li>• Remember: peer support complements, doesn't replace professional care</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-4 bg-yellow-50 border border-yellow-200">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1 text-gray-900">When to Seek Professional Help</p>
              <p className="text-gray-700 mb-2">
                While peer support is valuable, it's not a substitute for professional mental health care. 
                Seek professional help if you're experiencing:
              </p>
              <ul className="text-gray-700 space-y-1">
                <li>• Persistent feelings of sadness, anxiety, or hopelessness</li>
                <li>• Thoughts of self-harm or suicide</li>
                <li>• Difficulty functioning in daily life</li>
                <li>• Substance abuse issues</li>
              </ul>
              <p className="text-gray-700 mt-2 font-medium">
                Crisis support: Call 988 (Suicide & Crisis Lifeline) - Available 24/7
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4 bg-purple-50 border border-purple-200">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1 text-gray-900">The Power of Peer Support</p>
              <p className="text-gray-700">
                Research shows that peer support can reduce feelings of isolation, increase hope, and improve coping skills. 
                Studies indicate that both giving and receiving support benefits mental health. 
                However, peer support works best alongside professional treatment when needed.
              </p>
              <p className="text-xs text-gray-500 italic mt-2">Source: Davidson et al. (2012). Peer Support Among Adults With Serious Mental Illness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SafeComponent>
  )
}

export default CirclesPage