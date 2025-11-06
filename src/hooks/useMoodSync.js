import { useState, useEffect } from 'react'
import { moodService } from '../services/moodService'
import { useSupabaseAuth } from '../contexts/AuthContext'

export function useMoodSync() {
  const { user } = useSupabaseAuth()
  const [moods, setMoods] = useState({})
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (user) {
      loadMoods()
    } else {
      const localMoods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
      setMoods(localMoods)
      setLoading(false)
    }
  }, [user])

  async function loadMoods() {
    setLoading(true)
    const { data, error } = await moodService.getMoods(user.id)
    if (!error && data) {
      const moodsObj = data.reduce((acc, mood) => {
        acc[mood.date] = { rating: mood.rating, note: mood.note, tags: mood.tags }
        return acc
      }, {})
      setMoods(moodsObj)
      localStorage.setItem('space4u_moods', JSON.stringify(moodsObj))
    }
    setLoading(false)
  }

  async function saveMood(date, moodData) {
    const newMoods = { ...moods, [date]: moodData }
    setMoods(newMoods)
    localStorage.setItem('space4u_moods', JSON.stringify(newMoods))

    if (user) {
      setSyncing(true)
      await moodService.createMood(user.id, { date, ...moodData })
      setSyncing(false)
    }
  }

  return { moods, loading, syncing, saveMood, refreshMoods: loadMoods }
}

