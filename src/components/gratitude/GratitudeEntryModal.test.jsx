import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GratitudeEntryModal from './GratitudeEntryModal'

describe('GratitudeEntryModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  // 1. Rendering
  it('renders modal with all form fields', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    expect(screen.getByText('Gratitude Entry')).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/what are you grateful for/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/how do you feel/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/additional notes/i)).toBeInTheDocument()
  })

  it('renders with 3 default gratitude items', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    const inputs = screen.getAllByPlaceholderText(/gratitude #/i)
    expect(inputs).toHaveLength(3)
  })

  it('renders with existing entry data', () => {
    const entry = {
      date: '2025-01-05',
      items: ['Family', 'Health'],
      mood_rating: 5,
      notes: 'Great day'
    }
    render(<GratitudeEntryModal entry={entry} onClose={mockOnClose} onSave={mockOnSave} />)
    expect(screen.getByDisplayValue('Family')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Health')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Great day')).toBeInTheDocument()
  })

  // 2. User Interaction
  it('updates gratitude item on input', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    const input = screen.getAllByPlaceholderText(/gratitude #/i)[0]
    fireEvent.change(input, { target: { value: 'My family' } })
    expect(input.value).toBe('My family')
  })

  it('adds new gratitude item up to 5 items', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    const addButton = screen.getByText(/add another/i)
    fireEvent.click(addButton)
    expect(screen.getAllByPlaceholderText(/gratitude #/i)).toHaveLength(4)
    fireEvent.click(addButton)
    expect(screen.getAllByPlaceholderText(/gratitude #/i)).toHaveLength(5)
    expect(screen.queryByText(/add another/i)).not.toBeInTheDocument()
  })

  it('removes gratitude item when delete clicked', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    const deleteButtons = screen.getAllByRole('button', { name: '' })
    const trashButtons = deleteButtons.filter(btn => btn.querySelector('svg'))
    fireEvent.click(trashButtons[0])
    expect(screen.getAllByPlaceholderText(/gratitude #/i)).toHaveLength(2)
  })

  it('selects mood rating', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    const moodButtons = screen.getAllByRole('button').filter(btn => 
      ['😔', '😕', '😊', '😄', '🤩'].includes(btn.textContent)
    )
    fireEvent.click(moodButtons[4])
    expect(moodButtons[4]).toHaveClass('bg-primary')
  })

  it('updates notes field', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    const notes = screen.getByPlaceholderText(/any reflections/i)
    fireEvent.change(notes, { target: { value: 'Feeling blessed' } })
    expect(notes.value).toBe('Feeling blessed')
  })

  // 3. Form Validation
  it('shows alert when saving with no filled items', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    const saveButton = screen.getByText('Save Entry')
    fireEvent.click(saveButton)
    expect(window.alert).toHaveBeenCalledWith('Add at least one gratitude item')
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('saves entry with filled items', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    const input = screen.getAllByPlaceholderText(/gratitude #/i)[0]
    fireEvent.change(input, { target: { value: 'My family' } })
    const saveButton = screen.getByText('Save Entry')
    fireEvent.click(saveButton)
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      items: ['My family'],
      mood_rating: 3
    }))
  })

  // 4. Modal Controls
  it('closes modal when X button clicked', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    const closeButton = screen.getAllByRole('button')[0]
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalled()
  })

  // 5. Mental Health Context
  it('provides empathetic placeholder text', () => {
    render(<GratitudeEntryModal onClose={mockOnClose} onSave={mockOnSave} />)
    expect(screen.getByPlaceholderText(/any reflections or thoughts/i)).toBeInTheDocument()
  })
})
