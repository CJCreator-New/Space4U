import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, username) => {
    if (!supabase) return { data: null, error: 'Backend not configured' }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })
    
    if (!error && data.user) {
      await supabase.from('profiles').insert([{
        id: data.user.id,
        username,
        points: 0,
        level: 1
      }])
    }
    
    return { data, error }
  }

  const signIn = async (email, password) => {
    if (!supabase) return { data: null, error: 'Backend not configured' }
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    if (!supabase) return { error: 'Backend not configured' }
    return await supabase.auth.signOut()
  }

  return { user, loading, signUp, signIn, signOut }
}
