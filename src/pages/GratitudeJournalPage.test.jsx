import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GratitudeJournalPage from './GratitudeJournalPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 1, username: 'testuser' } })
}))

vi.mock('../components/gratitude/GratitudeEntryModal', () => ({
  default: ({ onClose, onSave }) => (
    <div data-testid="modal">
      <button onClick={() => onSave({ date: '2025-01-07', items: ['Test'], mood_rating: 4, id: 123 })}>
        Save
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  )
}))

vi.mock('../components/gratitude/GratitudeCard', () => ({
  default: ({ entry, onEdit, onDelete }) => (
    <div data-testid="gratitude-card">
      <span>{entry.date}</span>
      <button onClick={() => onEdit(entry)}>Edit</button>
      <button onClick={() => onDelete(entry.date)}>Delete</button>
    </div>
  )
}))

vi.mock('../components/gratitude/GratitudeStats', () => ({
  default: () => <div data-testid="stats">Stats</div>
}))

describe('GratitudeJournalPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  // 1. Rendering
  it('renders page with header and stats', () => {
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Gratitude Journal')).toBeInTheDocument()
    expect(screen.getByText(/what are you grateful for today/i)).toBeInTheDocument()
    expect(screen.getByText('Current Streak')).toBeInTheDocument()
    expect(screen.getByText('Total Entries')).toBeInTheDocument()
  })

  it('shows empty state when no entries', () => {
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Start Your Gratitude Journey')).toBeInTheDocument()
    expect(screen.getByText(/research shows that practicing gratitude/i)).toBeInTheDocument()
  })

  it('displays entries from localStorage', () => {
    const entries = [
      { date: '2025-01-07', items: ['Family'], mood_rating: 5 },
      { date: '2025-01-06', items: ['Health'], mood_rating: 4 }
    ]
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(entries))
    
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    expect(screen.getAllByTestId('gratitude-card')).toHaveLength(2)
  })

  // 2. User Interaction
  it('opens modal when Add Entry clicked', () => {
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    const addButton = screen.getByRole('button', { name: /add entry/i })
    fireEvent.click(addButton)
    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('saves new entry and updates list', async () => {
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    const addButton = screen.getByRole('button', { name: /add entry/i })
    fireEvent.click(addButton)
    
    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_gratitude_entries'))
      expect(saved).toHaveLength(1)
      expect(saved[0].items).toEqual(['Test'])
    })
  })

  it('edits existing entry', () => {
    const entries = [{ date: '2025-01-07', items: ['Family'], mood_rating: 5 }]
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(entries))
    
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)
    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('deletes entry', async () => {
    const entries = [
      { date: '2025-01-07', items: ['Family'], mood_rating: 5 },
      { date: '2025-01-06', items: ['Health'], mood_rating: 4 }
    ]
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(entries))
    
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])
    
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_gratitude_entries'))
      expect(saved).toHaveLength(1)
    })
  })

  // 3. Data Persistence
  it('loads entries from localStorage on mount', () => {
    const entries = [{ date: '2025-01-07', items: ['Test'], mood_rating: 5 }]
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(entries))
    
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    expect(screen.getByTestId('gratitude-card')).toBeInTheDocument()
  })

  // 4. Streak Calculation
  it('calculates streak correctly for consecutive days', () => {
    const entries = [
      { date: '2025-01-07', items: ['Day 1'], mood_rating: 5 },
      { date: '2025-01-06', items: ['Day 2'], mood_rating: 5 },
      { date: '2025-01-05', items: ['Day 3'], mood_rating: 5 }
    ]
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(entries))
    
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    expect(screen.getByText('3 days')).toBeInTheDocument()
  })

  it('shows 0 streak when no entries', () => {
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    expect(screen.getByText('0 days')).toBeInTheDocument()
  })

  // 5. Stats Display
  it('displays total entries count', () => {
    const entries = [
      { date: '2025-01-07', items: ['Test 1'], mood_rating: 5 },
      { date: '2025-01-06', items: ['Test 2'], mood_rating: 4 }
    ]
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(entries))
    
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('displays this month count', () => {
    const entries = [
      { date: '2025-01-07', items: ['This month'], mood_rating: 5 },
      { date: '2024-12-15', items: ['Last month'], mood_rating: 4 }
    ]
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(entries))
    
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    expect(screen.getByText('This Month')).toBeInTheDocument()
  })

  // 6. Mental Health Context
  it('provides encouraging empty state message', () => {
    render(
      <MemoryRouter>
        <GratitudeJournalPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/research shows that practicing gratitude can improve mental health/i)).toBeInTheDocument()
  })
})
