import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EmotionTrackerPage from './EmotionTrackerPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

describe('EmotionTrackerPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should render page title', () => {
    render(<EmotionTrackerPage />)
    expect(screen.getByText('Emotion Tracker')).toBeInTheDocument()
  })

  it('should show empty state', () => {
    render(<EmotionTrackerPage />)
    expect(screen.getByText('Start Tracking Emotions')).toBeInTheDocument()
  })

  it('should open modal', () => {
    render(<EmotionTrackerPage />)
    fireEvent.click(screen.getByText('Log Emotion'))
    expect(screen.getByText('Primary Emotion')).toBeInTheDocument()
  })

  it('should select primary emotion', () => {
    render(<EmotionTrackerPage />)
    fireEvent.click(screen.getByText('Log Emotion'))
    fireEvent.click(screen.getByText('joy'))
    expect(screen.getByText('Optimistic')).toBeInTheDocument()
  })

  it('should save emotion log', () => {
    render(<EmotionTrackerPage />)
    fireEvent.click(screen.getByText('Log Emotion'))
    fireEvent.click(screen.getByText('joy'))
    fireEvent.click(screen.getByText('Save'))
    
    const saved = JSON.parse(localStorage.getItem('safespace_emotion_logs') || '[]')
    expect(saved.length).toBe(1)
    expect(saved[0].primary_emotion).toBe('joy')
  })

  it('should display saved logs', () => {
    const logs = [{ id: 1, primary_emotion: 'joy', secondary_emotions: [], intensity: 7, created_at: new Date().toISOString() }]
    localStorage.setItem('safespace_emotion_logs', JSON.stringify(logs))
    
    render(<EmotionTrackerPage />)
    expect(screen.getByText('joy')).toBeInTheDocument()
    expect(screen.getByText('Intensity: 7/10')).toBeInTheDocument()
  })

  it('should adjust intensity slider', () => {
    render(<EmotionTrackerPage />)
    fireEvent.click(screen.getByText('Log Emotion'))
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '8' } })
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('should close modal on cancel', () => {
    render(<EmotionTrackerPage />)
    fireEvent.click(screen.getByText('Log Emotion'))
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Primary Emotion')).not.toBeInTheDocument()
  })

  it('should disable save without primary emotion', () => {
    render(<EmotionTrackerPage />)
    fireEvent.click(screen.getByText('Log Emotion'))
    expect(screen.getByText('Save')).toBeDisabled()
  })
})
