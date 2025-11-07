import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Users, Shield, Heart, AlertTriangle, Info, Crown, Lock, Sparkles, Activity, TrendingUp, ArrowRight } from 'lucide-react'
import { mockCircles } from '../data/mockCircles'
import CircleCard from '../components/CircleCard'
import FilterModal from '../components/FilterModal'
import VirtualizedList from '../components/common/VirtualizedList'
import { formatNumber } from '../utils/helpers'
import EmptyState from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import SafeComponent from '../components/SafeComponent'
import OnboardingTip from '../components/common/OnboardingTip'
import { getPremiumStatus } from '../utils/premiumUtils'
import { useDebounce } from '../hooks/useDebounce'
import { trackEvent, EVENTS, trackPageView } from '../utils/analytics'
import { api } from '../utils/supabase'

const COLOR_PALETTE = ['#6366F1', '#8B5CF6', '#3B82F6', '#EC4899', '#F59E0B', '#EF4444', '#10B981', '#14B8A6']

const normalizeTagList = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }
  if (value && typeof value === 'object') {
    return Object.values(value).filter(Boolean)
  }
  return []
}

const ensureNumber = (value, fallback = 0) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}

const formatRelativeTime = (value) => {
  if (!value) return ''
  if (typeof value === 'string' && /ago$/i.test(value.trim())) {
    return value
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const diffMs = Date.now() - date.getTime()
  if (diffMs <= 60000) {
    return 'Active now'
  }
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 60) {
    return `Active ${minutes}m ago`
  }
  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    return `Active ${hours}h ago`
  }
  const days = Math.round(hours / 24)
  if (days < 7) {
    return `Active ${days}d ago`
  }
  const weeks = Math.round(days / 7)
  if (weeks < 4) {
    return `Active ${weeks}w ago`
  }
  const months = Math.round(days / 30)
  if (months < 12) {
    return `Active ${months}mo ago`
  }
  const years = Math.round(days / 365)
  return `Active ${years}y ago`
}

const buildFeaturedPost = (circle) => {
  if (circle?.featuredPost?.title) {
    return circle.featuredPost
  }

  const raw = circle?.featured_post || circle?.latest_post
  if (raw && raw.title) {
    return {
      title: raw.title,
      author: raw.author || raw.username || raw.owner || 'Community member',
      timeAgo: raw.timeAgo || raw.relative_time || raw.time_ago || ''
    }
  }

  if (circle?.latest_post_title) {
    return {
      title: circle.latest_post_title,
      author: circle.latest_post_author || 'Community member',
      timeAgo: circle.latest_post_timeAgo || circle.latest_post_time_ago || ''
    }
  }

  return undefined
}

const extractCirclesFromResponse = (response) => {
  if (!response) return []
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.circles)) return response.circles
  if (Array.isArray(response?.data?.circles)) return response.data.circles
  return []
}

const normalizeCircleRecord = (circle, index, joinedLookup) => {
  const resolvedId = circle?.id ?? circle?.circle_id ?? circle?.uuid ?? circle?.slug ?? `circle-${index}`
  const idString = String(resolvedId)
  const tags = normalizeTagList(circle?.tags ?? circle?.topics)
  const members = ensureNumber(circle?.members ?? circle?.member_count ?? circle?.total_members)
  const posts = ensureNumber(circle?.posts ?? circle?.post_count ?? circle?.total_posts)
  const unreadCount = ensureNumber(circle?.unreadCount ?? circle?.unread_count ?? circle?.new_posts)
  const icon = circle?.icon ?? circle?.emoji ?? ''
  const color = circle?.color ?? circle?.theme_color ?? COLOR_PALETTE[index % COLOR_PALETTE.length]
  const lastActiveRaw = circle?.lastActive ?? circle?.last_active ?? circle?.last_active_at ?? circle?.last_active_label ?? circle?.last_active_humanized
  const highlight = circle?.highlight ?? circle?.highlight_text ?? circle?.tagline ?? circle?.purpose ?? ''

  return {
    id: resolvedId,
    name: circle?.name ?? circle?.title ?? 'Circle',
    description: circle?.description ?? circle?.summary ?? 'Connect with peers in a supportive space.',
    icon,
    color,
    category: circle?.category ?? circle?.category_slug ?? circle?.topic ?? 'support',
    tags,
    members,
    posts,
    unreadCount,
    lastActive: lastActiveRaw ? formatRelativeTime(lastActiveRaw) : '',
    highlight: highlight || undefined,
    featuredPost: buildFeaturedPost(circle),
    isJoined: joinedLookup.has(idString)
  }
}

const initialState = {
  activeTab: 'discover',
  searchQuery: '',
  showFilters: false,
  filters: { category: 'all', sort: 'recommended' },
  joinedCircles: [],
  circles: [],
  loading: true,
  feedback: null,
  joinCelebration: null
}

const circlesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'SET_SHOW_FILTERS':
      return { ...state, showFilters: action.payload }
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }
    case 'SET_JOINED_CIRCLES':
      return { ...state, joinedCircles: action.payload }
    case 'SET_CIRCLES':
      return { ...state, circles: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload }
    case 'SET_JOIN_CELEBRATION':
      return { ...state, joinCelebration: action.payload }
    case 'JOIN_CIRCLE':
      const { circleId, targetCircle } = action.payload
      const idKey = String(circleId)
      if (state.joinedCircles.includes(idKey)) return state
      const newJoined = [...state.joinedCircles, idKey]
      return {
        ...state,
        joinedCircles: newJoined,
        circles: state.circles.map(circle =>
          String(circle.id) === idKey
            ? { ...circle, members: (Number(circle.members) || 0) + 1, isJoined: true }
            : circle
        ),
        joinCelebration: {
          id: idKey,
          name: targetCircle?.name ?? 'circle',
          highlight: targetCircle?.highlight,
          featuredPost: targetCircle?.featuredPost
        }
      }
    case 'LEAVE_CIRCLE':
      const leaveIdKey = String(action.payload)
      const filteredJoined = state.joinedCircles.filter(id => id !== leaveIdKey)
      return {
        ...state,
        joinedCircles: filteredJoined,
        circles: state.circles.map(circle =>
          String(circle.id) === leaveIdKey
            ? { ...circle, members: Math.max(0, (Number(circle.members) || 0) - 1), isJoined: false }
            : circle
        )
      }
    default:
      return state
  }
}

function CirclesPage() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(circlesReducer, initialState)
  const debouncedSearch = useDebounce(state.searchQuery, 300)
  const { isPremium } = getPremiumStatus()
  
  const FREE_CIRCLE_LIMIT = 3

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current)
      }
    }
  }, [])

  const showFeedback = (message, tone = 'success') => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current)
    }
    dispatch({ type: 'SET_FEEDBACK', payload: { message, tone } })
    feedbackTimerRef.current = setTimeout(() => dispatch({ type: 'SET_FEEDBACK', payload: null }), 2400)
  }

  const loadData = useCallback(async ({ showLoading = false } = {}) => {
    try {
      if (showLoading) {
        dispatch({ type: 'SET_LOADING', payload: true })
      }

      let savedJoinedRaw
      try {
        savedJoinedRaw = JSON.parse(localStorage.getItem('space4u_user_circles') || '[]')
      } catch (parseError) {
        console.warn('Unable to parse joined circles cache, resetting', parseError)
        savedJoinedRaw = []
      }
      const normalizedJoined = Array.isArray(savedJoinedRaw)
        ? savedJoinedRaw.map((id) => String(id))
        : []
      if (!isMountedRef.current) {
        return
      }
      dispatch({ type: 'SET_JOINED_CIRCLES', payload: normalizedJoined })
      const joinedLookup = new Set(normalizedJoined)

      let storedFallback
      try {
        storedFallback = JSON.parse(localStorage.getItem('space4u_circles') || 'null')
      } catch (fallbackParseError) {
        console.warn('Unable to parse circles cache, falling back to defaults', fallbackParseError)
        storedFallback = null
      }
      const fallbackCircles = Array.isArray(storedFallback) ? storedFallback : mockCircles

      try {
        const response = await api.getCircles()
        const remoteCircles = extractCirclesFromResponse(response)
        const sourceCircles = remoteCircles.length ? remoteCircles : fallbackCircles
        const processedCircles = sourceCircles.map((circle, index) =>
          normalizeCircleRecord(circle, index, joinedLookup)
        )
        if (!isMountedRef.current) {
          return
        }
        dispatch({ type: 'SET_CIRCLES', payload: processedCircles })
        localStorage.setItem('space4u_circles', JSON.stringify(processedCircles))
      } catch (fetchError) {
        console.error('Failed to load circles', fetchError)
        const processedCircles = fallbackCircles.map((circle, index) =>
          normalizeCircleRecord(circle, index, joinedLookup)
        )
        if (!isMountedRef.current) {
          return
        }
        dispatch({ type: 'SET_CIRCLES', payload: processedCircles })
      }
    } finally {
      if (isMountedRef.current) {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }
  }, [])

  useEffect(() => {
    loadData({ showLoading: true })
  }, [loadData])

  useEffect(() => {
    // Track page view only once on mount
    trackPageView('circles')
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadData()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [loadData])

  const handleJoinCircle = (circleId) => {
    const idKey = String(circleId)
    if (!isPremium && state.joinedCircles.length >= FREE_CIRCLE_LIMIT) {
      navigate('/premium')
      return
    }
    try {
      if (state.joinedCircles.includes(idKey)) return
      trackEvent(EVENTS.CIRCLE_JOINED, { circleId: idKey, source: 'circle_card' })

      const targetCircle = state.circles.find(circle => String(circle.id) === idKey)
      const newJoined = [...state.joinedCircles, idKey]
      dispatch({ type: 'SET_JOINED_CIRCLES', payload: newJoined })
      localStorage.setItem('space4u_user_circles', JSON.stringify(newJoined))

      dispatch({
        type: 'JOIN_CIRCLE',
        payload: { circleId, targetCircle }
      })

      showFeedback('Joined circle', 'success')
      trackEvent(EVENTS.CIRCLE_JOIN_CTA_SHOWN, { circleId: idKey })
    } catch (err) {
      console.error('Failed to join circle', err)
    }
  }

  const handleLeaveCircle = (circleId) => {
    const idKey = String(circleId)
    try {
      trackEvent(EVENTS.CIRCLE_LEFT, { circleId: idKey })
      const newJoined = state.joinedCircles.filter(id => id !== idKey)
      dispatch({ type: 'SET_JOINED_CIRCLES', payload: newJoined })
      localStorage.setItem('space4u_user_circles', JSON.stringify(newJoined))

      dispatch({ type: 'LEAVE_CIRCLE', payload: circleId })

      showFeedback('Left circle', 'warning')
      dispatch({ type: 'SET_JOIN_CELEBRATION', payload: state.joinCelebration?.id === idKey ? null : state.joinCelebration })
    } catch (err) {
      console.error('Failed to leave circle', err)
    }
  }

  const handleTabChange = (tab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })
  }

  const handleSearchChange = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }

  const handleShowFilters = (show) => {
    dispatch({ type: 'SET_SHOW_FILTERS', payload: show })
  }

  const handleFiltersChange = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }

  const handleCircleClick = (circleId, source = 'card') => {
    const idKey = String(circleId)
    trackEvent(EVENTS.CIRCLE_VIEWED, { circleId: idKey, source })
    dispatch({ type: 'SET_JOIN_CELEBRATION', payload: null })
    navigate(`/circles/${idKey}`)
  }

  const getFilteredCircles = () => {
    let filtered = [...state.circles]

    // Filter by debounced search query
    if (debouncedSearch) {
      filtered = filtered.filter(circle => 
        circle.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        circle.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    // Filter by category
    if (state.filters.category !== 'all') {
      filtered = filtered.filter(circle => circle.category === state.filters.category)
    }

    // Filter by tab
    if (state.activeTab === 'my-circles') {
      filtered = filtered.filter(circle => state.joinedCircles.includes(String(circle.id)))
    }

    // Sort
    switch (state.filters.sort) {
      case 'members':
        filtered = [...filtered].sort((a, b) => (b.members || 0) - (a.members || 0))
        break
      case 'active':
        filtered = [...filtered].sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0))
        break
      case 'growth':
        filtered = [...filtered].sort((a, b) => (b.posts || 0) - (a.posts || 0))
        break
      default: // recommended
        break
    }

    return filtered
  }

  const getRecommendedCircles = () => {
    const user = JSON.parse(localStorage.getItem('space4u_user') || '{}')
    const userInterests = user.interests || []
    
    const matched = circles.filter(circle => {
      if (userInterests.includes('anxiety') && circle.name.includes('Anxiety')) return true
      if (userInterests.includes('depression') && circle.name.includes('Depression')) return true
      if (userInterests.includes('work') && circle.name.includes('Work')) return true
      if (userInterests.includes('wellness') && circle.name.includes('Wellness')) return true
      return false
    })

    if (matched.length > 0) {
      return matched.slice(0, 4)
    }

    return [...circles]
      .sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0))
      .slice(0, 4)
  }

  const filteredCircles = getFilteredCircles()
  const recommendedCircles = getRecommendedCircles()
  const circleStats = useMemo(() => {
    const totalMembers = circles.reduce((acc, circle) => acc + (Number(circle.members) || 0), 0)
    const activeCircles = circles.filter(circle => (circle.unreadCount || 0) > 0).length
    const joinedCount = state.joinedCircles.length

    return {
      totalMembers,
      activeCircles,
      joinedCount
    }
  }, [circles, joinedCircles])
  const sortShortcuts = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'active', label: 'Active now' },
    { id: 'members', label: 'Largest circles' },
    { id: 'growth', label: 'Growing fast' }
  ]

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
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {feedback?.message}
    </div>
    {state.feedback && (
      <div
        className={`fixed top-6 right-6 z-50 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all ${
          feedback.tone === 'warning' ? 'bg-warning' : 'bg-success'
        }`}
      >
        {feedback.message}
      </div>
    )}
    <div className="max-w-6xl mx-auto">
      <OnboardingTip page="circles" />
      
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 mb-6 shadow-2xl text-white">
        <div className="absolute inset-0 bg-black/15"></div>
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-white/20 blur-3xl"></div>
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.6fr,1fr] items-start">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-10 w-10" aria-hidden />
              <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg">Find Your Space</h1>
            </div>
            <p className="max-w-2xl text-lg text-white/90">
              Join peer-led circles to share, listen, and grow together. Track the communities that match your goals and step into conversations that feel safe and supportive.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4" aria-hidden />
                <span>Daily prompts help break the ice and spark meaningful check-ins.</span>
              </li>
              <li className="flex items-start gap-2">
                <Activity className="mt-0.5 h-4 w-4" aria-hidden />
                <span>See which circles are active right now so you can jump in when support is flowing.</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-4 w-4" aria-hidden />
                <span>Personalized recommendations grow with you as your needs evolve.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-sm shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Today's pulse</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Circles you're in</span>
                <span className="text-lg font-semibold">{circleStats.joinedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Active circles right now</span>
                <span className="text-lg font-semibold">{circleStats.activeCircles}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Community members</span>
                <span className="text-lg font-semibold">{formatNumber(circleStats.totalMembers)}</span>
              </div>
            </div>
            <button
              onClick={() => handleTabChange('discover')}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-purple-600 transition hover:bg-white"
            >
              Discover circles
              <Filter size={16} aria-hidden />
            </button>
          </div>
        </div>
      </div>

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

      {state.joinCelebration && (
        <div className="card mb-6 border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" aria-hidden />
              <div>
                <p className="font-semibold text-text-primary">You're in! {state.joinCelebration.name} is ready for you.</p>
                {state.joinCelebration.highlight && (
                  <p className="mt-1 text-sm text-text-secondary">{joinCelebration.highlight}</p>
                )}
                {joinCelebration.featuredPost && (
                  <p className="mt-2 text-xs text-text-secondary">
                    Latest highlight: <span className="font-medium text-text-primary">{joinCelebration.featuredPost.title}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={() => {
                  trackEvent(EVENTS.CIRCLE_JOIN_CTA_CLICKED, { circleId: joinCelebration.id })
                  handleCircleClick(joinCelebration.id, 'join_celebration_cta')
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Enter circle
                <ArrowRight size={16} aria-hidden />
              </button>
              <button
                onClick={() => {
                  trackEvent(EVENTS.CIRCLE_JOIN_CTA_DISMISSED, { circleId: joinCelebration.id })
                  setJoinCelebration(null)
                }}
                className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

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
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search circles"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => handleShowFilters(true)}
            aria-label="Open filters"
            className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors"
          >
            <Filter size={20} />
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Sort circles">
          {sortShortcuts.map((option) => {
            const isActive = filters.sort === option.id
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isActive}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                onClick={() => {
                  trackEvent(EVENTS.CIRCLE_SORT_SELECTED, { sort: option.id, isActive })
                  handleFiltersChange({ ...state.filters, sort: option.id })
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6">
          <button
            onClick={() => handleTabChange('discover')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              state.activeTab === 'discover'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => handleTabChange('my-circles')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              state.activeTab === 'my-circles'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            My Circles ({joinedCircles.length})
          </button>
        </div>
      </div>

      {/* Recommended Circles */}
      {state.activeTab === 'discover' && recommendedCircles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Recommended for You</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recommendedCircles.map((circle) => (
              <div key={circle.id || circle.name || Math.random()} className="flex-shrink-0 w-64">
                <CircleCard
                  circle={circle}
                  isJoined={joinedCircles.includes(String(circle.id))}
                  onJoin={handleJoinCircle}
                  onLeave={handleLeaveCircle}
                  onClick={(id) => handleCircleClick(id, 'recommended_carousel')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {state.activeTab === 'my-circles' && state.joinedCircles.length === 0 ? (
        <EmptyState
          icon="🌐"
          title="No Circles Yet"
          description="Join circles to connect with supportive communities and share your journey"
          action={() => handleTabChange('discover')}
          actionLabel="Discover Circles"
          showPreview={true}
          previewType="post"
        />
      ) : filteredCircles.length === 0 && debouncedSearch ? (
        <EmptyState
          icon=""
          title="No Results Found"
          description={`No circles match "${debouncedSearch}". Try different keywords or browse all circles.`}
          action={() => handleSearchChange('')}
          actionLabel="Clear Search"
        />
      ) : filteredCircles.length === 0 ? (
        <EmptyState
          icon=""
          title="No Circles Available"
          description="Check back soon for new support circles"
        />
      ) : (
        /* Virtualized Circle List */
        <VirtualizedList
          items={filteredCircles}
          itemHeight={220} // Approximate height of CircleCard + margin
          containerHeight={Math.min(filteredCircles.length * 220, 600)} // Dynamic height based on content
          renderItem={(circle, actualIndex) => (
            <div className="px-1 stagger-item" style={{ animationDelay: `${actualIndex * 50}ms` }}>
              <CircleCard
                circle={circle}
                isJoined={joinedCircles.includes(String(circle.id))}
                onJoin={handleJoinCircle}
                onLeave={handleLeaveCircle}
                onClick={(id) => handleCircleClick(id, 'virtual_list')}
              />
            </div>
          )}
          className="space-y-4"
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={state.showFilters}
        onClose={() => handleShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
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
