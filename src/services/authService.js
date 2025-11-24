import { supabase, isBackendEnabled } from '../lib/supabase'

export const authService = {
    async getSession() {
        if (!isBackendEnabled()) return { data: { session: null }, error: null }
        return supabase.auth.getSession()
    },

    async signUp(email, password) {
        if (!isBackendEnabled()) throw new Error('Backend not configured')
        return supabase.auth.signUp({ email, password })
    },

    async signIn(email, password) {
        if (!isBackendEnabled()) throw new Error('Backend not configured')
        return supabase.auth.signInWithPassword({ email, password })
    },

    async signOut() {
        if (!isBackendEnabled()) return
        return supabase.auth.signOut()
    },

    onAuthStateChange(callback) {
        if (!isBackendEnabled()) return { data: { subscription: { unsubscribe: () => { } } } }
        return supabase.auth.onAuthStateChange(callback)
    },

    isEnabled() {
        return isBackendEnabled()
    }
}
