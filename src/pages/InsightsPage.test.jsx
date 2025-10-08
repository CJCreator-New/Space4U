import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import InsightsPage from './InsightsPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('InsightsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders page with header', () => {
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    expect(screen.getByText('Your Insights')).toBeInTheDocument()
    expect(screen.getByText(/ai-powered patterns/i)).toBeInTheDocument()
  })

  it('shows period selector buttons', () => {
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('This Month')).toBeInTheDocument()
    expect(screen.getByText('All Time')).toBeInTheDocument()
  })

  it('shows insufficient data message when no moods', () => {
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    expect(screen.getByText(/keep logging to unlock insights/i)).toBeInTheDocument()
  })

  it('displays progress bar for data collection', () => {
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    expect(screen.getByText(/days needed/i)).toBeInTheDocument()
  })

  it('switches period when button clicked', () => {
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    fireEvent.click(screen.getByText('This Month'))
    expect(screen.getByText('This Month')).toHaveClass('bg-primary')
  })

  it('shows analysis when sufficient data', () => {
    const moods = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      moods[d.toISOString().split('T')[0]] = { mood: 4, emoji: '🙂', timestamp: d.toISOString() }
    }
    localStorage.setItem('safespace_moods', JSON.stringify(moods))
    
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    expect(screen.getByText(/at a glance/i)).toBeInTheDocument()
  })

  it('displays average mood', () => {
    const moods = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      moods[d.toISOString().split('T')[0]] = { mood: 4, emoji: '🙂', timestamp: d.toISOString() }
    }
    localStorage.setItem('safespace_moods', JSON.stringify(moods))
    
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    expect(screen.getByText('Average Mood')).toBeInTheDocument()
  })

  it('shows mood distribution', () => {
    const moods = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      moods[d.toISOString().split('T')[0]] = { mood: 4, emoji: '🙂', timestamp: d.toISOString() }
    }
    localStorage.setItem('safespace_moods', JSON.stringify(moods))
    
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    expect(screen.getByText('Mood Distribution')).toBeInTheDocument()
  })

  it('displays streak information', () => {
    const moods = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      moods[d.toISOString().split('T')[0]] = { mood: 4, emoji: '🙂', timestamp: d.toISOString() }
    }
    localStorage.setItem('safespace_moods', JSON.stringify(moods))
    
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    expect(screen.getByText(/day streak/i)).toBeInTheDocument()
  })

  it('shows privacy note', () => {
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    expect(screen.getByText(/your data is private/i)).toBeInTheDocument()
  })

  it('navigates to resources when clicked', () => {
    const moods = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      moods[d.toISOString().split('T')[0]] = { mood: 4, emoji: '🙂', timestamp: d.toISOString() }
    }
    localStorage.setItem('safespace_moods', JSON.stringify(moods))
    
    render(<MemoryRouter><InsightsPage /></MemoryRouter>)
    const resourceButtons = screen.getAllByText(/browse library|get help/i)
    fireEvent.click(resourceButtons[0])
    expect(mockNavigate).toHaveBeenCalledWith('/resources')
  })
})
