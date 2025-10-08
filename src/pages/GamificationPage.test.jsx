import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GamificationPage from './GamificationPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

describe('GamificationPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders page with header', () => {
    render(<GamificationPage />)
    expect(screen.getByText('Gamification Hub')).toBeInTheDocument()
    expect(screen.getByText(/level up your mental wellness/i)).toBeInTheDocument()
  })

  it('displays user level card', () => {
    render(<GamificationPage />)
    expect(screen.getByText(/level 1/i)).toBeInTheDocument()
  })

  it('shows XP progress bar', () => {
    render(<GamificationPage />)
    expect(screen.getByText(/xp/i)).toBeInTheDocument()
  })

  it('displays streak cards', () => {
    render(<GamificationPage />)
    expect(screen.getByText('Mood Streak')).toBeInTheDocument()
    expect(screen.getByText('Gratitude Streak')).toBeInTheDocument()
    expect(screen.getByText('Habit Streak')).toBeInTheDocument()
  })

  it('shows challenges tab by default', () => {
    render(<GamificationPage />)
    expect(screen.getByText('7-Day Mood Tracker')).toBeInTheDocument()
  })

  it('switches to quests tab', () => {
    render(<GamificationPage />)
    fireEvent.click(screen.getByText('Quests'))
    expect(screen.getByText('Getting Started')).toBeInTheDocument()
  })

  it('displays challenge cards', () => {
    render(<GamificationPage />)
    expect(screen.getByText('30-Day Gratitude')).toBeInTheDocument()
    expect(screen.getByText('Mindfulness Week')).toBeInTheDocument()
  })

  it('shows quest XP rewards', () => {
    render(<GamificationPage />)
    fireEvent.click(screen.getByText('Quests'))
    expect(screen.getByText('+100')).toBeInTheDocument()
  })

  it('displays premium quests', () => {
    render(<GamificationPage />)
    fireEvent.click(screen.getByText('Quests'))
    expect(screen.getByText('PREMIUM')).toBeInTheDocument()
  })

  it('calculates mood streak from localStorage', () => {
    const moods = { '2025-01-07': { mood: 5 }, '2025-01-06': { mood: 4 } }
    localStorage.setItem('safespace_moods', JSON.stringify(moods))
    render(<GamificationPage />)
    expect(screen.getByText(/days/i)).toBeInTheDocument()
  })
})
