import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WellnessDashboardPage from './WellnessDashboardPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

describe('WellnessDashboardPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders dashboard with header', () => {
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText('Wellness Dashboard')).toBeInTheDocument()
    expect(screen.getByText(/comprehensive mental health overview/i)).toBeInTheDocument()
  })

  it('displays overall wellness score', () => {
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText(/overall wellness score/i)).toBeInTheDocument()
    expect(screen.getByText(/\/100/)).toBeInTheDocument()
  })

  it('shows 0 score when no data', () => {
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText('0/100')).toBeInTheDocument()
    expect(screen.getByText('Needs Attention')).toBeInTheDocument()
  })

  it('displays all metric categories', () => {
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText('Mood Tracking')).toBeInTheDocument()
    expect(screen.getByText('Habit Completion')).toBeInTheDocument()
    expect(screen.getByText('Gratitude Practice')).toBeInTheDocument()
    expect(screen.getByText('Emotion Awareness')).toBeInTheDocument()
  })

  it('calculates mood score from localStorage', () => {
    const moods = { '2025-01-07': 5, '2025-01-06': 4, '2025-01-05': 5 }
    localStorage.setItem('safespace_moods', JSON.stringify(moods))
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText(/mood tracking/i)).toBeInTheDocument()
  })

  it('calculates habit score from localStorage', () => {
    const habits = [
      { id: 1, name: 'Exercise', completions: { '2025-01-07': true, '2025-01-06': true } }
    ]
    localStorage.setItem('safespace_habits', JSON.stringify(habits))
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText(/habit completion/i)).toBeInTheDocument()
  })

  it('calculates gratitude score from localStorage', () => {
    const gratitude = [
      { date: '2025-01-07', items: ['Test'] },
      { date: '2025-01-06', items: ['Test'] }
    ]
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(gratitude))
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText(/gratitude practice/i)).toBeInTheDocument()
  })

  it('shows fair label for moderate scores', () => {
    const moods = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      moods[d.toISOString().split('T')[0]] = 5
    }
    localStorage.setItem('safespace_moods', JSON.stringify(moods))
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText(/needs attention|fair/i)).toBeInTheDocument()
  })

  it('displays recommendations section', () => {
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText('Recommendations')).toBeInTheDocument()
  })

  it('shows mood tracking recommendation when score low', () => {
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText(/track your mood daily/i)).toBeInTheDocument()
  })

  it('shows habit recommendation when score low', () => {
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText(/stay consistent with habits/i)).toBeInTheDocument()
  })

  it('shows gratitude recommendation when score low', () => {
    render(<MemoryRouter><WellnessDashboardPage /></MemoryRouter>)
    expect(screen.getByText(/practice gratitude/i)).toBeInTheDocument()
  })
})
