import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreatePostModal from './CreatePostModal'

describe('CreatePostModal', () => {
  const mockCircle = {
    id: 'circle1',
    name: 'Anxiety Support',
    color: '#4F46E5'
  }

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('safespace_user', JSON.stringify({
      username: 'TestUser',
      avatar: '🐻'
    }))
    vi.clearAllMocks()
  })

  it('should not render when closed', () => {
    const { container } = render(<CreatePostModal isOpen={false} onClose={vi.fn()} circle={mockCircle} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render when open', () => {
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} circle={mockCircle} />)
    expect(screen.getByText(/Share with Anxiety Support/i)).toBeInTheDocument()
  })

  it('should display user info', () => {
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} circle={mockCircle} />)
    expect(screen.getByText('TestUser')).toBeInTheDocument()
    expect(screen.getByText('🐻')).toBeInTheDocument()
  })

  it('should update content on typing', () => {
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} circle={mockCircle} />)
    const textarea = screen.getByPlaceholderText(/What's on your mind/i)
    fireEvent.change(textarea, { target: { value: 'Test post content' } })
    expect(textarea).toHaveValue('Test post content')
  })

  it('should show character count', () => {
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} circle={mockCircle} />)
    const textarea = screen.getByPlaceholderText(/What's on your mind/i)
    fireEvent.change(textarea, { target: { value: 'Test' } })
    expect(screen.getByText('4/500')).toBeInTheDocument()
  })

  it('should disable post button when content empty', () => {
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} circle={mockCircle} />)
    const postButton = screen.getByRole('button', { name: /^Post$/i })
    expect(postButton).toBeDisabled()
  })

  it('should enable post button with valid content', () => {
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} circle={mockCircle} />)
    const textarea = screen.getByPlaceholderText(/What's on your mind/i)
    fireEvent.change(textarea, { target: { value: 'Valid post content' } })
    const postButton = screen.getByRole('button', { name: /^Post$/i })
    expect(postButton).not.toBeDisabled()
  })

  it('should save post to localStorage', async () => {
    const onPostCreated = vi.fn()
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} circle={mockCircle} onPostCreated={onPostCreated} />)
    
    const textarea = screen.getByPlaceholderText(/What's on your mind/i)
    fireEvent.change(textarea, { target: { value: 'Test post' } })
    
    const postButton = screen.getByRole('button', { name: /^Post$/i })
    fireEvent.click(postButton)
    
    await waitFor(() => {
      const posts = JSON.parse(localStorage.getItem('safespace_user_posts') || '[]')
      expect(posts.length).toBe(1)
      expect(posts[0].content).toBe('Test post')
    }, { timeout: 2000 })
  }, 10000)

  it('should call onPostCreated callback', async () => {
    const onPostCreated = vi.fn()
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} circle={mockCircle} onPostCreated={onPostCreated} />)
    
    const textarea = screen.getByPlaceholderText(/What's on your mind/i)
    fireEvent.change(textarea, { target: { value: 'Test post' } })
    
    const postButton = screen.getByRole('button', { name: /^Post$/i })
    fireEvent.click(postButton)
    
    await waitFor(() => {
      expect(onPostCreated).toHaveBeenCalled()
    }, { timeout: 2500 })
  }, 10000)

  it('should close modal on cancel', () => {
    const onClose = vi.fn()
    render(<CreatePostModal isOpen={true} onClose={onClose} circle={mockCircle} />)
    
    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelButton)
    
    expect(onClose).toHaveBeenCalled()
  })
})
