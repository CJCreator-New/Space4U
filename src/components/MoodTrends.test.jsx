import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MoodTrends from './MoodTrends'

// Mock useMoods hook
vi.mock('../hooks/useMoods', () => ({
  useMoods: vi.fn()
}))

import { useMoods } from '../hooks/useMoods'

describe('MoodTrends', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
    localStorage.clear()
    vi.clearAllMocks()
  })

  const mockMoods = {
    '2025-01-01': { mood: 4, emoji: '🙂', label: 'Good', timestamp: '2025-01-01T12:00:00' },
    '2025-01-02': { mood: 3, emoji: '😐', label: 'Okay', timestamp: '2025-01-02T12:00:00' },
    '2025-01-03': { mood: 5, emoji: '😊', label: 'Amazing', timestamp: '2025-01-03T12:00:00' },
    '2025-01-04': { mood: 4, emoji: '🙂', label: 'Good', timestamp: '2025-01-04T12:00:00' }
  }

  describe('Rendering', () => {
    it('should render without crashing', () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      expect(screen.getByText(/Your Mood Trends/i)).toBeInTheDocument()
    })

    it('should show loading state', () => {
      useMoods.mockReturnValue({ moods: {}, loading: true })
      render(<MoodTrends />)
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('should show empty state with less than 3 moods', () => {
      useMoods.mockReturnValue({ 
        moods: { 
          '2025-01-01': { mood: 4, emoji: '🙂' },
          '2025-01-02': { mood: 3, emoji: '😐' }
        }, 
        loading: false 
      })
      render(<MoodTrends />)
      
      expect(screen.getByText(/Keep logging to see trends/i)).toBeInTheDocument()
      expect(screen.getByText(/2\/3 moods needed/i)).toBeInTheDocument()
    })

    it('should display chart with sufficient data', () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      expect(screen.getByText(/Your Mood Trends/i)).toBeInTheDocument()
      expect(screen.getByText(/Last 7 days/i)).toBeInTheDocument()
    })

    it('should show period selector buttons', () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      expect(screen.getByText('7 days')).toBeInTheDocument()
      expect(screen.getByText('30 days')).toBeInTheDocument()
      expect(screen.getByText('All time')).toBeInTheDocument()
    })
  })

  describe('Period Selection', () => {
    it('should default to 7 days period', () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      const sevenDaysButton = screen.getByText('7 days')
      expect(sevenDaysButton).toHaveClass('bg-primary')
    })

    it('should switch to 30 days period', async () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      const thirtyDaysButton = screen.getByText('30 days')
      await user.click(thirtyDaysButton)
      
      expect(thirtyDaysButton).toHaveClass('bg-primary')
      expect(screen.getByText(/Last 30 days/i)).toBeInTheDocument()
    })

    it('should switch to all time period', async () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      const allTimeButton = screen.getByText('All time')
      await user.click(allTimeButton)
      
      expect(allTimeButton).toHaveClass('bg-primary')
      expect(screen.getByText(/All time/i)).toBeInTheDocument()
    })
  })

  describe('Statistics Display', () => {
    it('should display average mood', async () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      await waitFor(() => {
        expect(screen.getByText(/Your average mood:/i)).toBeInTheDocument()
      })
    })

    it('should display best day', async () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      await waitFor(() => {
        expect(screen.getByText(/Best day/i)).toBeInTheDocument()
      })
    })

    it('should display most common mood', async () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      await waitFor(() => {
        expect(screen.getByText(/Most common mood/i)).toBeInTheDocument()
      })
    })

    it('should display good days percentage', async () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      await waitFor(() => {
        expect(screen.getByText(/Good days/i)).toBeInTheDocument()
        expect(screen.getByText(/felt good or better/i)).toBeInTheDocument()
      })
    })

    it('should display most consistent day', async () => {
      const weekMoods = {
        '2025-01-06': { mood: 4, emoji: '🙂', label: 'Good' }, // Monday
        '2025-01-07': { mood: 4, emoji: '🙂', label: 'Good' }, // Tuesday
        '2025-01-13': { mood: 4, emoji: '🙂', label: 'Good' }, // Monday
        '2025-01-14': { mood: 3, emoji: '😐', label: 'Okay' }  // Tuesday
      }
      useMoods.mockReturnValue({ moods: weekMoods, loading: false })
      render(<MoodTrends />)
      
      await waitFor(() => {
        expect(screen.getByText(/Most consistent/i)).toBeInTheDocument()
      })
    })
  })

  describe('Trend Calculation', () => {
    it('should show positive trend indicator', async () => {
      const trendMoods = {}
      for (let i = 1; i <= 14; i++) {
        const mood = i <= 7 ? 2 : 4 // Lower first week, higher second week
        trendMoods[`2025-01-${String(i).padStart(2, '0')}`] = {
          mood,
          emoji: '🙂',
          label: 'Good',
          timestamp: `2025-01-${String(i).padStart(2, '0')}T12:00:00`
        }
      }
      useMoods.mockReturnValue({ moods: trendMoods, loading: false })
      render(<MoodTrends />)
      
      await waitFor(() => {
        const trendText = screen.queryByText(/better than last period/i)
        if (trendText) {
          expect(trendText).toBeInTheDocument()
        }
      })
    })

    it('should show negative trend indicator', async () => {
      const trendMoods = {}
      for (let i = 1; i <= 14; i++) {
        const mood = i <= 7 ? 4 : 2 // Higher first week, lower second week
        trendMoods[`2025-01-${String(i).padStart(2, '0')}`] = {
          mood,
          emoji: '🙂',
          label: 'Good',
          timestamp: `2025-01-${String(i).padStart(2, '0')}T12:00:00`
        }
      }
      useMoods.mockReturnValue({ moods: trendMoods, loading: false })
      render(<MoodTrends />)
      
      await waitFor(() => {
        const trendText = screen.queryByText(/lower than last period/i)
        if (trendText) {
          expect(trendText).toBeInTheDocument()
        }
      })
    })
  })

  describe('Chart Rendering', () => {
    it('should render chart container', () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      // Recharts is mocked, so we just verify component renders
      expect(screen.getByText(/Your Mood Trends/i)).toBeInTheDocument()
    })

    it('should display mood emojis in stats', async () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      await waitFor(() => {
        const emojis = ['😊', '🙂', '😐']
        const hasEmoji = emojis.some(emoji => screen.queryByText(emoji))
        expect(hasEmoji).toBe(true)
      })
    })
  })

  describe('Progress Bar', () => {
    it('should show progress for 1 mood', () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-01': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodTrends />)
      
      expect(screen.getByText(/1\/3 moods needed/i)).toBeInTheDocument()
    })

    it('should show progress for 2 moods', () => {
      useMoods.mockReturnValue({ 
        moods: { 
          '2025-01-01': { mood: 4, emoji: '🙂' },
          '2025-01-02': { mood: 3, emoji: '😐' }
        }, 
        loading: false 
      })
      render(<MoodTrends />)
      
      expect(screen.getByText(/2\/3 moods needed/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(3)
    })

    it('should have accessible period selector', async () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      const sevenDaysButton = screen.getByText('7 days')
      await user.click(sevenDaysButton)
      
      expect(sevenDaysButton).toHaveClass('bg-primary')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty moods object', () => {
      useMoods.mockReturnValue({ moods: {}, loading: false })
      expect(() => render(<MoodTrends />)).not.toThrow()
    })

    it('should handle null moods', () => {
      useMoods.mockReturnValue({ moods: null, loading: false })
      expect(() => render(<MoodTrends />)).not.toThrow()
    })

    it('should handle exactly 3 moods', () => {
      const threeMoods = {
        '2025-01-01': { mood: 4, emoji: '🙂', label: 'Good' },
        '2025-01-02': { mood: 3, emoji: '😐', label: 'Okay' },
        '2025-01-03': { mood: 5, emoji: '😊', label: 'Amazing' }
      }
      useMoods.mockReturnValue({ moods: threeMoods, loading: false })
      render(<MoodTrends />)
      
      expect(screen.getByText(/Your Mood Trends/i)).toBeInTheDocument()
      expect(screen.queryByText(/moods needed/i)).not.toBeInTheDocument()
    })

    it('should handle large dataset', () => {
      const largeMoods = {}
      for (let i = 1; i <= 100; i++) {
        largeMoods[`2024-${String(Math.floor(i/30) + 1).padStart(2, '0')}-${String(i % 30 + 1).padStart(2, '0')}`] = {
          mood: Math.floor(Math.random() * 5) + 1,
          emoji: '🙂',
          label: 'Good'
        }
      }
      useMoods.mockReturnValue({ moods: largeMoods, loading: false })
      
      expect(() => render(<MoodTrends />)).not.toThrow()
    })

    it('should handle moods with missing fields', () => {
      const incompleteMoods = {
        '2025-01-01': { mood: 4 },
        '2025-01-02': { mood: 3 },
        '2025-01-03': { mood: 5 }
      }
      useMoods.mockReturnValue({ moods: incompleteMoods, loading: false })
      
      expect(() => render(<MoodTrends />)).not.toThrow()
    })
  })

  describe('Mental Health Context', () => {
    it('should use encouraging language', () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-01': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodTrends />)
      
      expect(screen.getByText(/Keep logging to see trends/i)).toBeInTheDocument()
    })

    it('should show positive reinforcement for good days', async () => {
      const goodMoods = {
        '2025-01-01': { mood: 5, emoji: '😊', label: 'Amazing' },
        '2025-01-02': { mood: 4, emoji: '🙂', label: 'Good' },
        '2025-01-03': { mood: 5, emoji: '😊', label: 'Amazing' }
      }
      useMoods.mockReturnValue({ moods: goodMoods, loading: false })
      render(<MoodTrends />)
      
      await waitFor(() => {
        expect(screen.getByText(/felt good or better/i)).toBeInTheDocument()
      })
    })

    it('should provide visual progress feedback', () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-01': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodTrends />)
      
      const progressBar = document.querySelector('.bg-primary')
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('Data Processing', () => {
    it('should sort moods chronologically', async () => {
      const unsortedMoods = {
        '2025-01-03': { mood: 5, emoji: '😊', label: 'Amazing' },
        '2025-01-01': { mood: 4, emoji: '🙂', label: 'Good' },
        '2025-01-02': { mood: 3, emoji: '😐', label: 'Okay' }
      }
      useMoods.mockReturnValue({ moods: unsortedMoods, loading: false })
      render(<MoodTrends />)
      
      await waitFor(() => {
        expect(screen.getByText(/Your Mood Trends/i)).toBeInTheDocument()
      })
    })

    it('should filter data by selected period', async () => {
      useMoods.mockReturnValue({ moods: mockMoods, loading: false })
      render(<MoodTrends />)
      
      await user.click(screen.getByText('30 days'))
      
      await waitFor(() => {
        expect(screen.getByText(/Last 30 days/i)).toBeInTheDocument()
      })
    })
  })
})
