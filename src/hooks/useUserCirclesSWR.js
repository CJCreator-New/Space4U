import { useMemo } from 'react'
import useSWR from 'swr'
import { storage } from '../services/storage'

// Custom fetcher for user circles data
const userCirclesFetcher = async () => {
  try {
    const userCirclesData = await storage.get('space4u_user_circles')
    return userCirclesData || []
  } catch (error) {
    console.error('Error fetching user circles:', error)
    return []
  }
}

// Hook for fetching user circles data with SWR
export function useUserCirclesSWR() {
  const { data: userCircles = [], error, isLoading, mutate } = useSWR(
    'space4u_user_circles',
    userCirclesFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      refreshInterval: 0, // No automatic refresh
    }
  )

  // Function to update user circles data
  const updateUserCircles = async (circlesData) => {
    try {
      await storage.set('space4u_user_circles', circlesData)

      // Update SWR cache
      mutate(circlesData, false) // false = don't revalidate

      return { success: true }
    } catch (error) {
      console.error('Error updating user circles:', error)
      return { success: false, error }
    }
  }

  // Function to join a circle
  const joinCircle = async (circleId) => {
    try {
      const currentCircles = await storage.get('space4u_user_circles') || []
      if (!currentCircles.includes(circleId)) {
        const updatedCircles = [...currentCircles, circleId]
        await storage.set('space4u_user_circles', updatedCircles)

        // Update SWR cache
        mutate(updatedCircles, false)

        return { success: true }
      }
      return { success: true } // Already joined
    } catch (error) {
      console.error('Error joining circle:', error)
      return { success: false, error }
    }
  }

  // Function to leave a circle
  const leaveCircle = async (circleId) => {
    try {
      const currentCircles = await storage.get('space4u_user_circles') || []
      const updatedCircles = currentCircles.filter(id => id !== circleId)
      await storage.set('space4u_user_circles', updatedCircles)

      // Update SWR cache
      mutate(updatedCircles, false)

      return { success: true }
    } catch (error) {
      console.error('Error leaving circle:', error)
      return { success: false, error }
    }
  }

  return {
    userCircles,
    error,
    isLoading,
    mutate,
    updateUserCircles,
    joinCircle,
    leaveCircle
  }
}