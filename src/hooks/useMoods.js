import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export function useMoods() {
  const [moods, setMoods] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMoods()
  }, [])

  const loadMoods = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const localMoods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
      setMoods(localMoods)
      setLoading(false)
      return
    }

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
    }
    setLoading(false)
  }

  const saveMood = async (date, moodData) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      const localMoods = { ...moods, [date]: moodData }
      localStorage.setItem('safespace_moods', JSON.stringify(localMoods))
      setMoods(localMoods)
      return { success: true }
    }

    const { error } = await supabase
      .from('moods')
      .upsert([{
        user_id: user.id,
        date,
        ...moodData
      }])

    if (!error) {
      setMoods({ ...moods, [date]: moodData })
      return { success: true }
    }
    return { success: false, error }
  }

  return { moods, loading, saveMood, refreshMoods: loadMoods }
}
