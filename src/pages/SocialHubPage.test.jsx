import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SocialHubPage from './SocialHubPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

vi.mock('../components/priority4/AccountabilityPartner', () => ({
  default: () => <div data-testid="accountability">Accountability Partner</div>
}))

vi.mock('../components/priority4/PeerSupport', () => ({
  default: () => <div data-testid="peer">Peer Support</div>
}))

vi.mock('../components/priority4/SupportRequests', () => ({
  default: () => <div data-testid="support">Support Requests</div>
}))

vi.mock('../components/priority4/MoodSuggestions', () => ({
  default: () => <div data-testid="suggestions">Mood Suggestions</div>
}))

describe('SocialHubPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page with header', () => {
    render(<SocialHubPage />)
    expect(screen.getByText('Social & Community')).toBeInTheDocument()
    expect(screen.getByText(/connect, support, and grow together/i)).toBeInTheDocument()
  })

  it('displays all tabs', () => {
    render(<SocialHubPage />)
    expect(screen.getByText('Accountability')).toBeInTheDocument()
    expect(screen.getByText('Peer Support')).toBeInTheDocument()
    expect(screen.getByText('Support Requests')).toBeInTheDocument()
    expect(screen.getByText('Suggestions')).toBeInTheDocument()
  })

  it('shows accountability partner by default', () => {
    render(<SocialHubPage />)
    expect(screen.getByTestId('accountability')).toBeInTheDocument()
  })

  it('switches to peer support tab', () => {
    render(<SocialHubPage />)
    fireEvent.click(screen.getByText('Peer Support'))
    expect(screen.getByTestId('peer')).toBeInTheDocument()
  })

  it('switches to support requests tab', () => {
    render(<SocialHubPage />)
    fireEvent.click(screen.getByText('Support Requests'))
    expect(screen.getByTestId('support')).toBeInTheDocument()
  })

  it('switches to suggestions tab', () => {
    render(<SocialHubPage />)
    fireEvent.click(screen.getByText('Suggestions'))
    expect(screen.getByTestId('suggestions')).toBeInTheDocument()
  })

  it('highlights active tab', () => {
    render(<SocialHubPage />)
    const accountabilityTab = screen.getByText('Accountability')
    expect(accountabilityTab).toHaveClass('bg-primary')
  })

  it('updates active tab on click', () => {
    render(<SocialHubPage />)
    fireEvent.click(screen.getByText('Peer Support'))
    const peerTab = screen.getByText('Peer Support')
    expect(peerTab).toHaveClass('bg-primary')
  })
})
