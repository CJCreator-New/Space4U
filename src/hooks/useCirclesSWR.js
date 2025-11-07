import { useMemo } from 'react'
import useSWR from 'swr'
import { storage } from '../services/storage'
import { api } from '../utils/supabase'

// Custom fetcher for circles data (hybrid: local + API)
const circlesFetcher = async () => {
  try {
    // Try local storage first
    const localCircles = await storage.get('space4u_circles')
    if (localCircles && Array.isArray(localCircles) && localCircles.length > 0) {
      return localCircles
    }

    // If no local data, try API
    try {
      const response = await api.getCircles()
      if (response.data) {
        // Cache the API response locally
        await storage.set('space4u_circles', response.data)
        return response.data
      }
    } catch (apiError) {
      console.warn('API fetch failed, using mock data:', apiError)
    }

    // Fallback to mock data
    const { mockCircles } = await import('../data/mockCircles')
    return mockCircles
  } catch (error) {
    console.error('Error fetching circles:', error)
    const { mockCircles } = await import('../data/mockCircles')
    return mockCircles
  }
}

// Hook for fetching circles data with SWR
export function useCirclesSWR() {
  const { data: circles = [], error, isLoading, mutate } = useSWR(
    'space4u_circles',
    circlesFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
      refreshInterval: 300000, // Refresh every 5 minutes for circles
      errorRetryCount: 2,
    }
  )

  // Function to refresh circles from API
  const refreshCircles = async () => {
    try {
      const response = await api.getCircles()
      if (response.data) {
        await storage.set('space4u_circles', response.data)
        mutate(response.data, false)
        return { success: true }
      }
    } catch (error) {
      console.error('Error refreshing circles:', error)
      return { success: false, error }
    }
  }

  // Function to join a circle
  const joinCircle = async (circleId) => {
    try {
      // Optimistic update
      const updatedCircles = circles.map(circle =>
        circle.id === circleId
          ? { ...circle, isJoined: true, memberCount: (circle.memberCount || 0) + 1 }
          : circle
      )
      mutate(updatedCircles, false)

      // API call
      const response = await api.joinCircle(circleId)
      if (response.error) {
        // Revert optimistic update on error
        mutate(circles, false)
        return { success: false, error: response.error }
      }

      return { success: true }
    } catch (error) {
      // Revert optimistic update
      mutate(circles, false)
      console.error('Error joining circle:', error)
      return { success: false, error }
    }
  }

  // Function to leave a circle
  const leaveCircle = async (circleId) => {
    try {
      // Optimistic update
      const updatedCircles = circles.map(circle =>
        circle.id === circleId
          ? { ...circle, isJoined: false, memberCount: Math.max((circle.memberCount || 0) - 1, 0) }
          : circle
      )
      mutate(updatedCircles, false)

      // API call
      const response = await api.leaveCircle(circleId)
      if (response.error) {
        // Revert optimistic update on error
        mutate(circles, false)
        return { success: false, error: response.error }
      }

      return { success: true }
    } catch (error) {
      // Revert optimistic update
      mutate(circles, false)
      console.error('Error leaving circle:', error)
      return { success: false, error }
    }
  }

  // Get user's joined circles
  const joinedCircles = useMemo(() => {
    return circles.filter(circle => circle.isJoined)
  }, [circles])

  // Get available circles (not joined)
  const availableCircles = useMemo(() => {
    return circles.filter(circle => !circle.isJoined)
  }, [circles])

  return {
    circles,
    joinedCircles,
    availableCircles,
    loading: isLoading,
    error,
    refreshCircles,
    joinCircle,
    leaveCircle,
    mutate
  }
}