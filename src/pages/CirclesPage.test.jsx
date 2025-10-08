import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CirclesPage from './CirclesPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

vi.mock('../data/mockCircles', () => ({
  mockCircles: [
    { id: 1, name: 'Anxiety Support', description: 'Test', category: 'anxiety', members: 100, posts: 50, icon: '😰' },
    { id: 2, name: 'Depression Help', description: 'Test', category: 'depression', members: 80, posts: 30, icon: '😢' }
  ]
}))

vi.mock('../components/CircleCard', () => ({
  default: ({ circle, isJoined, onJoin, onLeave, onClick }) => (
    <div data-testid="circle-card">
      <span>{circle.name}</span>
      <button onClick={() => onClick(circle.id)}>View</button>
      {isJoined ? (
        <button onClick={() => onLeave(circle.id)}>Leave</button>
      ) : (
        <button onClick={() => onJoin(circle.id)}>Join</button>
      )}
    </div>
  )
}))

vi.mock('../components/FilterModal', () => ({
  default: ({ isOpen, onClose }) => isOpen ? <div data-testid="filter-modal"><button onClick={onClose}>Close</button></div> : null
}))

vi.mock('../components/common/EmptyState', () => ({
  EmptyStates: {
    NoCircles: ({ onAction }) => <div><button onClick={onAction}>Discover</button></div>,
    NoSearchResults: ({ onAction }) => <div><button onClick={onAction}>Clear</button></div>
  }
}))

vi.mock('../components/common/LoadingState', () => ({
  default: () => <div data-testid="loading">Loading...</div>
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('CirclesPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders page with header', () => {
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    expect(screen.getByText('Support Circles')).toBeInTheDocument()
    expect(screen.getByText(/find your community/i)).toBeInTheDocument()
  })

  it('displays search bar', () => {
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    expect(screen.getByPlaceholderText(/search circles/i)).toBeInTheDocument()
  })

  it('shows discover and my circles tabs', () => {
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    expect(screen.getByText('Discover')).toBeInTheDocument()
    expect(screen.getByText(/my circles/i)).toBeInTheDocument()
  })

  it('displays circles from mock data', () => {
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    expect(screen.getByText('Anxiety Support')).toBeInTheDocument()
    expect(screen.getByText('Depression Help')).toBeInTheDocument()
  })

  it('joins circle and updates localStorage', () => {
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    const joinButtons = screen.getAllByText('Join')
    fireEvent.click(joinButtons[0])
    const saved = JSON.parse(localStorage.getItem('safespace_circles'))
    expect(saved).toContain(1)
  })

  it('leaves circle and updates localStorage', () => {
    localStorage.setItem('safespace_circles', JSON.stringify([1]))
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    const leaveButton = screen.getByText('Leave')
    fireEvent.click(leaveButton)
    const saved = JSON.parse(localStorage.getItem('safespace_circles'))
    expect(saved).not.toContain(1)
  })

  it('navigates to circle on click', () => {
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    const viewButtons = screen.getAllByText('View')
    fireEvent.click(viewButtons[0])
    expect(mockNavigate).toHaveBeenCalledWith('/circles/1')
  })

  it('filters circles by search query', () => {
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    const searchInput = screen.getByPlaceholderText(/search circles/i)
    fireEvent.change(searchInput, { target: { value: 'Anxiety' } })
    expect(screen.getByText('Anxiety Support')).toBeInTheDocument()
  })

  it('opens filter modal', () => {
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    const filterButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'))
    fireEvent.click(filterButton)
    expect(screen.getByTestId('filter-modal')).toBeInTheDocument()
  })

  it('switches to my circles tab', () => {
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    fireEvent.click(screen.getByText(/my circles/i))
    expect(screen.getByText(/my circles/i)).toHaveClass('bg-primary')
  })

  it('shows empty state when no circles joined', () => {
    render(<MemoryRouter><CirclesPage /></MemoryRouter>)
    fireEvent.click(screen.getByText(/my circles/i))
    expect(screen.getByText('Discover')).toBeInTheDocument()
  })
})
