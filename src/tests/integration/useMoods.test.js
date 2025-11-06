import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMoods } from '../../hooks/useMoods'
import { FEATURES } from '../../config/features'

// Mock the entire storage module
vi.mock('../../services/storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn()
  }
}))

// Import after mocking
import { storage } from '../../services/storage'

// Mock supabase
vi.mock('../../utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } })
    }
  }
}))

describe('useMoods Hook Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    // Mock storage to use localStorage behavior for tests
    storage.get.mockImplementation((key) => {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    })
    storage.set.mockImplementation((key, value) => {
      localStorage.setItem(key, JSON.stringify(value))
      return Promise.resolve()
    })
  })

  it('should load moods from localStorage', async () => {
    const testMoods = {
      '2024-01-15': { mood: 5, note: 'Great day!' }
    }
    localStorage.setItem('space4u_moods', JSON.stringify(testMoods))

    const { result } = renderHook(() => useMoods())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.moods).toEqual(testMoods)
  })

  it('should save mood to localStorage', async () => {
    const { result } = renderHook(() => useMoods())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const moodData = { mood: 4, note: 'Good day', emoji: '🙂' }
    await result.current.saveMood('2024-01-15', moodData)

    const saved = JSON.parse(localStorage.getItem('space4u_moods'))
    expect(saved['2024-01-15']).toEqual(moodData)
  })

  it('should handle empty moods gracefully', async () => {
    const { result } = renderHook(() => useMoods())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.moods).toEqual({})
  })

  it('should update moods state after saving', async () => {
    const { result } = renderHook(() => useMoods())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const moodData = { mood: 3, note: 'Okay day' }
    await result.current.saveMood('2024-01-15', moodData)

    await waitFor(() => {
      expect(result.current.moods['2024-01-15']).toEqual(moodData)
    })
  })
})
