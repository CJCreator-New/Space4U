import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OnboardingFlow from './OnboardingFlow'

vi.mock('./WelcomeScreen', () => ({
  default: ({ onNext }) => (
    <div>
      <h1>Welcome</h1>
      <button onClick={() => onNext({})}>Get Started</button>
    </div>
  )
}))

vi.mock('./UsernameStep', () => ({
  default: ({ onNext, onBack }) => (
    <div>
      <h1>Username</h1>
      <button onClick={onBack}>Back</button>
      <button onClick={() => onNext({ username: 'TestUser' })}>Next</button>
    </div>
  )
}))

vi.mock('./AvatarStep', () => ({
  default: ({ onNext, onBack }) => (
    <div>
      <h1>Avatar</h1>
      <button onClick={onBack}>Back</button>
      <button onClick={() => onNext({ avatar: '🐻' })}>Next</button>
    </div>
  )
}))

vi.mock('./InterestStep', () => ({
  default: ({ onNext, onBack }) => (
    <div>
      <h1>Interests</h1>
      <button onClick={onBack}>Back</button>
      <button onClick={() => onNext({ interests: ['anxiety'] })}>Next</button>
    </div>
  )
}))

vi.mock('./AgeConfirmationStep', () => ({
  default: ({ onNext }) => (
    <div>
      <h1>Age Confirmation</h1>
      <button onClick={() => onNext({ ageConfirmed: true })}>Confirm</button>
    </div>
  )
}))

describe('OnboardingFlow', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should render welcome screen first', () => {
    render(<OnboardingFlow onComplete={vi.fn()} />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  it('should progress through steps', () => {
    render(<OnboardingFlow onComplete={vi.fn()} />)
    
    fireEvent.click(screen.getByText('Get Started'))
    expect(screen.getByText('Username')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Avatar')).toBeInTheDocument()
  })

  it('should allow going back', () => {
    render(<OnboardingFlow onComplete={vi.fn()} />)
    
    fireEvent.click(screen.getByText('Get Started'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Back'))
    
    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('should save data to localStorage on completion', () => {
    const onComplete = vi.fn()
    render(<OnboardingFlow onComplete={onComplete} />)
    
    fireEvent.click(screen.getByText('Get Started'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Confirm'))
    
    expect(localStorage.getItem('safespace_onboarding_complete')).toBe('true')
    expect(onComplete).toHaveBeenCalled()
  })

  it('should call onComplete callback', () => {
    const onComplete = vi.fn()
    render(<OnboardingFlow onComplete={onComplete} />)
    
    fireEvent.click(screen.getByText('Get Started'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Confirm'))
    
    expect(onComplete).toHaveBeenCalled()
  })
})
