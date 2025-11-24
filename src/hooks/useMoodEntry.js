import { useReducer, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { addPoints, POINT_VALUES, checkMoodLogBadges } from '../utils/badgeSystem'
import { queueMoodLog } from '../utils/offlineQueue'
import { useMoods } from './useMoods'
import { getLocalDate } from '../utils/dateHelpers'
import { announce } from '../components/common/LiveRegion'

export const MOODS = [
    { emoji: '😊', label: 'Amazing', value: 5, color: 'text-emerald-500' },
    { emoji: '🙂', label: 'Good', value: 4, color: 'text-lime-500' },
    { emoji: '😐', label: 'Okay', value: 3, color: 'text-amber-500' },
    { emoji: '😢', label: 'Low', value: 2, color: 'text-orange-500' },
    { emoji: '😰', label: 'Struggling', value: 1, color: 'text-red-500' },
]

const initialMoodState = {
    selectedMood: null,
    showNote: false,
    isLogged: false,
    showSuccess: false,
    todaysMood: null,
    streak: 0,
    storageError: false,
    unlockedBadges: []
}

const moodReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SELECTED_MOOD':
            return { ...state, selectedMood: action.payload, showNote: true }
        case 'SET_SHOW_SUCCESS':
            return { ...state, showSuccess: action.payload }
        case 'SET_TODAYS_MOOD':
            return { ...state, todaysMood: action.payload, isLogged: true }
        case 'SET_STREAK':
            return { ...state, streak: action.payload }
        case 'SET_STORAGE_ERROR':
            return { ...state, storageError: action.payload }
        case 'SET_UNLOCKED_BADGES':
            return { ...state, unlockedBadges: action.payload }
        case 'RESET_MOOD_STATE':
            return { ...initialMoodState }
        default:
            return state
    }
}

export function useMoodEntry(onMoodLogged) {
    const [moodState, dispatch] = useReducer(moodReducer, initialMoodState)

    const form = useForm({
        mode: 'onBlur',
        defaultValues: {
            mood: 3,
            note: '',
            tags: []
        }
    })

    const { moods: moodsData, saveMood } = useMoods()
    const today = getLocalDate()

    const getMoodEmoji = useCallback((value) => {
        const mood = MOODS.find(m => m.value === value)
        return mood?.emoji || '😐'
    }, [])

    const getMoodLabel = useCallback((value) => {
        const mood = MOODS.find(m => m.value === value)
        return mood?.label || 'Okay'
    }, [])

    const calculateStreak = useCallback((moods) => {
        let streakCount = 0
        const currentDate = new Date()

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(currentDate)
            checkDate.setDate(currentDate.getDate() - i)
            const dateKey = checkDate.toISOString().split('T')[0]

            if (moods[dateKey]) {
                streakCount++
            } else {
                break
            }
        }

        dispatch({ type: 'SET_STREAK', payload: streakCount })
    }, [])

    useEffect(() => {
        const todayMood = moodsData[today]
        if (todayMood) {
            dispatch({ type: 'SET_TODAYS_MOOD', payload: todayMood })
        }
        calculateStreak(moodsData)
    }, [today, moodsData, calculateStreak])

    const handleMoodSelect = useCallback((mood) => {
        dispatch({ type: 'SET_SELECTED_MOOD', payload: mood })
        announce(`Selected ${mood.label} mood`)
    }, [])

    const handleLogMood = useCallback(async (data) => {
        const moodData = {
            mood: data.mood,
            emoji: getMoodEmoji(data.mood),
            label: getMoodLabel(data.mood),
            note: data.note.trim(),
            tags: data.tags || [],
            timestamp: new Date().toISOString()
        }

        await saveMood(today, moodData)
        queueMoodLog({ ...moodData, date: today })

        dispatch({ type: 'SET_SHOW_SUCCESS', payload: true })
        calculateStreak({ ...moodsData, [today]: moodData })
        announce('Mood logged successfully!')

        setTimeout(() => {
            addPoints(POINT_VALUES.moodLog, 'Mood logged')
            const badgeResults = checkMoodLogBadges()
            const newlyUnlocked = badgeResults.filter(r => r.unlocked)

            if (newlyUnlocked.length > 0) {
                dispatch({ type: 'SET_UNLOCKED_BADGES', payload: newlyUnlocked })
            }
        }, 0)

        setTimeout(() => {
            dispatch({ type: 'SET_SHOW_SUCCESS', payload: false })
            dispatch({ type: 'SET_TODAYS_MOOD', payload: moodData })
            dispatch({ type: 'RESET_MOOD_STATE' })
            form.reset()
            onMoodLogged?.()
        }, 2000)
    }, [getMoodEmoji, getMoodLabel, saveMood, today, moodsData, form, onMoodLogged, calculateStreak])

    const handleUpdate = useCallback(() => {
        dispatch({ type: 'SET_TODAYS_MOOD', payload: null })
    }, [])

    return {
        moodState,
        form,
        handleMoodSelect,
        handleLogMood,
        handleUpdate,
        MOODS
    }
}
