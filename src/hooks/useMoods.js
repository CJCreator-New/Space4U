import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import { storage } from '../services/storage'
import { FEATURES } from '../config/features'
import { filterMoodsByDateRange, DEFAULT_DATE_RANGE } from '../utils/dateRangeUtils'

export function useMoods(dateRange = DEFAULT_DATE_RANGE) {
  const [allMoods, setAllMoods] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMoods()
  }, [])

  // Filter moods based on date range
  const moods = useMemo(() => {
    return filterMoodsByDateRange(allMoods, dateRange)
  }, [allMoods, dateRange])

  const loadMoods = useCallback(async () => {
    try {
      // Use storage adapter (defaults to localStorage)
      const moodsData = await storage.get('space4u_moods')
      setAllMoods(moodsData || {})

      // If backend enabled and user authenticated, sync from Supabase
      if (FEATURES.USE_BACKEND) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data, error } = await supabase
            .from('moods')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })

          if (!error && data) {
            const moodsObj = data.reduce((acc, mood) => {
              acc[mood.date] = mood
              return acc
            }, {})
            setAllMoods(moodsObj)
            // Sync to local storage
            await storage.set('space4u_moods', moodsObj)
          }
        }
      }
    } catch (error) {
      console.error('Error loading moods:', error)
      setAllMoods({})
    } finally {
      setLoading(false)
    }
  }, [])

  const saveMood = useCallback(async (date, moodData) => {
    try {
      const updatedMoods = { ...allMoods, [date]: moodData }

      // Save to storage adapter (localStorage by default)
      await storage.set('space4u_moods', updatedMoods)
      setAllMoods(updatedMoods)

      // If backend enabled, also save to Supabase
      if (FEATURES.USE_BACKEND) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase
            .from('moods')
            .upsert([{
              user_id: user.id,
              date,
              ...moodData
            }])
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error saving mood:', error)
      return { success: false, error }
    }
  }, [allMoods])

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    moods,
    allMoods,
    loading,
    saveMood,
    refreshMoods: loadMoods
  }), [moods, loading, saveMood, loadMoods])
}

