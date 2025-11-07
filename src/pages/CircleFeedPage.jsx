import { useState, useEffect, useCallback, lazy, Suspense, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Users, ChevronDown, Plus, Grid, List } from 'lucide-react'
import { mockCircles } from '../data/mockCircles'
import { mockPosts } from '../data/mockPosts'
import PostCard from '../components/PostCard'

// Lazy load modals
const CreatePostModal = lazy(() => import('../components/CreatePostModal'))
import { formatNumber } from '../utils/helpers'
import SafeComponent from '../components/SafeComponent'
import { useCirclesSWR } from '../hooks/useCirclesSWR'
import { usePostsSWR } from '../hooks/usePostsSWR'
import { useUserCirclesSWR } from '../hooks/useUserCirclesSWR'
import { useHeartedPostsSWR } from '../hooks/useHeartedPostsSWR'

function CircleFeedPage() {
  const { t } = useTranslation()
  const { circleId } = useParams()
  const navigate = useNavigate()
  const { user } = useSupabaseAuth()
  const { circles: allCircles } = useCirclesSWR()
  const { posts: allPosts } = usePostsSWR()
  const { leaveCircle } = useUserCirclesSWR()
  const { heartedPosts, toggleHeartPost } = useHeartedPostsSWR()
  const [circle, setCircle] = useState(null)
  const { posts: realtimePosts, loading: postsLoading } = useRealtimePosts(circleId)
  const onlineCount = useOnlineUsers(circleId)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [filterBy, setFilterBy] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [showDescription, setShowDescription] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)

  useEffect(() => {
    loadCircleData()
  }, [circleId])

  useEffect(() => {
    if (!postsLoading) {
      const sortedPosts = sortPosts(realtimePosts, sortBy)
      const filteredPosts = filterPosts(sortedPosts, filterBy)
      setPosts(filteredPosts)
      setLoading(false)
    }
  }, [realtimePosts, postsLoading, sortBy, filterBy])

  const loadCircleData = () => {
    const foundCircle = mockCircles.find(c => c.id === parseInt(circleId))
    setCircle(foundCircle)
    setLoading(false)
    if (!foundCircle) {
      // If circle not found locally, navigate back to circles with a helpful message
      const toast = document.createElement('div')
      toast.textContent = 'Circle not found'
      toast.className = 'fixed top-4 right-4 bg-warning text-white px-4 py-2 rounded-xl shadow-lg z-50'
      document.body.appendChild(toast)
      setTimeout(() => document.body.removeChild(toast), 1800)
      // gently navigate back after short delay
      setTimeout(() => navigate('/circles'), 900)
    }
  }



  const loadMorePosts = useCallback(() => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    
    setTimeout(() => {
      const circlePosts = mockPosts.filter(post => post.circleId === parseInt(circleId))
      const sortedPosts = sortPosts(circlePosts, sortBy)
      const filteredPosts = filterPosts(sortedPosts, filterBy)
      
      const nextPage = page + 1
      const newPosts = filteredPosts.slice(0, nextPage * 10)
      
      setPosts(newPosts)
      setPage(nextPage)
      setHasMore(filteredPosts.length > nextPage * 10)
      setLoadingMore(false)
    }, 1000)
  }, [circleId, sortBy, filterBy, page, loadingMore, hasMore])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loadingMore) {
        loadMorePosts()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, loadingMore, loadMorePosts])

  const sortPosts = useCallback((posts, sort) => {
    switch (sort) {
      case 'popular':
        return [...posts].sort((a, b) => b.hearts - a.hearts)
      case 'trending':
        return [...posts].sort((a, b) => b.commentCount - a.commentCount)
      default: // recent
        return [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }
  }, [])

  const filterPosts = useCallback((posts, filter) => {
    switch (filter) {
      case 'hearted':
        return posts.filter(post => heartedPosts.includes(post.id))
      case 'commented':
        return posts.filter(post => allPosts.some(up => up.id === post.id))
      default: // all
        return posts
    }
  }, [heartedPosts, allPosts])

  const handleLeaveCircle = async () => {
    const result = await leaveCircle(parseInt(circleId))
    if (result.success) {
      navigate('/circles')
    }
  }

  const handleHeartPost = async (postId, isHearted) => {
    await toggleHeartPost(postId, isHearted)
  }

  const handleSharePost = () => {
    // Show toast notification
    const toast = document.createElement('div')
    toast.textContent = t('circles.linkCopied')
    toast.className = 'fixed top-4 right-4 bg-success text-white px-4 py-2 rounded-xl shadow-lg z-50'
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 2000)
  }

  const handlePostCreated = (newPost) => {
    // Add new post to the beginning of the feed
    setPosts(prev => [newPost, ...prev])
    // Scroll to top to show the new post
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    setPage(1)
  }

  const handleFilterChange = (newFilter) => {
    setFilterBy(newFilter)
    setPage(1)
  }

  if (loading || !circle) {
    return (
      <SafeComponent>
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="card p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SafeComponent>
    )
  }

  return (
    <SafeComponent>
      <div className="max-w-2xl mx-auto pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-background z-40 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/circles')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-2xl">{circle.icon}</div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">{circle.name}</h1>
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <Users size={14} />
                  <span>{formatNumber(circle.members)} members</span>
                  {onlineCount > 0 && (
                    <span className="ml-2 text-green-600">• {t('circles.online', { count: onlineCount })}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLeaveCircle}
            className="px-4 py-2 text-danger border border-danger rounded-xl hover:bg-danger hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">{t('circles.leaveCircle')}</span>
            <span className="sm:hidden">{t('circles.leave')}</span>
          </button>
        </div>

        {/* Description */}
        <div className="mb-4">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <span className="text-sm">{circle.description}</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform ${showDescription ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Sort & Filter Bar */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
            >
              <option value="recent">{t('circles.recent')}</option>
              <option value="popular">{t('circles.popular')}</option>
              <option value="trending">{t('circles.trending')}</option>
            </select>
            
            <select
              value={filterBy}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
            >
              <option value="all">{t('circles.allPosts')}</option>
              <option value="hearted">{t('circles.postsIveHearted')}</option>
              <option value="commented">{t('circles.postsIveCommented')}</option>
            </select>
          </div>

          <div className="flex gap-2 sm:hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary'}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-secondary'}`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">{circle.icon}</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {filterBy === 'all' ? t('circles.beFirstToStart') : t('circles.noPostsMatch')}
          </h3>
          <p className="text-text-secondary mb-6">
            {filterBy === 'all' ? t('circles.shareWhatsOnMind') : t('circles.tryAdjustingFilters')}
          </p>
          {filterBy !== 'all' && (
            <button
              onClick={() => handleFilterChange('all')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              {t('circles.clearFilters')}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id || post.name || Math.random()}
              post={post}
              circleColor={circle.color}
              onHeart={handleHeartPost}
              onShare={handleSharePost}
            />
          ))}
        </div>
      )}

      {/* Loading More */}
      {loadingMore && (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-text-secondary text-sm mt-2">{t('circles.loadingMore')}</p>
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-6">
          <p className="text-text-secondary">{t('circles.caughtUp')}</p>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 hover:scale-110"
        style={{ backgroundColor: circle.color }}
      >
        <Plus size={24} />
      </button>

      {/* Create Post Modal */}
      <Suspense fallback={null}>
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          circle={circle}
          onPostCreated={handlePostCreated}
        />
      </Suspense>
      </div>
    </SafeComponent>
  )
}

export default CircleFeedPage
