import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostCard from './PostCard'

// Mock dependencies
vi.mock('../utils/badgeSystem', () => ({
  addPoints: vi.fn(),
  POINT_VALUES: { heartReceived: 5 }
}))

vi.mock('../data/mockComments', () => ({
  mockComments: {
    'post1': [
      {
        id: 'comment1',
        author: { username: 'TestUser', avatar: '🐻' },
        content: 'Great post!',
        timestamp: '2h ago',
        hearts: 3
      }
    ]
  }
}))

describe('PostCard', () => {
  let user
  const mockPost = {
    id: 'post1',
    author: {
      username: 'JohnDoe',
      avatar: '🐻'
    },
    content: 'This is a test post content',
    timestamp: '2h ago',
    hearts: 5,
    commentCount: 3,
    isHearted: false,
    circleId: 'circle1',
    tags: ['anxiety', 'support']
  }

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      expect(screen.getByText('JohnDoe')).toBeInTheDocument()
    })

    it('should display post author', () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      expect(screen.getByText('JohnDoe')).toBeInTheDocument()
      expect(screen.getByText('🐻')).toBeInTheDocument()
    })

    it('should display post content', () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      expect(screen.getByText('This is a test post content')).toBeInTheDocument()
    })

    it('should display timestamp', () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      expect(screen.getByText(/Posted 2h ago/i)).toBeInTheDocument()
    })

    it('should display heart count', () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should display comment count', () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should display tags', () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      expect(screen.getByText('#anxiety')).toBeInTheDocument()
      expect(screen.getByText('#support')).toBeInTheDocument()
    })
  })

  describe('Heart Interaction', () => {
    it('should toggle heart on click', async () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const heartButton = screen.getAllByRole('button')[1] // Heart button
      await user.click(heartButton)
      
      expect(screen.getByText('6')).toBeInTheDocument() // Count increased
    })

    it('should unheart when clicked again', async () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const heartButton = screen.getAllByRole('button')[1]
      await user.click(heartButton) // Heart
      await user.click(heartButton) // Unheart
      
      expect(screen.getByText('5')).toBeInTheDocument() // Back to original
    })

    it('should call onHeart callback', async () => {
      const onHeart = vi.fn()
      render(<PostCard post={mockPost} circleColor="#4F46E5" onHeart={onHeart} />)
      
      const heartButton = screen.getAllByRole('button')[1]
      await user.click(heartButton)
      
      expect(onHeart).toHaveBeenCalledWith('post1', true)
    })

    it('should show hearted state', async () => {
      const heartedPost = { ...mockPost, isHearted: true }
      render(<PostCard post={heartedPost} circleColor="#4F46E5" />)
      
      const heartButton = screen.getAllByRole('button')[1]
      expect(heartButton).toHaveClass('text-red-500')
    })
  })

  describe('Comments Section', () => {
    it('should toggle comments on click', async () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const commentButton = screen.getAllByRole('button')[2] // Comment button
      await user.click(commentButton)
      
      await waitFor(() => {
        expect(screen.getByText('Great post!')).toBeInTheDocument()
      })
    })

    it('should hide comments when toggled again', async () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const commentButton = screen.getAllByRole('button')[2]
      await user.click(commentButton)
      await user.click(commentButton)
      
      await waitFor(() => {
        expect(screen.queryByText('Great post!')).not.toBeInTheDocument()
      })
    })

    it('should display comment input', async () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const commentButton = screen.getAllByRole('button')[2]
      await user.click(commentButton)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument()
      })
    })

    it('should enable send button when comment has text', async () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const commentButton = screen.getAllByRole('button')[2]
      await user.click(commentButton)
      
      const input = screen.getByPlaceholderText('Add a comment...')
      await user.type(input, 'Test comment')
      
      const sendButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg') && !btn.disabled
      )
      expect(sendButton).toBeTruthy()
    })

    it('should clear input after sending comment', async () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const commentButton = screen.getAllByRole('button')[2]
      await user.click(commentButton)
      
      const input = screen.getByPlaceholderText('Add a comment...')
      await user.type(input, 'Test comment')
      
      const sendButton = screen.getAllByRole('button').find(btn => 
        !btn.disabled && btn.querySelector('svg')
      )
      if (sendButton) await user.click(sendButton)
      
      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })
  })

  describe('Share Functionality', () => {
    it('should copy link to clipboard on share', async () => {
      const writeTextMock = vi.fn()
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock }
      })
      
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const shareButton = screen.getAllByRole('button')[3] // Share button
      await user.click(shareButton)
      
      expect(writeTextMock).toHaveBeenCalled()
    })

    it('should call onShare callback', async () => {
      const onShare = vi.fn()
      Object.assign(navigator, {
        clipboard: { writeText: vi.fn() }
      })
      
      render(<PostCard post={mockPost} circleColor="#4F46E5" onShare={onShare} />)
      
      const shareButton = screen.getAllByRole('button')[3]
      await user.click(shareButton)
      
      expect(onShare).toHaveBeenCalled()
    })
  })

  describe('Content Truncation', () => {
    it('should truncate long content', () => {
      const longPost = {
        ...mockPost,
        content: 'A'.repeat(250)
      }
      render(<PostCard post={longPost} circleColor="#4F46E5" />)
      
      expect(screen.getByText('Read more')).toBeInTheDocument()
    })

    it('should expand content on read more click', async () => {
      const longPost = {
        ...mockPost,
        content: 'A'.repeat(250)
      }
      render(<PostCard post={longPost} circleColor="#4F46E5" />)
      
      const readMoreButton = screen.getByText('Read more')
      await user.click(readMoreButton)
      
      expect(screen.getByText('Show less')).toBeInTheDocument()
    })

    it('should not show read more for short content', () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      expect(screen.queryByText('Read more')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should have accessible input', async () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const commentButton = screen.getAllByRole('button')[2]
      await user.click(commentButton)
      
      const input = screen.getByPlaceholderText('Add a comment...')
      expect(input).toHaveAttribute('maxLength', '300')
    })
  })

  describe('Edge Cases', () => {
    it('should handle post without tags', () => {
      const noTagsPost = { ...mockPost, tags: [] }
      expect(() => render(<PostCard post={noTagsPost} circleColor="#4F46E5" />)).not.toThrow()
    })

    it('should handle post without comments', async () => {
      const noCommentsPost = { ...mockPost, id: 'post-no-comments' }
      render(<PostCard post={noCommentsPost} circleColor="#4F46E5" />)
      
      const commentButton = screen.getAllByRole('button')[2]
      await user.click(commentButton)
      
      await waitFor(() => {
        expect(screen.getByText(/No comments yet/i)).toBeInTheDocument()
      })
    })

    it('should handle missing callbacks', async () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      const heartButton = screen.getAllByRole('button')[1]
      await user.click(heartButton)
      
      // Should not throw error
      expect(screen.getByText('6')).toBeInTheDocument()
    })
  })

  describe('Mental Health Context', () => {
    it('should use supportive language', async () => {
      const noCommentsPost = { ...mockPost, id: 'post-no-comments' }
      render(<PostCard post={noCommentsPost} circleColor="#4F46E5" />)
      
      const commentButton = screen.getAllByRole('button')[2]
      await user.click(commentButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Be the first!/i)).toBeInTheDocument()
      })
    })

    it('should display community engagement metrics', () => {
      render(<PostCard post={mockPost} circleColor="#4F46E5" />)
      
      expect(screen.getByText('5')).toBeInTheDocument() // Hearts
      expect(screen.getByText('3')).toBeInTheDocument() // Comments
    })
  })
})
