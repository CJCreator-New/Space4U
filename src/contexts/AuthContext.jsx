import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isBackendEnabled } from '../lib/supabase'
import { fullMigrationService } from '../services/fullMigrationService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isBackendEnabled()) {
      setError('Supabase not configured. Please add credentials to .env file.')
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user && !fullMigrationService.isMigrationComplete()) {
        fullMigrationService.migrateAllData(session.user.id).catch(console.error)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_IN' && session?.user && !fullMigrationService.isMigrationComplete()) {
        await fullMigrationService.migrateAllData(session.user.id).catch(console.error)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = (email, password) => {
    if (!isBackendEnabled()) return Promise.reject(new Error('Backend not configured'))
    return supabase.auth.signUp({ email, password })
  }
  
  const signIn = (email, password) => {
    if (!isBackendEnabled()) return Promise.reject(new Error('Backend not configured'))
    return supabase.auth.signInWithPassword({ email, password })
  }
  
  const signOut = () => {
    if (!isBackendEnabled()) return Promise.reject(new Error('Backend not configured'))
    return supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useSupabaseAuth = () => useContext(AuthContext)
