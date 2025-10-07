import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Users } from 'lucide-react'
import { mockCircles } from '../data/mockCircles'
import CircleCard from '../components/CircleCard'
import FilterModal from '../components/FilterModal'
import { formatNumber } from '../utils/helpers'
import { EmptyStates } from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import SafeComponent from '../components/SafeComponent'

function CirclesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('discover')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ category: 'all', sort: 'recommended' })
  const [joinedCircles, setJoinedCircles] = useState([])
  const [circles, setCircles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const savedCircles = localStorage.getItem('safespace_circles')
    const joined = savedCircles ? JSON.parse(savedCircles) : []
    setJoinedCircles(joined)
    setCircles(mockCircles)
    setLoading(false)
  }

  const handleJoinCircle = (circleId) => {
    const newJoined = [...joinedCircles, circleId]
    setJoinedCircles(newJoined)
    localStorage.setItem('safespace_circles', JSON.stringify(newJoined))
    
    // Update member count
    setCircles(prev => prev.map(circle => 
      circle.id === circleId 
        ? { ...circle, members: circle.members + 1, isJoined: true }
        : circle
    ))
  }

  const handleLeaveCircle = (circleId) => {
    const newJoined = joinedCircles.filter(id => id !== circleId)
    setJoinedCircles(newJoined)
    localStorage.setItem('safespace_circles', JSON.stringify(newJoined))
    
    // Update member count
    setCircles(prev => prev.map(circle => 
      circle.id === circleId 
        ? { ...circle, members: circle.members - 1, isJoined: false }
        : circle
    ))
  }

  const handleCircleClick = (circleId) => {
    navigate(`/circles/${circleId}`)
  }

  const getFilteredCircles = () => {
    let filtered = circles

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(circle => 
        circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circle.description.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Support Circles</h1>
        <p className="text-text-secondary mb-6">Find your community</p>
        
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
        <EmptyStates.NoCircles onAction={() => setActiveTab('discover')} />
      ) : filteredCircles.length === 0 && searchQuery ? (
        <EmptyStates.NoSearchResults onAction={() => setSearchQuery('')} />
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
    </div>
  )
}

export default CirclesPage