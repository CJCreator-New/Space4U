import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CopingSkillsPage from './CopingSkillsPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

describe('CopingSkillsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should render page title', () => {
    render(<CopingSkillsPage />)
    expect(screen.getByText('Coping Skills Library')).toBeInTheDocument()
  })

  it('should display all coping skills by default', () => {
    render(<CopingSkillsPage />)
    expect(screen.getByText('Deep Breathing')).toBeInTheDocument()
    expect(screen.getByText('5-4-3-2-1 Grounding')).toBeInTheDocument()
  })

  it('should filter skills by search', () => {
    render(<CopingSkillsPage />)
    const searchInput = screen.getByPlaceholderText(/Search coping skills/i)
    fireEvent.change(searchInput, { target: { value: 'breathing' } })
    expect(screen.getByText('Deep Breathing')).toBeInTheDocument()
    expect(screen.queryByText('Call a Friend')).not.toBeInTheDocument()
  })

  it('should filter by category', () => {
    render(<CopingSkillsPage />)
    fireEvent.click(screen.getByText('anxiety'))
    expect(screen.getByText('Deep Breathing')).toBeInTheDocument()
  })

  it('should toggle favorite', () => {
    render(<CopingSkillsPage />)
    const starButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'))
    fireEvent.click(starButtons[0])
    const saved = JSON.parse(localStorage.getItem('safespace_favorite_coping_skills') || '[]')
    expect(saved.length).toBe(1)
  })

  it('should load favorites from localStorage', () => {
    localStorage.setItem('safespace_favorite_coping_skills', JSON.stringify([1]))
    render(<CopingSkillsPage />)
    const starButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'))
    expect(starButtons[0].querySelector('svg')).toHaveClass('fill-yellow-500')
  })

  it('should show empty state when no results', () => {
    render(<CopingSkillsPage />)
    const searchInput = screen.getByPlaceholderText(/Search coping skills/i)
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    expect(screen.getByText('No skills found')).toBeInTheDocument()
  })

  it('should display skill duration', () => {
    render(<CopingSkillsPage />)
    expect(screen.getByText('5 min')).toBeInTheDocument()
  })

  it('should show all filter button', () => {
    render(<CopingSkillsPage />)
    expect(screen.getByText('All')).toBeInTheDocument()
  })
})
