import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MoodCalendar from './MoodCalendar'

// Mock useMoods hook
vi.mock('../hooks/useMoods', () => ({
  useMoods: vi.fn()
}))

import { useMoods } from '../hooks/useMoods'

describe('MoodCalendar', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      useMoods.mockReturnValue({ moods: {}, loading: false })
      render(<MoodCalendar />)
      expect(screen.getByText(/Your Mood This Week/i)).toBeInTheDocument()
    })

    it('should show loading state', () => {
      useMoods.mockReturnValue({ moods: {}, loading: true })
      render(<MoodCalendar />)
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('should show empty state when no moods', () => {
      useMoods.mockReturnValue({ moods: {}, loading: false })
      render(<MoodCalendar />)
      expect(screen.getByText(/Your Mood History/i)).toBeInTheDocument()
      expect(screen.getByText(/Start tracking your mood/i)).toBeInTheDocument()
    })

    it('should render week view by default', () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      expect(screen.getByText('Week')).toHaveClass('bg-primary')
    })

    it('should display all 7 days in week view', () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
      dayLabels.forEach(label => {
        expect(screen.getAllByText(label).length).toBeGreaterThan(0)
      })
    })
  })

  describe('View Switching', () => {
    it('should switch to month view', async () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      const monthButton = screen.getByText('Month')
      await user.click(monthButton)
      
      expect(monthButton).toHaveClass('bg-primary')
      expect(screen.getByText(/Your Mood This Month/i)).toBeInTheDocument()
    })

    it('should switch back to week view', async () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      await user.click(screen.getByText('Month'))
      await user.click(screen.getByText('Week'))
      
      expect(screen.getByText('Week')).toHaveClass('bg-primary')
    })
  })

  describe('Navigation', () => {
    it('should navigate to previous week', async () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      const prevButton = screen.getAllByRole('button')[2] // ChevronLeft
      await user.click(prevButton)
      
      // Date range should change
      expect(screen.getByText(/Dec|Jan/i)).toBeInTheDocument()
    })

    it('should navigate to next week', async () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      const nextButton = screen.getAllByRole('button')[3] // ChevronRight
      await user.click(nextButton)
      
      expect(screen.getByText(/Jan/i)).toBeInTheDocument()
    })

    it('should navigate months in month view', async () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      await user.click(screen.getByText('Month'))
      const prevButton = screen.getAllByRole('button')[2]
      await user.click(prevButton)
      
      expect(screen.getByText(/December|January/i)).toBeInTheDocument()
    })
  })

  describe('Mood Display', () => {
    it('should display mood emoji for logged days', () => {
      useMoods.mockReturnValue({ 
        moods: { 
          '2025-01-07': { mood: 4, emoji: '🙂', label: 'Good' }
        }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      expect(screen.getByText('🙂')).toBeInTheDocument()
    })

    it('should show empty cells for days without moods', () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      const buttons = screen.getAllByRole('button')
      const emptyButtons = buttons.filter(btn => 
        btn.className.includes('border-dashed')
      )
      expect(emptyButtons.length).toBeGreaterThan(0)
    })

    it('should highlight today with ring', () => {
      const today = new Date().toISOString().split('T')[0]
      useMoods.mockReturnValue({ 
        moods: { [today]: { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      const todayButton = screen.getAllByRole('button').find(btn =>
        btn.className.includes('ring-primary')
      )
      expect(todayButton).toBeInTheDocument()
    })
  })

  describe('Modal Interaction', () => {
    it('should open modal when clicking mood day', async () => {
      useMoods.mockReturnValue({ 
        moods: { 
          '2025-01-07': { 
            mood: 4, 
            emoji: '🙂', 
            label: 'Good',
            note: 'Great day!',
            timestamp: '2025-01-07T12:00:00'
          }
        }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      const moodButton = screen.getByText('🙂')
      await user.click(moodButton)
      
      await waitFor(() => {
        expect(screen.getByText(/You felt Good/i)).toBeInTheDocument()
      })
    })

    it('should display mood details in modal', async () => {
      useMoods.mockReturnValue({ 
        moods: { 
          '2025-01-07': { 
            mood: 4, 
            emoji: '🙂', 
            label: 'Good',
            note: 'Great day!',
            timestamp: '2025-01-07T12:00:00'
          }
        }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      await user.click(screen.getByText('🙂'))
      
      await waitFor(() => {
        expect(screen.getByText('Great day!')).toBeInTheDocument()
      })
    })

    it('should close modal when clicking X', async () => {
      useMoods.mockReturnValue({ 
        moods: { 
          '2025-01-07': { 
            mood: 4, 
            emoji: '🙂', 
            label: 'Good',
            timestamp: '2025-01-07T12:00:00'
          }
        }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      await user.click(screen.getByText('🙂'))
      
      await waitFor(() => {
        expect(screen.getByText(/You felt Good/i)).toBeInTheDocument()
      })
      
      const closeButtons = screen.getAllByRole('button')
      const xButton = closeButtons.find(btn => btn.querySelector('svg'))
      if (xButton) await user.click(xButton)
      
      await waitFor(() => {
        expect(screen.queryByText(/You felt Good/i)).not.toBeInTheDocument()
      })
    })

    it('should not open modal for empty days', async () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      const emptyButtons = screen.getAllByRole('button').filter(btn =>
        btn.className.includes('border-dashed')
      )
      
      if (emptyButtons.length > 0) {
        await user.click(emptyButtons[0])
        expect(screen.queryByText(/You felt/i)).not.toBeInTheDocument()
      }
    })
  })

  describe('Delete Functionality', () => {
    it('should delete mood from localStorage', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      useMoods.mockReturnValue({ 
        moods: { 
          '2025-01-07': { 
            mood: 4, 
            emoji: '🙂', 
            label: 'Good',
            timestamp: '2025-01-07T12:00:00'
          }
        }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      await user.click(screen.getByText('🙂'))
      
      await waitFor(() => {
        expect(screen.getByText(/You felt Good/i)).toBeInTheDocument()
      })
      
      const deleteButton = screen.getByText('Delete')
      await user.click(deleteButton)
      
      expect(setItemSpy).toHaveBeenCalledWith(
        'safespace_moods',
        expect.any(String)
      )
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should disable buttons for empty days', () => {
      useMoods.mockReturnValue({ 
        moods: { '2025-01-07': { mood: 4, emoji: '🙂' } }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      const disabledButtons = screen.getAllByRole('button').filter(btn =>
        btn.disabled
      )
      expect(disabledButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty moods object', () => {
      useMoods.mockReturnValue({ moods: {}, loading: false })
      expect(() => render(<MoodCalendar />)).not.toThrow()
    })

    it('should handle null moods', () => {
      useMoods.mockReturnValue({ moods: null, loading: false })
      expect(() => render(<MoodCalendar />)).not.toThrow()
    })

    it('should handle multiple moods in same week', () => {
      useMoods.mockReturnValue({ 
        moods: { 
          '2025-01-06': { mood: 3, emoji: '😐' },
          '2025-01-07': { mood: 4, emoji: '🙂' },
          '2025-01-08': { mood: 5, emoji: '😊' }
        }, 
        loading: false 
      })
      render(<MoodCalendar />)
      
      expect(screen.getByText('😐')).toBeInTheDocument()
      expect(screen.getByText('🙂')).toBeInTheDocument()
      expect(screen.getByText('😊')).toBeInTheDocument()
    })
  })

  describe('Mental Health Context', () => {
    it('should use empathetic language in empty state', () => {
      useMoods.mockReturnValue({ moods: {}, loading: false })
      render(<MoodCalendar />)
      
      expect(screen.getByText(/Start tracking your mood/i)).toBeInTheDocument()
    })

    it('should provide clear call to action', () => {
      useMoods.mockReturnValue({ moods: {}, loading: false })
      render(<MoodCalendar />)
      
      expect(screen.getByText(/Log your first mood/i)).toBeInTheDocument()
    })
  })
})
