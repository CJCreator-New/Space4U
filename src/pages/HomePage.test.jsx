import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'

vi.mock('../components/MoodTracker', () => ({
  default: () => <div data-testid="mood-tracker">MoodTracker</div>
}))

vi.mock('../components/MoodCalendar', () => ({
  default: () => <div data-testid="mood-calendar">MoodCalendar</div>
}))

vi.mock('../components/MoodTrends', () => ({
  default: () => <div data-testid="mood-trends">MoodTrends</div>
}))

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  const renderPage = () => {
    return render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
  }

  it('should render welcome message', () => {
    renderPage()
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
  })

  it('should display username when available', () => {
    localStorage.setItem('safespace_user', JSON.stringify({ username: 'TestUser', avatar: '🐻' }))
    renderPage()
    expect(screen.getByText(/Welcome back, TestUser/i)).toBeInTheDocument()
  })

  it('should render MoodTracker component', () => {
    renderPage()
    expect(screen.getByTestId('mood-tracker')).toBeInTheDocument()
  })

  it('should render MoodCalendar component', () => {
    renderPage()
    expect(screen.getByTestId('mood-calendar')).toBeInTheDocument()
  })

  it('should render MoodTrends component', () => {
    renderPage()
    expect(screen.getByTestId('mood-trends')).toBeInTheDocument()
  })

  it('should display wellness tools section', () => {
    renderPage()
    expect(screen.getByText('Wellness Tools')).toBeInTheDocument()
  })

  it('should render all 15 wellness tool cards', () => {
    renderPage()
    expect(screen.getByText('Gratitude')).toBeInTheDocument()
    expect(screen.getByText('Habits')).toBeInTheDocument()
    expect(screen.getByText('Emotions')).toBeInTheDocument()
    expect(screen.getByText('Coping Skills')).toBeInTheDocument()
    expect(screen.getByText('Reminders')).toBeInTheDocument()
    expect(screen.getByText('Therapy Tools')).toBeInTheDocument()
    expect(screen.getByText('Wellness Score')).toBeInTheDocument()
    expect(screen.getByText('Advanced Tools')).toBeInTheDocument()
    expect(screen.getByText('Gamification')).toBeInTheDocument()
    expect(screen.getByText('Wellness Plan')).toBeInTheDocument()
    expect(screen.getByText('Social Hub')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Professional')).toBeInTheDocument()
    expect(screen.getByText('Technical')).toBeInTheDocument()
    expect(screen.getByText('Premium Features')).toBeInTheDocument()
  })

  it('should handle error state', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error')
    })
    renderPage()
    expect(screen.getByText(/Failed to load user data/i)).toBeInTheDocument()
  })

  it('should display user avatar when available', () => {
    localStorage.setItem('safespace_user', JSON.stringify({ username: 'TestUser', avatar: '🐻' }))
    renderPage()
    expect(screen.getByText('🐻')).toBeInTheDocument()
  })
})
