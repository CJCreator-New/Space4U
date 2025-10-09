import { useState, useEffect } from 'react'
import { TrendingUp, Flame } from 'lucide-react'
import { getTrendingPosts } from '../utils/trending'
import { useNavigate } from 'react-router-dom'

function TrendingPosts({ posts = [], circleId }) {
  const [trending, setTrending] = useState([])
  const [timeframe, setTimeframe] = useState('week')
  const navigate = useNavigate()

  useEffect(() => {
    if (!posts || posts.length === 0) {
      setTrending([])
      return
    }
    try {
      const trendingPosts = getTrendingPosts(posts, 5, timeframe)
      setTrending(trendingPosts)
    } catch (error) {
      console.error('Error calculating trending posts:', error)
      setTrending([])
    }
  }, [posts, timeframe])

  if (!posts || posts.length === 0 || trending.length === 0) return null

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary dark:text-white flex items-center gap-2">
          <Flame className="text-orange-500" size={20} />
          Trending Posts
        </h3>
        <div className="flex gap-2">
          {['today', 'week', 'month'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeframe === t
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {trending.map((post, idx) => (
          <div
            key={post.id}
            onClick={() => navigate(`/circles/${post.circleId || circleId}`)}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
                  {post.content}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    {Math.round(post.trendingScore)} score
                  </span>
                  <span>•</span>
                  <span>{post.comments?.length || 0} comments</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrendingPosts
