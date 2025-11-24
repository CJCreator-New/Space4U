import { useMemo, useState, useCallback } from 'react'
import useSWR from 'swr'
import { storage } from '../services/storage'
import { filterMoodsByDateRange, DEFAULT_DATE_RANGE } from '../utils/dateRangeUtils'

// Constants for pagination
const MOODS_PER_PAGE = 30 // Load 30 days at a time
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Custom fetcher for mood data with pagination support
const moodsFetcher = async () => {
  try {
    const moodsData = await storage.get('space4u_moods')
    return moodsData || {}
  } catch (error) {
    console.error('Error fetching moods:', error)
    return {}
  }
}

// Fetcher for paginated mood data
const paginatedMoodsFetcher = async ({ startDate, endDate }) => {
  try {
    const allMoods = await storage.get('space4u_moods') || {}

    // Filter moods within date range
    const filteredMoods = {}
    const start = new Date(startDate)
    const end = new Date(endDate)

    Object.keys(allMoods).forEach(dateKey => {
      const moodDate = new Date(dateKey)
      if (moodDate >= start && moodDate <= end) {
        filteredMoods[dateKey] = allMoods[dateKey]
      }
    })

    return filteredMoods
  } catch (error) {
    console.error('Error fetching paginated moods:', error)
    return {}
  }
}

// Hook for fetching ALL mood data with SWR (original behavior, for backwards compatibility)
export function useMoodsSWR() {
  const { data: allMoods = {}, error, isLoading, mutate } = useSWR(
    'space4u_moods',
    moodsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      refreshInterval: 0,
    }
  )

  // Function to save mood data
  const saveMood = async (moodData) => {
    try {
      const currentMoods = await storage.get('space4u_moods') || {}
      const updatedMoods = { ...currentMoods, ...moodData }
      await storage.set('space4u_moods', updatedMoods)

      // Update SWR cache
      mutate(updatedMoods, false)

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

// NEW: Optimized hook with pagination for large datasets
export function useMoodsPaginated(options = {}) {
  const {
    pageSize = MOODS_PER_PAGE,
    initialPage = 0,
    dateRange = null // If null, uses pagination; if set, uses date range
  } = options

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalCount, setTotalCount] = useState(0)

  // Calculate date range for current page
  const { startDate, endDate } = useMemo(() => {
    if (dateRange) {
      return dateRange
    }

    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - ((currentPage + 1) * pageSize))
    end.setDate(end.getDate() - (currentPage * pageSize))

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    }
  }, [currentPage, pageSize, dateRange])

  // Fetch paginated data
  const { data: paginatedMoods = {}, error, isLoading, mutate } = useSWR(
    ['space4u_moods_page', startDate, endDate],
    () => paginatedMoodsFetcher({ startDate, endDate }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      refreshInterval: 0,
    }
  )

  // Calculate total count (this is an optimization - we only count, not load all)
  const fetchTotalCount = useCallback(async () => {
    try {
      const allMoods = await storage.get('space4u_moods') || {}
      setTotalCount(Object.keys(allMoods).length)
    } catch (error) {
      console.error('Error fetching total count:', error)
    }
  }, [])

  // Fetch total count on mount
  useMemo(() => {
    fetchTotalCount()
  }, [fetchTotalCount])

  // Pagination helpers
  const hasNextPage = (currentPage + 1) * pageSize < totalCount
  const hasPreviousPage = currentPage > 0
  const totalPages = Math.ceil(totalCount / pageSize)

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasNextPage])

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1)
    }
  }, [hasPreviousPage])

  const goToPage = useCallback((page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  // Mutation functions (optimistic updates)
  const saveMood = useCallback(async (moodData) => {
    try {
      const currentMoods = await storage.get('space4u_moods') || {}
      const updatedMoods = { ...currentMoods, ...moodData }
      await storage.set('space4u_moods', updatedMoods)

      // Update cache and refetch count
      mutate()
      fetchTotalCount()

      return { success: true }
    } catch (error) {
      console.error('Error saving mood:', error)
      return { success: false, error }
    }
  }, [mutate, fetchTotalCount])

  const updateMood = useCallback(async (date, moodData) => {
    try {
      const currentMoods = await storage.get('space4u_moods') || {}
      const updatedMoods = {
        ...currentMoods,
        [date]: { ...currentMoods[date], ...moodData }
      }
      await storage.set('space4u_moods', updatedMoods)

      // Update cache
      mutate()

      return { success: true }
    } catch (error) {
      console.error('Error updating mood:', error)
      return { success: false, error }
    }
  }, [mutate])

  const deleteMood = useCallback(async (date) => {
    try {
      const currentMoods = await storage.get('space4u_moods') || {}
      const updatedMoods = { ...currentMoods }
      delete updatedMoods[date]
      await storage.set('space4u_moods', updatedMoods)

      // Update cache and refetch count
      mutate()
      fetchTotalCount()

      return { success: true }
    } catch (error) {
      console.error('Error deleting mood:', error)
      return { success: false, error }
    }
  }, [mutate, fetchTotalCount])

  return {
    moods: paginatedMoods,
    loading: isLoading,
    error,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    saveMood,
    updateMood,
    deleteMood,
    mutate
  }
}

// Helper to get mood statistics without loading all data
export async function getMoodStats() {
  try {
    const allMoods = await storage.get('space4u_moods') || {}
    const moodEntries = Object.entries(allMoods)

    // Calculate stats without loading everything into memory at once
    const stats = {
      totalEntries: moodEntries.length,
      dateRange: {
        earliest: null,
        latest: null
      },
      averageMood: 0,
      moodDistribution: {}
    }

    if (moodEntries.length === 0) return stats

    let moodSum = 0
    const dates = []

    moodEntries.forEach(([date, mood]) => {
      dates.push(new Date(date))
      if (mood.mood) {
        moodSum += mood.mood
        stats.moodDistribution[mood.mood] = (stats.moodDistribution[mood.mood] || 0) + 1
      }
    })

    dates.sort((a, b) => a - b)
    stats.dateRange.earliest = dates[0]?.toISOString().split('T')[0]
    stats.dateRange.latest = dates[dates.length - 1]?.toISOString().split('T')[0]
    stats.averageMood = moodSum / moodEntries.length

    return stats
  } catch (error) {
    console.error('Error calculating mood stats:', error)
    return null
  }
}