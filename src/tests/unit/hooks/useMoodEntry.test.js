import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMoodEntry } from '../../../hooks/useMoodEntry'
import * as useMoodsHook from '../../../hooks/useMoods'
import * as badgeSystem from '../../../utils/badgeSystem'
import * as offlineQueue from '../../../utils/offlineQueue'

// Mock dependencies
vi.mock('../../../hooks/useMoods')
vi.mock('../../../utils/badgeSystem')
vi.mock('../../../utils/offlineQueue')
vi.mock('../../../components/common/LiveRegion', () => ({
    announce: vi.fn()
}))

describe('useMoodEntry Hook', () => {
    const mockSaveMood = vi.fn()
    const mockMoods = {}

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(useMoodsHook, 'useMoods').mockReturnValue({
            moods: mockMoods,
            saveMood: mockSaveMood
        })
        vi.spyOn(badgeSystem, 'checkMoodLogBadges').mockReturnValue([])
    })

    it('should initialize with default state', () => {
        const { result } = renderHook(() => useMoodEntry())

        expect(result.current.moodState.selectedMood).toBeNull()
        expect(result.current.moodState.showNote).toBe(false)
        expect(result.current.moodState.isLogged).toBe(false)
    })

    it('should update selected mood', () => {
        const { result } = renderHook(() => useMoodEntry())
        const mood = result.current.MOODS[0] // Amazing

        act(() => {
            result.current.handleMoodSelect(mood)
        })

        expect(result.current.moodState.selectedMood).toEqual(mood)
        expect(result.current.moodState.showNote).toBe(true)
    })

    it('should log mood successfully', async () => {
        const { result } = renderHook(() => useMoodEntry())
        const mood = result.current.MOODS[2] // Okay
        const onMoodLogged = vi.fn()

        // Setup form values
        act(() => {
            result.current.form.setValue('mood', 3)
            result.current.form.setValue('note', 'Test note')
        })

        await act(async () => {
            await result.current.handleLogMood({
                mood: 3,
                note: 'Test note',
                tags: []
            })
        })

        expect(mockSaveMood).toHaveBeenCalled()
        expect(offlineQueue.queueMoodLog).toHaveBeenCalled()
        expect(result.current.moodState.showSuccess).toBe(true)
    })
})
