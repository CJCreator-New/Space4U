import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { storage } from '../services/storage'
import { FEATURES } from '../config/features'

export function useMoods() {
  const [moods, setMoods] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMoods()
  }, [])

  const loadMoods = async () => {
    try {
      // Use storage adapter (defaults to localStorage)
      const moodsData = await storage.get('space4u_moods')
      setMoods(moodsData || {})
      
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
            setMoods(moodsObj)
            // Sync to local storage
            await storage.set('space4u_moods', moodsObj)
          }
        }
      }
    } catch (error) {
      console.error('Error loading moods:', error)
      setMoods({})
    } finally {
      setLoading(false)
    }
  }

  const saveMood = async (date, moodData) => {
    try {
      const updatedMoods = { ...moods, [date]: moodData }
      
      // Save to storage adapter (localStorage by default)
      await storage.set('space4u_moods', updatedMoods)
      setMoods(updatedMoods)
      
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
  }

  return { moods, loading, saveMood, refreshMoods: loadMoods }
}

