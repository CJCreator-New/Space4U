import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useSupabaseAuth } from '../contexts/AuthContext'

export function useOnlineUsers(circleId) {
  const [onlineCount, setOnlineCount] = useState(0)
  const { user } = useSupabaseAuth()

  useEffect(() => {
    if (!user || !circleId || !supabase) return

    const channel = supabase.channel(`circle:${circleId}:presence`, {
      config: { presence: { key: user.id } }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setOnlineCount(Object.keys(state).length)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: user.id, online_at: new Date().toISOString() })
        }
      })

    return () => supabase.removeChannel(channel)
  }, [user, circleId])

  return onlineCount
}
