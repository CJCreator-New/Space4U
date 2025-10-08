import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CircleCard from './CircleCard'

describe('CircleCard', () => {
  let user
  const mockCircle = {
    id: 'circle1',
    name: 'Anxiety Support',
    description: 'A safe space for those dealing with anxiety',
    icon: '🌊',
    color: '#4F46E5',
    members: 1234,
    posts: 567
  }

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      expect(screen.getByText('Anxiety Support')).toBeInTheDocument()
    })

    it('should display circle name', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      expect(screen.getByText('Anxiety Support')).toBeInTheDocument()
    })

    it('should display circle description', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      expect(screen.getByText('A safe space for those dealing with anxiety')).toBeInTheDocument()
    })

    it('should display circle icon', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      expect(screen.getByText('🌊')).toBeInTheDocument()
    })

    it('should display member count', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      expect(screen.getByText(/1.2k members/i)).toBeInTheDocument()
    })

    it('should display post count', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      expect(screen.getByText(/567 posts/i)).toBeInTheDocument()
    })

    it('should apply circle color as border', () => {
      const { container } = render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      const card = container.firstChild
      expect(card).toHaveStyle({ borderLeftColor: '#4F46E5' })
    })
  })

  describe('Join/Leave Functionality', () => {
    it('should show "Join Circle" button when not joined', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      expect(screen.getByText('Join Circle')).toBeInTheDocument()
    })

    it('should show "Joined" button when joined', () => {
      render(<CircleCard circle={mockCircle} isJoined={true} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      expect(screen.getByText('Joined')).toBeInTheDocument()
    })

    it('should call onJoin when clicking join button', async () => {
      const onJoin = vi.fn()
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={onJoin} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      const joinButton = screen.getByText('Join Circle')
      await user.click(joinButton)
      
      expect(onJoin).toHaveBeenCalledWith('circle1')
    })

    it('should call onLeave when clicking joined button', async () => {
      const onLeave = vi.fn()
      render(<CircleCard circle={mockCircle} isJoined={true} onJoin={vi.fn()} onLeave={onLeave} onClick={vi.fn()} />)
      
      const joinedButton = screen.getByText('Joined')
      await user.click(joinedButton)
      
      expect(onLeave).toHaveBeenCalledWith('circle1')
    })

    it('should not propagate click to card when clicking join button', async () => {
      const onClick = vi.fn()
      const onJoin = vi.fn()
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={onJoin} onLeave={vi.fn()} onClick={onClick} />)
      
      const joinButton = screen.getByText('Join Circle')
      await user.click(joinButton)
      
      expect(onJoin).toHaveBeenCalled()
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('Card Click', () => {
    it('should call onClick when clicking card', async () => {
      const onClick = vi.fn()
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={onClick} />)
      
      const card = screen.getByText('Anxiety Support').closest('div')
      await user.click(card)
      
      expect(onClick).toHaveBeenCalledWith('circle1')
    })

    it('should have cursor pointer', () => {
      const { container } = render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      const card = container.firstChild
      expect(card).toHaveClass('cursor-pointer')
    })
  })

  describe('Styling', () => {
    it('should apply different styles when joined', () => {
      render(<CircleCard circle={mockCircle} isJoined={true} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      const joinedButton = screen.getByText('Joined')
      expect(joinedButton).toHaveClass('text-success')
    })

    it('should apply primary color when not joined', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      const joinButton = screen.getByText('Join Circle')
      expect(joinButton).toHaveClass('bg-primary')
    })

    it('should show check icon when joined', () => {
      render(<CircleCard circle={mockCircle} isJoined={true} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      const button = screen.getByText('Joined')
      expect(button.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Number Formatting', () => {
    it('should format large member counts', () => {
      const largeCircle = { ...mockCircle, members: 12345 }
      render(<CircleCard circle={largeCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      expect(screen.getByText(/12.3k members/i)).toBeInTheDocument()
    })

    it('should format small member counts', () => {
      const smallCircle = { ...mockCircle, members: 42 }
      render(<CircleCard circle={smallCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      expect(screen.getByText(/42 members/i)).toBeInTheDocument()
    })

    it('should format post counts', () => {
      const manyPostsCircle = { ...mockCircle, posts: 9876 }
      render(<CircleCard circle={manyPostsCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      expect(screen.getByText(/9.9k posts/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const onJoin = vi.fn()
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={onJoin} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero members', () => {
      const emptyCircle = { ...mockCircle, members: 0 }
      expect(() => render(<CircleCard circle={emptyCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)).not.toThrow()
    })

    it('should handle zero posts', () => {
      const noPostsCircle = { ...mockCircle, posts: 0 }
      expect(() => render(<CircleCard circle={noPostsCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)).not.toThrow()
    })

    it('should handle very long descriptions', () => {
      const longDescCircle = { ...mockCircle, description: 'A'.repeat(200) }
      render(<CircleCard circle={longDescCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      const card = screen.getByText('Anxiety Support').closest('div')
      expect(card).toBeInTheDocument()
    })

    it('should handle missing callbacks gracefully', () => {
      expect(() => render(<CircleCard circle={mockCircle} isJoined={false} />)).not.toThrow()
    })
  })

  describe('Mental Health Context', () => {
    it('should display supportive community metrics', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      expect(screen.getByText(/members/i)).toBeInTheDocument()
      expect(screen.getByText(/posts/i)).toBeInTheDocument()
    })

    it('should use welcoming language', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      expect(screen.getByText('Join Circle')).toBeInTheDocument()
    })

    it('should show safe space description', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      expect(screen.getByText(/safe space/i)).toBeInTheDocument()
    })
  })

  describe('Hover Effects', () => {
    it('should have hover transition classes', () => {
      const { container } = render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      const card = container.firstChild
      
      expect(card).toHaveClass('hover:shadow-lg')
      expect(card).toHaveClass('transition-all')
    })

    it('should have button hover classes', () => {
      render(<CircleCard circle={mockCircle} isJoined={false} onJoin={vi.fn()} onLeave={vi.fn()} onClick={vi.fn()} />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-primary/90')
    })
  })
})
