import { useCallback, useEffect, useMemo, useReducer, useRef, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Users, Plus } from 'lucide-react'
import useSWR from 'swr'
import CircleCard from '../components/CircleCard'
import CreateCircleModal from '../components/CreateCircleModal'
import VirtualizedList from '../components/common/VirtualizedList'
import { useDebounce } from '../hooks/useDebounce'
import { usePremiumStatus } from '../hooks/usePremiumStatus'
import { api } from '../utils/supabase'

const MemoizedCircleCard = memo(CircleCard)

const initialState = {
  activeTab: 'discover',
  searchQuery: '',
  showFilters: false,
  showCreateModal: false,
  filters: { category: 'all', sort: 'recommended' },
  page: 1
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TAB': return { ...state, activeTab: action.payload }
    case 'SET_SEARCH': return { ...state, searchQuery: action.payload, page: 1 }
    case 'SET_FILTERS': return { ...state, filters: action.payload, page: 1 }
    case 'TOGGLE_FILTERS': return { ...state, showFilters: !state.showFilters }
    case 'TOGGLE_CREATE': return { ...state, showCreateModal: !state.showCreateModal }
    case 'NEXT_PAGE': return { ...state, page: state.page + 1 }
    default: return state
  }
}

function CirclesPageOptimized() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, initialState)
  const debouncedSearch = useDebounce(state.searchQuery, 300)
  const { isPremium } = usePremiumStatus()
  
  // SWR for data fetching with caching
  const { data: circles = [], error, mutate } = useSWR(
    `/circles?page=${state.page}&limit=20&category=${state.filters.category}&sort=${state.filters.sort}&search=${debouncedSearch}`,
    () => api.getCircles({ 
      page: state.page, 
      limit: 20,
      category: state.filters.category,
      sort: state.filters.sort,
      search: debouncedSearch 
    }),
    { 
      revalidateOnFocus: false,
      dedupingInterval: 60000 // 1 minute
    }
  )

  const { data: joinedCircles = [] } = useSWR(
    '/user/circles',
    () => api.getUserCircles(),
    { revalidateOnFocus: false }
  )

  const handleJoin = useCallback(async (circleId) => {
    if (!isPremium && joinedCircles.length >= 3) {
      navigate('/premium')
      return
    }
    
    // Optimistic update
    mutate(
      circles.map(c => c.id === circleId ? { ...c, isJoined: true, members: c.members + 1 } : c),
      false
    )
    
    try {
      await api.joinCircle(circleId)
      mutate() // Revalidate
    } catch (err) {
      mutate() // Rollback on error
    }
  }, [isPremium, joinedCircles, circles, mutate, navigate])

  const filteredCircles = useMemo(() => {
    let filtered = circles
    
    if (state.activeTab === 'my-circles') {
      filtered = filtered.filter(c => c.isJoined)
    }
    
    return filtered
  }, [circles, state.activeTab])

  if (error) return <div>Error loading circles</div>

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Circles</h1>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_CREATE' })}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl"
        >
          <Plus size={20} />
          Create Circle
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search circles..."
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          className="flex-1 px-4 py-3 border-2 rounded-xl"
        />
        <button
          onClick={() => dispatch({ type: 'TOGGLE_FILTERS' })}
          className="px-4 py-3 border-2 rounded-xl"
        >
          <Filter size={20} />
        </button>
      </div>

      <VirtualizedList
        items={filteredCircles}
        itemHeight={220}
        renderItem={(circle) => (
          <MemoizedCircleCard
            circle={circle}
            isJoined={circle.isJoined}
            onJoin={handleJoin}
            onClick={(id) => navigate(`/circles/${id}`)}
          />
        )}
      />

      {state.showCreateModal && (
        <CreateCircleModal
          onClose={() => dispatch({ type: 'TOGGLE_CREATE' })}
          onSuccess={() => {
            mutate()
            dispatch({ type: 'TOGGLE_CREATE' })
          }}
        />
      )}
    </div>
  )
}

export default CirclesPageOptimized
