import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MoodTracker from './MoodTracker'

// Mock dependencies
vi.mock('../utils/badgeSystem', () => ({
  addPoints: vi.fn(),
  POINT_VALUES: { moodLog: 1 },
  checkMoodLogBadges: vi.fn()
}))

vi.mock('../utils/offlineQueue', () => ({
  queueMoodLog: vi.fn()
}))

vi.mock('../hooks/useMoods', () => ({
  useMoods: () => ({
    moods: {},
    saveMood: vi.fn()
  })
}))

vi.mock('./mood/TagSelector', () => ({
  default: () => <div data-testid="tag-selector">Tags</div>
}))

describe('MoodTracker', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<MoodTracker />)
      expect(screen.getByText(/How are you feeling right now?/i)).toBeInTheDocument()
    })

    it('should display greeting based on time of day', () => {
      render(<MoodTracker />)
      const greeting = screen.getByText(/Good (morning|afternoon|evening)!/i)
      expect(greeting).toBeInTheDocument()
    })

    it('should display all 5 mood buttons', () => {
      render(<MoodTracker />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(5)
    })

    it('should display current date', () => {
      render(<MoodTracker />)
      // Date format: "Monday, January 7, 2025"
      const dateRegex = /\w+,\s+\w+\s+\d+,\s+\d{4}/
      expect(screen.getByText(dateRegex)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(<MoodTracker />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(5)
    })

    it('should have accessible text content', () => {
      render(<MoodTracker />)
      expect(screen.getByText(/How are you feeling right now?/i)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing onMoodLogged callback', () => {
      expect(() => render(<MoodTracker />)).not.toThrow()
    })

    it('should render with no props', () => {
      const { container } = render(<MoodTracker />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Mental Health Context', () => {
    it('should use empathetic language', () => {
      render(<MoodTracker />)
      expect(screen.getByText(/How are you feeling right now?/i)).toBeInTheDocument()
    })

    it('should display welcoming greeting', () => {
      render(<MoodTracker />)
      const greeting = screen.getByText(/Good (morning|afternoon|evening)!/i)
      expect(greeting).toBeInTheDocument()
    })
  })
})
