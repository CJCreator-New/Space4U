import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from './ProfilePage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('safespace_user', JSON.stringify({ username: 'TestUser', avatar: '😊' }))
    localStorage.setItem('safespace_moods', JSON.stringify({}))
    localStorage.setItem('safespace_user_posts', JSON.stringify([]))
    localStorage.setItem('safespace_user_circles', JSON.stringify([]))
    vi.clearAllMocks()
  })

  it('renders profile header', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    expect(screen.getByText('TestUser')).toBeInTheDocument()
  })

  it('displays user avatar', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    expect(screen.getByText('😊')).toBeInTheDocument()
  })

  it('shows mood journey stats', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    expect(screen.getByText('Mood Journey')).toBeInTheDocument()
    expect(screen.getByText(/current streak/i)).toBeInTheDocument()
  })

  it('shows community stats', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText(/circles joined/i)).toBeInTheDocument()
  })

  it('shows achievements section', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    expect(screen.getByText('Achievements')).toBeInTheDocument()
    expect(screen.getByText(/badges earned/i)).toBeInTheDocument()
  })

  it('opens edit modal when edit clicked', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    const editButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'))
    fireEvent.click(editButtons[0])
    expect(screen.getByText('Edit Profile')).toBeInTheDocument()
  })

  it('updates profile when saved', async () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    const editButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'))
    fireEvent.click(editButtons[0])
    
    const usernameInput = screen.getByPlaceholderText(/enter username/i)
    fireEvent.change(usernameInput, { target: { value: 'NewUser' } })
    
    fireEvent.click(screen.getByText('Save Changes'))
    
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('safespace_user'))
      expect(saved.username).toBe('NewUser')
    })
  })

  it('exports data when clicked', () => {
    const createElementSpy = vi.spyOn(document, 'createElement')
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    fireEvent.click(screen.getByText(/export my data/i))
    expect(createElementSpy).toHaveBeenCalledWith('a')
  })

  it('opens delete modal', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    fireEvent.click(screen.getByText(/delete account/i))
    expect(screen.getByText('Delete Account')).toBeInTheDocument()
  })

  it('requires DELETE confirmation', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    fireEvent.click(screen.getByText(/delete account/i))
    const deleteButton = screen.getAllByText('Delete Account')[1]
    expect(deleteButton).toBeDisabled()
  })

  it('navigates to insights', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    fireEvent.click(screen.getByText('View Insights'))
    expect(mockNavigate).toHaveBeenCalledWith('/insights')
  })

  it('navigates to circles', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    fireEvent.click(screen.getByText('My Circles'))
    expect(mockNavigate).toHaveBeenCalledWith('/circles')
  })

  it('navigates to settings', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    fireEvent.click(screen.getByText('Settings'))
    expect(mockNavigate).toHaveBeenCalledWith('/settings')
  })

  it('shows activity feed', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    expect(screen.getByText('Your Recent Activity')).toBeInTheDocument()
  })

  it('dismisses premium banner', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>)
    const closeButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg'))
    fireEvent.click(closeButtons[0])
    expect(localStorage.getItem('safespace_premium_banner_dismissed')).toBe('true')
  })
})
