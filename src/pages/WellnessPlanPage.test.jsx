import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import WellnessPlanPage from './WellnessPlanPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

describe('WellnessPlanPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders page with header', () => {
    render(<WellnessPlanPage />)
    expect(screen.getByText('Wellness Plan')).toBeInTheDocument()
    expect(screen.getByText(/personalized daily routine/i)).toBeInTheDocument()
  })

  it('shows empty state when no plan', () => {
    render(<WellnessPlanPage />)
    expect(screen.getByText('Create Your Wellness Plan')).toBeInTheDocument()
  })

  it('creates new plan', async () => {
    render(<WellnessPlanPage />)
    fireEvent.click(screen.getByText('Create Plan'))
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_wellness_plans'))
      expect(saved).toHaveLength(1)
    })
  })

  it('opens add activity modal', () => {
    const plans = [{ id: 1, name: 'My Plan', activities: [], is_active: true }]
    localStorage.setItem('safespace_wellness_plans', JSON.stringify(plans))
    render(<WellnessPlanPage />)
    fireEvent.click(screen.getByText('Add Activity'))
    expect(screen.getByText('New Activity')).toBeInTheDocument()
  })

  it('adds new activity', async () => {
    const plans = [{ id: 1, name: 'My Plan', activities: [], is_active: true }]
    localStorage.setItem('safespace_wellness_plans', JSON.stringify(plans))
    render(<WellnessPlanPage />)
    fireEvent.click(screen.getByText('Add Activity'))
    
    const input = screen.getByPlaceholderText(/morning meditation/i)
    fireEvent.change(input, { target: { value: 'Yoga' } })
    fireEvent.click(screen.getByText('Add'))
    
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_wellness_plans'))
      expect(saved[0].activities).toHaveLength(1)
    })
  })

  it('displays today activities', () => {
    const plans = [{
      id: 1,
      name: 'My Plan',
      activities: [{ id: 1, title: 'Morning Yoga', time: '09:00', activity_type: 'morning_ritual', days: [0,1,2,3,4,5,6], completions: {} }],
      is_active: true
    }]
    localStorage.setItem('safespace_wellness_plans', JSON.stringify(plans))
    render(<WellnessPlanPage />)
    expect(screen.getByText('Morning Yoga')).toBeInTheDocument()
  })

  it('toggles activity completion', async () => {
    const plans = [{
      id: 1,
      name: 'My Plan',
      activities: [{ id: 1, title: 'Yoga', time: '09:00', activity_type: 'morning_ritual', days: [0,1,2,3,4,5,6], completions: {} }],
      is_active: true
    }]
    localStorage.setItem('safespace_wellness_plans', JSON.stringify(plans))
    render(<WellnessPlanPage />)
    
    const checkButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'))
    fireEvent.click(checkButtons[0])
    
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_wellness_plans'))
      const today = new Date().toISOString().split('T')[0]
      expect(saved[0].activities[0].completions[today]).toBe(true)
    })
  })

  it('shows all activities section', () => {
    const plans = [{
      id: 1,
      name: 'My Plan',
      activities: [{ id: 1, title: 'Yoga', time: '09:00', activity_type: 'morning_ritual', days: [1,2,3], completions: {} }],
      is_active: true
    }]
    localStorage.setItem('safespace_wellness_plans', JSON.stringify(plans))
    render(<WellnessPlanPage />)
    expect(screen.getByText('All Activities')).toBeInTheDocument()
  })

  it('closes modal on cancel', () => {
    const plans = [{ id: 1, name: 'My Plan', activities: [], is_active: true }]
    localStorage.setItem('safespace_wellness_plans', JSON.stringify(plans))
    render(<WellnessPlanPage />)
    fireEvent.click(screen.getByText('Add Activity'))
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('New Activity')).not.toBeInTheDocument()
  })

  it('disables add button when title empty', () => {
    const plans = [{ id: 1, name: 'My Plan', activities: [], is_active: true }]
    localStorage.setItem('safespace_wellness_plans', JSON.stringify(plans))
    render(<WellnessPlanPage />)
    fireEvent.click(screen.getByText('Add Activity'))
    expect(screen.getByText('Add')).toBeDisabled()
  })
})
