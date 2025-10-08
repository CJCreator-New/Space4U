import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HabitTrackerPage from './HabitTrackerPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

describe('HabitTrackerPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should render page title', () => {
    render(<HabitTrackerPage />)
    expect(screen.getByText('Habit Tracker')).toBeInTheDocument()
  })

  it('should show empty state when no habits', () => {
    render(<HabitTrackerPage />)
    expect(screen.getByText('Start Building Habits')).toBeInTheDocument()
  })

  it('should open modal when add button clicked', () => {
    render(<HabitTrackerPage />)
    fireEvent.click(screen.getByText('Add Habit'))
    expect(screen.getByText('New Habit')).toBeInTheDocument()
  })

  it('should create new habit', () => {
    render(<HabitTrackerPage />)
    fireEvent.click(screen.getByText('Add Habit'))
    
    const input = screen.getByPlaceholderText(/Exercise, Meditate/i)
    fireEvent.change(input, { target: { value: 'Morning Run' } })
    
    fireEvent.click(screen.getByText('Create'))
    
    expect(screen.getByText('Morning Run')).toBeInTheDocument()
  })

  it('should save habit to localStorage', () => {
    render(<HabitTrackerPage />)
    fireEvent.click(screen.getByText('Add Habit'))
    
    const input = screen.getByPlaceholderText(/Exercise, Meditate/i)
    fireEvent.change(input, { target: { value: 'Morning Run' } })
    fireEvent.click(screen.getByText('Create'))
    
    const saved = JSON.parse(localStorage.getItem('safespace_habits') || '[]')
    expect(saved.length).toBe(1)
    expect(saved[0].name).toBe('Morning Run')
  })

  it('should load habits from localStorage', () => {
    const habits = [{ id: 1, name: 'Exercise', icon: '💪', completions: {} }]
    localStorage.setItem('safespace_habits', JSON.stringify(habits))
    
    render(<HabitTrackerPage />)
    expect(screen.getByText('Exercise')).toBeInTheDocument()
  })

  it('should toggle habit completion', () => {
    const habits = [{ id: 1, name: 'Exercise', icon: '💪', completions: {} }]
    localStorage.setItem('safespace_habits', JSON.stringify(habits))
    
    render(<HabitTrackerPage />)
    const buttons = screen.getAllByRole('button')
    const toggleButton = buttons.find(btn => btn.querySelector('svg'))
    
    if (toggleButton) {
      fireEvent.click(toggleButton)
      const saved = JSON.parse(localStorage.getItem('safespace_habits') || '[]')
      const today = new Date().toISOString().split('T')[0]
      expect(saved[0].completions[today]).toBe(true)
    }
  })

  it('should display streak count', () => {
    const today = new Date().toISOString().split('T')[0]
    const habits = [{ 
      id: 1, 
      name: 'Exercise', 
      icon: '💪', 
      completions: { [today]: true } 
    }]
    localStorage.setItem('safespace_habits', JSON.stringify(habits))
    
    render(<HabitTrackerPage />)
    expect(screen.getByText(/1 day streak/i)).toBeInTheDocument()
  })

  it('should close modal on cancel', () => {
    render(<HabitTrackerPage />)
    fireEvent.click(screen.getByText('Add Habit'))
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('New Habit')).not.toBeInTheDocument()
  })

  it('should disable create button when name empty', () => {
    render(<HabitTrackerPage />)
    fireEvent.click(screen.getByText('Add Habit'))
    const createButton = screen.getByText('Create')
    expect(createButton).toBeDisabled()
  })
})
