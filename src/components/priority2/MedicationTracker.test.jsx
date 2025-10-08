import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MedicationTracker from './MedicationTracker'

describe('MedicationTracker', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders with header', () => {
    render(<MedicationTracker onClose={mockOnClose} />)
    expect(screen.getByText('Medication Tracker')).toBeInTheDocument()
  })

  it('opens modal when Add Medication clicked', () => {
    render(<MedicationTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add medication/i))
    expect(screen.getByText('New Medication')).toBeInTheDocument()
  })

  it('closes modal when Cancel clicked', () => {
    render(<MedicationTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add medication/i))
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('New Medication')).not.toBeInTheDocument()
  })

  it('updates medication name input', () => {
    render(<MedicationTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add medication/i))
    const input = screen.getByPlaceholderText(/e.g., sertraline/i)
    fireEvent.change(input, { target: { value: 'Prozac' } })
    expect(input.value).toBe('Prozac')
  })

  it('updates dosage input', () => {
    render(<MedicationTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add medication/i))
    const input = screen.getByPlaceholderText(/e.g., 50mg/i)
    fireEvent.change(input, { target: { value: '100mg' } })
    expect(input.value).toBe('100mg')
  })

  it('selects frequency', () => {
    render(<MedicationTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add medication/i))
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'twice_daily' } })
    expect(select.value).toBe('twice_daily')
  })

  it('adds new medication to localStorage', async () => {
    render(<MedicationTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add medication/i))
    
    const nameInput = screen.getByPlaceholderText(/e.g., sertraline/i)
    fireEvent.change(nameInput, { target: { value: 'Zoloft' } })
    
    const dosageInput = screen.getByPlaceholderText(/e.g., 50mg/i)
    fireEvent.change(dosageInput, { target: { value: '50mg' } })
    
    fireEvent.click(screen.getByText('Add'))
    
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_medications'))
      expect(saved).toHaveLength(1)
      expect(saved[0].name).toBe('Zoloft')
      expect(saved[0].dosage).toBe('50mg')
    })
  })

  it('disables Add button when fields empty', () => {
    render(<MedicationTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText(/add medication/i))
    const addButton = screen.getByText('Add')
    expect(addButton).toBeDisabled()
  })

  it('displays existing medications from localStorage', () => {
    const meds = [
      { id: 1, name: 'Lexapro', dosage: '10mg', frequency: 'daily', times: ['09:00'], logs: {} }
    ]
    localStorage.setItem('safespace_medications', JSON.stringify(meds))
    
    render(<MedicationTracker onClose={mockOnClose} />)
    expect(screen.getByText('Lexapro')).toBeInTheDocument()
    expect(screen.getByText(/10mg • daily/i)).toBeInTheDocument()
  })

  it('toggles medication taken status', async () => {
    const meds = [
      { id: 1, name: 'Test Med', dosage: '50mg', frequency: 'daily', times: ['09:00'], logs: {} }
    ]
    localStorage.setItem('safespace_medications', JSON.stringify(meds))
    
    render(<MedicationTracker onClose={mockOnClose} />)
    const button = screen.getByText('Mark Taken')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('✓ Taken')).toBeInTheDocument()
    })
  })

  it('displays times for medication', () => {
    const meds = [
      { id: 1, name: 'Test', dosage: '50mg', frequency: 'daily', times: ['09:00', '21:00'], logs: {} }
    ]
    localStorage.setItem('safespace_medications', JSON.stringify(meds))
    
    render(<MedicationTracker onClose={mockOnClose} />)
    expect(screen.getByText(/times: 09:00, 21:00/i)).toBeInTheDocument()
  })

  it('calls onClose when Back clicked', () => {
    render(<MedicationTracker onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Back'))
    expect(mockOnClose).toHaveBeenCalled()
  })
})
