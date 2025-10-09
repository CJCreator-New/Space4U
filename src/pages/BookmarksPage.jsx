import { useState, useEffect } from 'react'
import { Bookmark, Inbox } from 'lucide-react'
import { getBookmarkedPosts } from '../utils/bookmarks'
import PostCard from '../components/PostCard'

function BookmarksPage() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookmarks()
  }, [])

  const loadBookmarks = () => {
    const userId = JSON.parse(localStorage.getItem('safespace_user') || '{}').username || 'anonymous'
    const allPosts = JSON.parse(localStorage.getItem('safespace_user_posts') || '[]')
    const bookmarks = getBookmarkedPosts(userId, allPosts)
    setBookmarkedPosts(bookmarks)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 h-32 bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2 flex items-center gap-3">
          <Bookmark size={32} />
          Bookmarked Posts
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          {bookmarkedPosts.length} saved {bookmarkedPosts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {bookmarkedPosts.length === 0 ? (
        <div className="card p-12 text-center">
          <Inbox className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-2">
            No bookmarks yet
          </h3>
          <p className="text-text-secondary dark:text-gray-400">
            Bookmark posts to save them for later
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarkedPosts.map(post => (
            <PostCard key={post.id} post={post} onUpdate={loadBookmarks} />
          ))}
        </div>
      )}
    </div>
  )
}

export default BookmarksPage
