import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtimePosts(circleId) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()

    const channel = supabase
      .channel(`posts:${circleId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts', filter: `circle_id=eq.${circleId}` },
        (payload) => setPosts(prev => [payload.new, ...prev])
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'posts', filter: `circle_id=eq.${circleId}` },
        (payload) => setPosts(prev => prev.filter(p => p.id !== payload.old.id))
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [circleId])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(username, avatar_url)')
      .eq('circle_id', circleId)
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  return { posts, loading, refetch: fetchPosts }
}
