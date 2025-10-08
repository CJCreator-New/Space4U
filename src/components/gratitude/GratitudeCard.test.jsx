import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GratitudeCard from './GratitudeCard'

describe('GratitudeCard', () => {
  const mockEntry = {
    date: '2025-01-07',
    items: ['Family time', 'Good health', 'Sunny weather'],
    mood_rating: 4,
    notes: 'Great day overall'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render gratitude items', () => {
    render(<GratitudeCard entry={mockEntry} />)
    expect(screen.getByText('Family time')).toBeInTheDocument()
    expect(screen.getByText('Good health')).toBeInTheDocument()
    expect(screen.getByText('Sunny weather')).toBeInTheDocument()
  })

  it('should display formatted date', () => {
    render(<GratitudeCard entry={mockEntry} />)
    expect(screen.getByText(/Tuesday, January 7, 2025/i)).toBeInTheDocument()
  })

  it('should show mood emoji', () => {
    render(<GratitudeCard entry={mockEntry} />)
    expect(screen.getByText('😄')).toBeInTheDocument()
  })

  it('should display notes when present', () => {
    render(<GratitudeCard entry={mockEntry} />)
    expect(screen.getByText('Great day overall')).toBeInTheDocument()
  })

  it('should call onEdit when edit button clicked', () => {
    const onEdit = vi.fn()
    render(<GratitudeCard entry={mockEntry} onEdit={onEdit} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onEdit).toHaveBeenCalledWith(mockEntry)
  })

  it('should call onDelete when delete button clicked', () => {
    const onDelete = vi.fn()
    render(<GratitudeCard entry={mockEntry} onDelete={onDelete} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1])
    expect(onDelete).toHaveBeenCalledWith('2025-01-07')
  })
})
