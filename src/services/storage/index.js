import { FEATURES } from '../../config/features'
import { LocalStorageAdapter } from './LocalStorageAdapter'
import { SupabaseAdapter } from './SupabaseAdapter'
import { HybridAdapter } from './HybridAdapter'
import { supabase } from '../../lib/supabase'

/**
 * Storage Service
 * Provides unified storage interface with automatic adapter selection
 */

// Select adapter based on feature flags and backend availability
function createStorageAdapter() {
  // Check if backend is configured
  const backendAvailable = supabase !== null
  
  if (FEATURES.USE_BACKEND && backendAvailable) {
    console.log('✅ Using Supabase backend storage')
    return new SupabaseAdapter()
  }
  
  if (FEATURES.ENABLE_SYNC && backendAvailable) {
    console.log('✅ Using Hybrid storage (local + remote sync)')
    return new HybridAdapter()
  }
  
  if (FEATURES.USE_BACKEND && !backendAvailable) {
    console.warn('⚠️ Backend requested but not configured. Using localStorage.')
    console.info('💡 Add Supabase credentials to .env.local to enable backend.')
  }
  
  console.log('📦 Using localStorage (default)')
  return new LocalStorageAdapter()
}

// Export singleton instance
export const storage = createStorageAdapter()

// Export adapters for testing
export { LocalStorageAdapter, SupabaseAdapter, HybridAdapter }

// Export helper to check backend status
export const isBackendEnabled = () => FEATURES.USE_BACKEND && supabase !== null
