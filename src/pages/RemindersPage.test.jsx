import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RemindersPage from './RemindersPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

describe('RemindersPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  // 1. Rendering
  it('renders page with header', () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Smart Reminders')).toBeInTheDocument()
    expect(screen.getByText(/stay on track with your wellness routine/i)).toBeInTheDocument()
  })

  it('shows empty state when no reminders', () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    expect(screen.getByText('No Reminders Yet')).toBeInTheDocument()
    expect(screen.getByText(/create reminders to stay consistent/i)).toBeInTheDocument()
  })

  it('displays reminders from localStorage', () => {
    const reminders = [
      { id: 1, type: 'mood_checkin', title: '', time: '09:00', days: [1, 2, 3], enabled: true },
      { id: 2, type: 'medication', title: 'Morning meds', time: '08:00', days: [0, 1, 2, 3, 4, 5, 6], enabled: true }
    ]
    localStorage.setItem('safespace_reminders', JSON.stringify(reminders))
    
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Mood Check-in')).toBeInTheDocument()
    expect(screen.getByText('Morning meds')).toBeInTheDocument()
  })

  // 2. User Interaction - Modal
  it('opens modal when Add Reminder clicked', () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    const addButton = screen.getByRole('button', { name: /add reminder/i })
    fireEvent.click(addButton)
    expect(screen.getByText('New Reminder')).toBeInTheDocument()
  })

  it('closes modal when Cancel clicked', () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /add reminder/i }))
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('New Reminder')).not.toBeInTheDocument()
  })

  // 3. Form Interactions
  it('selects reminder type', () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /add reminder/i }))
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'medication' } })
    expect(select.value).toBe('medication')
  })

  it('updates custom title', () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /add reminder/i }))
    const input = screen.getByPlaceholderText(/custom reminder name/i)
    fireEvent.change(input, { target: { value: 'Take vitamins' } })
    expect(input.value).toBe('Take vitamins')
  })

  it('updates time', () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /add reminder/i }))
    const timeInput = screen.getByLabelText(/time/i)
    fireEvent.change(timeInput, { target: { value: '14:30' } })
    expect(timeInput.value).toBe('14:30')
  })

  it('toggles days selection', () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /add reminder/i }))
    const dayButtons = screen.getAllByRole('button').filter(btn => 
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(btn.textContent)
    )
    fireEvent.click(dayButtons[0])
    expect(dayButtons[0]).toHaveClass('bg-primary')
  })

  // 4. Data Persistence
  it('creates new reminder and saves to localStorage', async () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /add reminder/i }))
    
    const createButton = screen.getByText('Create')
    fireEvent.click(createButton)
    
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_reminders'))
      expect(saved).toHaveLength(1)
      expect(saved[0].type).toBe('mood_checkin')
    })
  })

  it('loads reminders from localStorage on mount', () => {
    const reminders = [
      { id: 1, type: 'mood_checkin', title: '', time: '09:00', days: [1, 2, 3], enabled: true }
    ]
    localStorage.setItem('safespace_reminders', JSON.stringify(reminders))
    
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Mood Check-in')).toBeInTheDocument()
  })

  // 5. Reminder Management
  it('toggles reminder enabled state', async () => {
    const reminders = [
      { id: 1, type: 'mood_checkin', title: '', time: '09:00', days: [1, 2, 3], enabled: true }
    ]
    localStorage.setItem('safespace_reminders', JSON.stringify(reminders))
    
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    
    const toggleButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg')
    )
    fireEvent.click(toggleButtons[0])
    
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_reminders'))
      expect(saved[0].enabled).toBe(false)
    })
  })

  it('deletes reminder', async () => {
    const reminders = [
      { id: 1, type: 'mood_checkin', title: '', time: '09:00', days: [1, 2, 3], enabled: true },
      { id: 2, type: 'medication', title: '', time: '08:00', days: [1, 2, 3], enabled: true }
    ]
    localStorage.setItem('safespace_reminders', JSON.stringify(reminders))
    
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    
    const deleteButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg') && btn.className.includes('text-red-500')
    )
    fireEvent.click(deleteButtons[0])
    
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_reminders'))
      expect(saved).toHaveLength(1)
    })
  })

  // 6. Display Logic
  it('displays reminder with custom title', () => {
    const reminders = [
      { id: 1, type: 'medication', title: 'Morning vitamins', time: '08:00', days: [1, 2, 3], enabled: true }
    ]
    localStorage.setItem('safespace_reminders', JSON.stringify(reminders))
    
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Morning vitamins')).toBeInTheDocument()
  })

  it('displays reminder with default label when no title', () => {
    const reminders = [
      { id: 1, type: 'therapy', title: '', time: '10:00', days: [1, 3], enabled: true }
    ]
    localStorage.setItem('safespace_reminders', JSON.stringify(reminders))
    
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Therapy')).toBeInTheDocument()
  })

  it('displays time and days correctly', () => {
    const reminders = [
      { id: 1, type: 'mood_checkin', title: '', time: '09:00', days: [1, 3, 5], enabled: true }
    ]
    localStorage.setItem('safespace_reminders', JSON.stringify(reminders))
    
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/09:00 • Mon, Wed, Fri/)).toBeInTheDocument()
  })

  // 7. Form Validation
  it('disables create button when no days selected', () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /add reminder/i }))
    
    const dayButtons = screen.getAllByRole('button').filter(btn => 
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(btn.textContent)
    )
    dayButtons.forEach(btn => fireEvent.click(btn))
    
    const createButton = screen.getByText('Create')
    expect(createButton).toBeDisabled()
  })

  // 8. Mental Health Context
  it('provides wellness-focused reminder types', () => {
    render(
      <MemoryRouter>
        <RemindersPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /add reminder/i }))
    const select = screen.getByRole('combobox')
    expect(select.innerHTML).toContain('Mood Check-in')
    expect(select.innerHTML).toContain('Medication')
    expect(select.innerHTML).toContain('Therapy')
  })
})
