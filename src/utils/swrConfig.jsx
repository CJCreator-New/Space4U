import { SWRConfig } from 'swr'
import { storage } from '../services/storage'

// Custom fetcher that works with our storage system
export const storageFetcher = async (key) => {
  return await storage.get(key)
}

// API fetcher for backend calls
export const apiFetcher = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }
  return response.json()
}

// Combined fetcher that tries storage first, then API
export const hybridFetcher = async (key) => {
  try {
    // Try local storage first
    const localData = await storage.get(key)
    if (localData !== null && localData !== undefined) {
      return localData
    }

    // If no local data, try API (for future backend integration)
    // For now, return empty data
    return {}
  } catch (error) {
    console.error(`Error fetching ${key}:`, error)
    return {}
  }
}

// SWR configuration
export const swrConfig = {
  fetcher: hybridFetcher,
  revalidateOnFocus: false, // Disable revalidation on focus to reduce requests
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // Dedupe requests within 5 seconds
  errorRetryInterval: 5000,
  errorRetryCount: 3,
  refreshInterval: 0, // No automatic refresh for local data
  suspense: false,
  loadingTimeout: 3000,

  // Custom onError handler
  onError: (error, key) => {
    console.error(`SWR Error for ${key}:`, error)
  },

  // Custom onSuccess handler for logging
  onSuccess: (data, key) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`SWR Success for ${key}:`, data)
    }
  }
}

// SWR Provider component
export function SWRProvider({ children }) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  )
}