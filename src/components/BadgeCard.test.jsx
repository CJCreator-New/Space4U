import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BadgeCard from './BadgeCard'

describe('BadgeCard', () => {
  const mockBadge = {
    id: 'first-mood',
    name: 'First Steps',
    description: 'Log your first mood',
    emoji: '🎯',
    points: 10,
    requirement: 1,
    category: 'mood'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render badge name and description', () => {
    render(<BadgeCard badge={mockBadge} />)
    expect(screen.getByText('First Steps')).toBeInTheDocument()
    expect(screen.getByText('Log your first mood')).toBeInTheDocument()
  })

  it('should render badge emoji', () => {
    render(<BadgeCard badge={mockBadge} />)
    expect(screen.getByText('🎯')).toBeInTheDocument()
  })

  it('should show locked state by default', () => {
    render(<BadgeCard badge={mockBadge} />)
    expect(screen.getByText('10 points when unlocked')).toBeInTheDocument()
  })

  it('should show unlocked state', () => {
    const badgeData = {
      unlocked: true,
      unlockedAt: '2025-01-07T12:00:00',
      progress: 1
    }
    render(<BadgeCard badge={mockBadge} badgeData={badgeData} />)
    expect(screen.getByText(/Unlocked/i)).toBeInTheDocument()
    expect(screen.getByText('+10 points')).toBeInTheDocument()
  })

  it('should show progress bar when progress > 0', () => {
    const badgeData = { progress: 5, requirement: 10 }
    render(<BadgeCard badge={mockBadge} badgeData={badgeData} />)
    expect(screen.getByText('5/10 completed')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const onClick = vi.fn()
    render(<BadgeCard badge={mockBadge} onClick={onClick} />)
    fireEvent.click(screen.getByText('First Steps'))
    expect(onClick).toHaveBeenCalledWith(mockBadge)
  })

  it('should show share button when unlocked', () => {
    const badgeData = { unlocked: true, unlockedAt: '2025-01-07T12:00:00' }
    render(<BadgeCard badge={mockBadge} badgeData={badgeData} />)
    expect(screen.getByText('Share')).toBeInTheDocument()
  })

  it('should call onShare without propagating click', () => {
    const onClick = vi.fn()
    const onShare = vi.fn()
    const badgeData = { unlocked: true, unlockedAt: '2025-01-07T12:00:00' }
    render(<BadgeCard badge={mockBadge} badgeData={badgeData} onClick={onClick} onShare={onShare} />)
    
    fireEvent.click(screen.getByText('Share'))
    expect(onShare).toHaveBeenCalledWith(mockBadge)
    expect(onClick).not.toHaveBeenCalled()
  })
})
