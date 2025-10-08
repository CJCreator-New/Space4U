import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

export function renderWithRouter(ui, { route = '/', ...renderOptions } = {}) {
  window.history.pushState({}, 'Test page', route)
  
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>,
    renderOptions
  )
}

export const mockMoodData = [
  { date: '2025-01-01', mood: 4, note: 'Great day!' },
  { date: '2025-01-02', mood: 3, note: 'Okay day' },
  { date: '2025-01-03', mood: 5, note: 'Amazing!' }
]

export const mockUserProfile = {
  username: 'TestUser',
  avatar: 'avatar1',
  interests: ['anxiety', 'depression'],
  joinedDate: '2025-01-01'
}

export const mockCircles = [
  { id: 'anxiety', name: 'Anxiety Support', members: 1234 },
  { id: 'depression', name: 'Depression Support', members: 2345 }
]

export const mockPosts = [
  { id: '1', content: 'Test post', author: 'User1', circle: 'anxiety', timestamp: '2025-01-01' }
]

export function setupLocalStorage(data = {}) {
  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(key, JSON.stringify(value))
  })
}
