import { useMemo } from 'react'
import useSWR from 'swr'
import { storage } from '../services/storage'
import { filterMoodsByDateRange, DEFAULT_DATE_RANGE } from '../utils/dateRangeUtils'

// Custom fetcher for mood data
const moodsFetcher = async () => {
  try {
    const moodsData = await storage.get('space4u_moods')
    return moodsData || {}
  } catch (error) {
    console.error('Error fetching moods:', error)
    return {}
  }
}

// Hook for fetching all mood data with SWR
export function useMoodsSWR() {
  const { data: allMoods = {}, error, isLoading, mutate } = useSWR(
    'space4u_moods',
    moodsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      refreshInterval: 0, // No automatic refresh
    }
  )

  // Function to save mood data
  const saveMood = async (moodData) => {
    try {
      const currentMoods = await storage.get('space4u_moods') || {}
      const updatedMoods = { ...currentMoods, ...moodData }
      await storage.set('space4u_moods', updatedMoods)

      // Update SWR cache
      mutate(updatedMoods, false) // false = don't revalidate

      return { success: true }
    } catch (error) {
      console.error('Error saving mood:', error)
      return { success: false, error }
    }
  }

  // Function to update a specific mood entry
  const updateMood = async (date, moodData) => {
    try {
      const currentMoods = await storage.get('space4u_moods') || {}
      const updatedMoods = {
        ...currentMoods,
        [date]: { ...currentMoods[date], ...moodData }
      }
      await storage.set('space4u_moods', updatedMoods)

      // Update SWR cache
      mutate(updatedMoods, false)

      return { success: true }
    } catch (error) {
      console.error('Error updating mood:', error)
      return { success: false, error }
    }
  }

  // Function to delete a mood entry
  const deleteMood = async (date) => {
    try {
      const currentMoods = await storage.get('space4u_moods') || {}
      const updatedMoods = { ...currentMoods }
      delete updatedMoods[date]
      await storage.set('space4u_moods', updatedMoods)

      // Update SWR cache
      mutate(updatedMoods, false)

      return { success: true }
    } catch (error) {
      console.error('Error deleting mood:', error)
      return { success: false, error }
    }
  }

  return {
    allMoods,
    loading: isLoading,
    error,
    saveMood,
    updateMood,
    deleteMood,
    mutate
  }
}

// Hook for fetching filtered mood data with date range
export function useMoodsSWRFiltered(dateRange = DEFAULT_DATE_RANGE) {
  const { allMoods, loading, error, saveMood, updateMood, deleteMood, mutate } = useMoodsSWR()

  // Filter moods based on date range
  const moods = useMemo(() => {
    return filterMoodsByDateRange(allMoods, dateRange)
  }, [allMoods, dateRange])

  return {
    moods,
    allMoods,
    loading,
    error,
    saveMood,
    updateMood,
    deleteMood,
    mutate
  }
}