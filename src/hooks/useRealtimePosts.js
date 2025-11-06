import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { mockPosts } from '../data/mockPosts'

export function useRealtimePosts(circleId) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()

    if (!supabase) return

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
    
    if (!supabase) {
      const circlePosts = mockPosts.filter(p => p.circleId === parseInt(circleId))
      setPosts(circlePosts)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, avatar_url)')
        .eq('circle_id', circleId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      // Fallback to mock data if Supabase tables don't exist
      console.log('Using mock data (Supabase tables not set up yet)')
      const circlePosts = mockPosts.filter(p => p.circleId === parseInt(circleId))
      setPosts(circlePosts)
    }
    setLoading(false)
  }

  return { posts, loading, refetch: fetchPosts }
}
