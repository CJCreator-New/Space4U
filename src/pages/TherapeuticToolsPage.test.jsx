import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TherapeuticToolsPage from './TherapeuticToolsPage'

vi.mock('../components/SafeComponent', () => ({
  default: ({ children }) => <div>{children}</div>
}))

vi.mock('../components/therapeutic/CBTThoughtRecord', () => ({
  default: ({ onClose }) => <div data-testid="cbt-tool"><button onClick={onClose}>Close CBT</button></div>
}))

vi.mock('../components/therapeutic/DBTSkillsModule', () => ({
  default: ({ onClose }) => <div data-testid="dbt-tool"><button onClick={onClose}>Close DBT</button></div>
}))

vi.mock('../components/therapeutic/MindfulnessExercises', () => ({
  default: ({ onClose }) => <div data-testid="mindfulness-tool"><button onClick={onClose}>Close Mindfulness</button></div>
}))

vi.mock('../components/therapeutic/SleepHygieneTracker', () => ({
  default: ({ onClose }) => <div data-testid="sleep-tool"><button onClick={onClose}>Close Sleep</button></div>
}))

vi.mock('../components/therapeutic/CrisisSafetyPlan', () => ({
  default: ({ onClose }) => <div data-testid="crisis-tool"><button onClick={onClose}>Close Crisis</button></div>
}))

vi.mock('../components/therapeutic/MentalHealthAssessments', () => ({
  default: ({ onClose }) => <div data-testid="assessments-tool"><button onClick={onClose}>Close Assessments</button></div>
}))

describe('TherapeuticToolsPage', () => {
  it('renders page with header', () => {
    render(<MemoryRouter><TherapeuticToolsPage /></MemoryRouter>)
    expect(screen.getByText('Therapeutic Tools')).toBeInTheDocument()
    expect(screen.getByText(/evidence-based tools/i)).toBeInTheDocument()
  })

  it('displays all 6 therapeutic tools', () => {
    render(<MemoryRouter><TherapeuticToolsPage /></MemoryRouter>)
    expect(screen.getByText('CBT Thought Record')).toBeInTheDocument()
    expect(screen.getByText('DBT Skills')).toBeInTheDocument()
    expect(screen.getByText('Mindfulness')).toBeInTheDocument()
    expect(screen.getByText('Sleep Tracker')).toBeInTheDocument()
    expect(screen.getByText('Crisis Plan')).toBeInTheDocument()
    expect(screen.getByText('Assessments')).toBeInTheDocument()
  })

  it('opens CBT tool when clicked', () => {
    render(<MemoryRouter><TherapeuticToolsPage /></MemoryRouter>)
    fireEvent.click(screen.getByText('CBT Thought Record'))
    expect(screen.getByTestId('cbt-tool')).toBeInTheDocument()
  })

  it('opens DBT tool when clicked', () => {
    render(<MemoryRouter><TherapeuticToolsPage /></MemoryRouter>)
    fireEvent.click(screen.getByText('DBT Skills'))
    expect(screen.getByTestId('dbt-tool')).toBeInTheDocument()
  })

  it('opens Mindfulness tool when clicked', () => {
    render(<MemoryRouter><TherapeuticToolsPage /></MemoryRouter>)
    fireEvent.click(screen.getByText('Mindfulness'))
    expect(screen.getByTestId('mindfulness-tool')).toBeInTheDocument()
  })

  it('opens Sleep tool when clicked', () => {
    render(<MemoryRouter><TherapeuticToolsPage /></MemoryRouter>)
    fireEvent.click(screen.getByText('Sleep Tracker'))
    expect(screen.getByTestId('sleep-tool')).toBeInTheDocument()
  })

  it('opens Crisis tool when clicked', () => {
    render(<MemoryRouter><TherapeuticToolsPage /></MemoryRouter>)
    fireEvent.click(screen.getByText('Crisis Plan'))
    expect(screen.getByTestId('crisis-tool')).toBeInTheDocument()
  })

  it('opens Assessments tool when clicked', () => {
    render(<MemoryRouter><TherapeuticToolsPage /></MemoryRouter>)
    fireEvent.click(screen.getByText('Assessments'))
    expect(screen.getByTestId('assessments-tool')).toBeInTheDocument()
  })

  it('closes tool and returns to list', () => {
    render(<MemoryRouter><TherapeuticToolsPage /></MemoryRouter>)
    fireEvent.click(screen.getByText('CBT Thought Record'))
    fireEvent.click(screen.getByText('Close CBT'))
    expect(screen.getByText('Therapeutic Tools')).toBeInTheDocument()
  })

  it('displays tool descriptions', () => {
    render(<MemoryRouter><TherapeuticToolsPage /></MemoryRouter>)
    expect(screen.getByText(/challenge negative thought patterns/i)).toBeInTheDocument()
    expect(screen.getByText(/practice dialectical behavior therapy/i)).toBeInTheDocument()
  })
})
