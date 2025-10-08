import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ResourceLibraryPage from './ResourceLibraryPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

vi.mock('../data/mockResources', () => ({
  mockResources: {
    meditations: [
      { id: 1, title: 'Morning Calm', theme: 'Start your day', duration: 10, difficulty: 'Beginner', instructor: 'Sarah' }
    ],
    articles: [
      { id: 1, title: 'Understanding Anxiety', summary: 'Learn about anxiety', readTime: 5, author: 'Dr. Smith' }
    ],
    crisisResources: [
      { id: 1, name: 'Crisis Helpline', description: 'Test', number: '988', hours: '24/7', languages: 'English' }
    ],
    selfHelpGuides: [
      { id: 1, title: 'Grounding Technique', description: 'Test', steps: ['Step 1', 'Step 2'] }
    ]
  }
}))

vi.mock('../components/resources/BreathingExercise', () => ({
  default: () => <div data-testid="breathing-exercise">Breathing Exercise</div>
}))

describe('ResourceLibraryPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders page with header', () => {
    render(<ResourceLibraryPage />)
    expect(screen.getByText('Resource Library')).toBeInTheDocument()
    expect(screen.getByText(/tools and resources/i)).toBeInTheDocument()
  })

  it('displays search bar', () => {
    render(<ResourceLibraryPage />)
    expect(screen.getByPlaceholderText(/find resources/i)).toBeInTheDocument()
  })

  it('shows category tabs', () => {
    render(<ResourceLibraryPage />)
    expect(screen.getByText('Breathing Exercises')).toBeInTheDocument()
    expect(screen.getByText('Guided Meditations')).toBeInTheDocument()
    expect(screen.getByText('Articles & Tips')).toBeInTheDocument()
    expect(screen.getByText('Crisis Resources')).toBeInTheDocument()
  })

  it('shows breathing exercises by default', () => {
    render(<ResourceLibraryPage />)
    expect(screen.getByTestId('breathing-exercise')).toBeInTheDocument()
  })

  it('switches to meditation tab', () => {
    render(<ResourceLibraryPage />)
    fireEvent.click(screen.getByText('Guided Meditations'))
    expect(screen.getByText('Morning Calm')).toBeInTheDocument()
  })

  it('switches to articles tab', () => {
    render(<ResourceLibraryPage />)
    fireEvent.click(screen.getByText('Articles & Tips'))
    expect(screen.getByText('Understanding Anxiety')).toBeInTheDocument()
  })

  it('switches to crisis tab', () => {
    render(<ResourceLibraryPage />)
    fireEvent.click(screen.getByText('Crisis Resources'))
    expect(screen.getByText('Crisis Helpline')).toBeInTheDocument()
  })

  it('displays emergency notice in crisis tab', () => {
    render(<ResourceLibraryPage />)
    fireEvent.click(screen.getByText('Crisis Resources'))
    expect(screen.getByText(/if you're in immediate danger/i)).toBeInTheDocument()
  })

  it('toggles bookmarks filter', () => {
    render(<ResourceLibraryPage />)
    const bookmarkButton = screen.getByText('Bookmarks Only')
    fireEvent.click(bookmarkButton)
    expect(bookmarkButton).toHaveClass('bg-primary')
  })

  it('bookmarks meditation', () => {
    render(<ResourceLibraryPage />)
    fireEvent.click(screen.getByText('Guided Meditations'))
    const heartButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg')
    )
    fireEvent.click(heartButtons[0])
    const bookmarks = JSON.parse(localStorage.getItem('safespace_bookmarks'))
    expect(bookmarks).toContain('meditation-1')
  })

  it('bookmarks article', () => {
    render(<ResourceLibraryPage />)
    fireEvent.click(screen.getByText('Articles & Tips'))
    const heartButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg')
    )
    fireEvent.click(heartButtons[0])
    const bookmarks = JSON.parse(localStorage.getItem('safespace_bookmarks'))
    expect(bookmarks).toContain('article-1')
  })

  it('filters resources by search', () => {
    render(<ResourceLibraryPage />)
    fireEvent.click(screen.getByText('Guided Meditations'))
    const searchInput = screen.getByPlaceholderText(/find resources/i)
    fireEvent.change(searchInput, { target: { value: 'Morning' } })
    expect(screen.getByText('Morning Calm')).toBeInTheDocument()
  })

  it('shows self-help guides in crisis tab', () => {
    render(<ResourceLibraryPage />)
    fireEvent.click(screen.getByText('Crisis Resources'))
    expect(screen.getByText('Grounding Technique')).toBeInTheDocument()
  })
})
