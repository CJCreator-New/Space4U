import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SettingsPage from './SettingsPage'

vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'auto',
    setLightTheme: vi.fn(),
    setDarkTheme: vi.fn(),
    setAutoTheme: vi.fn()
  })
}))

describe('SettingsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders settings page', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText(/customize your safespace experience/i)).toBeInTheDocument()
  })

  it('displays search bar', () => {
    render(<SettingsPage />)
    expect(screen.getByPlaceholderText(/search settings/i)).toBeInTheDocument()
  })

  it('shows developer mode toggle', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Developer Mode')).toBeInTheDocument()
  })

  it('toggles premium status', () => {
    render(<SettingsPage />)
    const toggles = screen.getAllByRole('button').filter(btn => 
      btn.className.includes('inline-flex')
    )
    fireEvent.click(toggles[0])
    const premium = JSON.parse(localStorage.getItem('safespace_premium'))
    expect(premium.isPremium).toBe(true)
  })

  it('expands notifications section', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Notifications'))
    expect(screen.getByText(/daily mood reminders/i)).toBeInTheDocument()
  })

  it('toggles daily reminder', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Notifications'))
    const toggles = screen.getAllByRole('button').filter(btn => 
      btn.className.includes('inline-flex')
    )
    fireEvent.click(toggles[1])
    const settings = JSON.parse(localStorage.getItem('safespace_settings'))
    expect(settings.notifications.dailyReminder).toBeDefined()
  })

  it('expands privacy section', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Privacy & Data'))
    expect(screen.getByText(/always post anonymously/i)).toBeInTheDocument()
  })

  it('exports data', () => {
    const createElementSpy = vi.spyOn(document, 'createElement')
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Privacy & Data'))
    fireEvent.click(screen.getByText('Export All Data'))
    expect(createElementSpy).toHaveBeenCalledWith('a')
  })

  it('opens delete account modal', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Privacy & Data'))
    fireEvent.click(screen.getByText('Delete My Account'))
    expect(screen.getByText('Delete Account?')).toBeInTheDocument()
  })

  it('expands appearance section', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Appearance'))
    expect(screen.getByText(/choose your preferred theme/i)).toBeInTheDocument()
  })

  it('shows theme options', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Appearance'))
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('Auto')).toBeInTheDocument()
  })

  it('expands language section', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Language'))
    expect(screen.getByText(/app language/i)).toBeInTheDocument()
  })

  it('expands accessibility section', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Accessibility'))
    expect(screen.getByText(/screen reader optimizations/i)).toBeInTheDocument()
  })

  it('expands account section', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Account'))
    expect(screen.getByText(/email \(optional\)/i)).toBeInTheDocument()
  })

  it('expands help section', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Help & Support'))
    expect(screen.getByText('FAQ')).toBeInTheDocument()
  })

  it('expands about section', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('About'))
    expect(screen.getByText(/app version/i)).toBeInTheDocument()
  })

  it('opens reset settings modal', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Reset All Settings'))
    expect(screen.getByText('Reset All Settings?')).toBeInTheDocument()
  })
})
