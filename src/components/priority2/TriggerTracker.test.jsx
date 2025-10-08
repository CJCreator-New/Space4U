import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TriggerTracker from './TriggerTracker'

describe('TriggerTracker', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders with header', () => {
    render(<TriggerTracker onClose={mockOnClose} />)
    expect(screen.getByText('Trigger Tracker')).toBeInTheDocument()
    expect(screen.getByText(/identify and manage mood triggers/i)).toBeInTheDocument()
  })

  it('opens modal when Add Trigger clicked', () => {
    render(<TriggerTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add trigger/i))
    expect(screen.getByText('New Trigger')).toBeInTheDocument()
  })

  it('closes modal when Cancel clicked', () => {
    render(<TriggerTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add trigger/i))
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('New Trigger')).not.toBeInTheDocument()
  })

  it('updates trigger name input', () => {
    render(<TriggerTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add trigger/i))
    const input = screen.getByPlaceholderText(/e.g., crowded places/i)
    fireEvent.change(input, { target: { value: 'Loud noises' } })
    expect(input.value).toBe('Loud noises')
  })

  it('selects trigger category', () => {
    render(<TriggerTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add trigger/i))
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'person' } })
    expect(select.value).toBe('person')
  })

  it('updates description field', () => {
    render(<TriggerTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add trigger/i))
    const textarea = screen.getByPlaceholderText(/what happens when triggered/i)
    fireEvent.change(textarea, { target: { value: 'I feel anxious' } })
    expect(textarea.value).toBe('I feel anxious')
  })

  it('updates coping plan field', () => {
    render(<TriggerTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add trigger/i))
    const textarea = screen.getByPlaceholderText(/how will you cope/i)
    fireEvent.change(textarea, { target: { value: 'Deep breathing' } })
    expect(textarea.value).toBe('Deep breathing')
  })

  it('adds new trigger to localStorage', async () => {
    render(<TriggerTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add trigger/i))
    
    const nameInput = screen.getByPlaceholderText(/e.g., crowded places/i)
    fireEvent.change(nameInput, { target: { value: 'Test Trigger' } })
    
    fireEvent.click(screen.getByText('Add'))
    
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_triggers'))
      expect(saved).toHaveLength(1)
      expect(saved[0].name).toBe('Test Trigger')
    })
  })

  it('disables Add button when name empty', () => {
    render(<TriggerTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add trigger/i))
    const addButton = screen.getByText('Add')
    expect(addButton).toBeDisabled()
  })

  it('displays existing triggers from localStorage', () => {
    const triggers = [
      { id: 1, name: 'Crowds', category: 'place', description: 'Test', coping_plan: 'Breathe', logs: [] }
    ]
    localStorage.setItem('safespace_triggers', JSON.stringify(triggers))
    
    render(<TriggerTracker onClose={mockOnClose} />)
    expect(screen.getByText('Crowds')).toBeInTheDocument()
    expect(screen.getByText('place')).toBeInTheDocument()
  })

  it('displays trigger log count', () => {
    const triggers = [
      { id: 1, name: 'Test', category: 'situation', logs: [{}, {}, {}] }
    ]
    localStorage.setItem('safespace_triggers', JSON.stringify(triggers))
    
    render(<TriggerTracker onClose={mockOnClose} />)
    expect(screen.getByText('3 logs')).toBeInTheDocument()
  })

  it('displays coping plan when available', () => {
    const triggers = [
      { id: 1, name: 'Test', category: 'situation', coping_plan: 'Use grounding technique' }
    ]
    localStorage.setItem('safespace_triggers', JSON.stringify(triggers))
    
    render(<TriggerTracker onClose={mockOnClose} />)
    expect(screen.getByText(/coping plan/i)).toBeInTheDocument()
    expect(screen.getByText('Use grounding technique')).toBeInTheDocument()
  })

  it('calls onClose when Back clicked', () => {
    render(<TriggerTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Back'))
    expect(mockOnClose).toHaveBeenCalled()
  })
})
