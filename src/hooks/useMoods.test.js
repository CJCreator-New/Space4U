import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMoods } from './useMoods'

vi.mock('../utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null } }))
    }
  }
}))

describe('useMoods', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with empty moods', async () => {
    const { result } = renderHook(() => useMoods())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    
    expect(result.current.moods).toEqual({})
    expect(result.current.loading).toBe(false)
  })

  it('should load moods from localStorage', async () => {
    const mockMoods = { '2025-01-07': { mood: 4, emoji: '🙂' } }
    localStorage.setItem('safespace_moods', JSON.stringify(mockMoods))
    
    const { result } = renderHook(() => useMoods())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    
    expect(result.current.moods).toEqual(mockMoods)
  })

  it('should save mood to localStorage', async () => {
    const { result } = renderHook(() => useMoods())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    
    await act(async () => {
      await result.current.saveMood('2025-01-07', { mood: 5, emoji: '😊' })
    })
    
    const saved = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
    expect(saved['2025-01-07']).toEqual({ mood: 5, emoji: '😊' })
  })

  it('should update moods state after saving', async () => {
    const { result } = renderHook(() => useMoods())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    
    await act(async () => {
      await result.current.saveMood('2025-01-07', { mood: 5, emoji: '😊' })
    })
    
    expect(result.current.moods['2025-01-07']).toEqual({ mood: 5, emoji: '😊' })
  })

  it('should provide refreshMoods function', async () => {
    const { result } = renderHook(() => useMoods())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    
    expect(typeof result.current.refreshMoods).toBe('function')
  })
})
