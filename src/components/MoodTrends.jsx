import { useMemo } from 'react'
import MoodTrendChart from './MoodTrendChart'

export default function MoodTrends() {
    const moods = useMemo(() => {
        try {
            const storedMoods = JSON.parse(localStorage.getItem('space4u_moods') || '{}')
            return Object.entries(storedMoods)
                .map(([date, data]) => ({
                    date,
                    mood: data.mood || data.value || 3,
                    note: data.note,
                    emoji: data.emoji
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date))
        } catch (err) {
            console.error('Error loading mood history:', err)
            return []
        }
    }, [])

    return <MoodTrendChart moods={moods} />
}
