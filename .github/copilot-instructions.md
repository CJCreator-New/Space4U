git init
git add .
git commit -m "Initial commit"# Space4U - AI Coding Guidelines

## Project Overview
Space4U is a comprehensive mental health support web application built with React, Vite, and Tailwind CSS. It features a local-first architecture with optional Supabase backend sync, focusing on privacy and user wellness.

## Architecture Patterns

### Core Application Structure
- **Entry Point**: `src/App.jsx` manages routing, onboarding flow, and authentication
- **Layout System**: `src/components/Layout.jsx` provides responsive navigation wrapper
- **Route Protection**: `src/components/ProtectedRoute.jsx` guards authenticated routes
- **Error Boundaries**: `src/components/ErrorBoundary.jsx` and `SafeComponent.jsx` provide resilience

### Data Management (Local-First)
```javascript
// Always use safespace_ prefix for localStorage keys
const moods = JSON.parse(localStorage.getItem('safespace_moods') || '{}')
const settings = JSON.parse(localStorage.getItem('safespace_settings') || '{}')

// Merge with defaults for data integrity
const DEFAULT_SETTINGS = { theme: 'light', notifications: true }
const settings = { ...DEFAULT_SETTINGS, ...saved }
```

### Component Organization
- **Feature-Based**: Components organized by feature (`components/mood/`, `components/gratitude/`)
- **Shared Components**: Common UI in `components/common/`
- **Page Components**: Route-based pages in `src/pages/` (26 total pages)

## Development Patterns

### Component Structure
```jsx
import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'

function ComponentName({ prop1, prop2 = defaultValue, onAction }) {
  const [state, setState] = useState(initialValue)
  const [loading, setLoading] = useState(false)

  // Component logic here

  return (
    <div className="p-4 bg-surface rounded-xl">
      {/* Component JSX */}
    </div>
  )
}

export default ComponentName
```

### Custom Hooks Usage
- **Data Hooks**: `useMoods()`, `useAuth()` manage state and side effects
- **UI Hooks**: `useTheme()`, `useToast()` handle UI interactions
- **Real-time Hooks**: `useRealtimePosts()`, `useOnlineUsers()` for live features

### Styling Conventions
```jsx
// Use semantic color tokens
className="bg-primary text-white hover:bg-primary-light"

// Conditional styling with template literals
className={`px-4 py-2 rounded-xl transition-colors ${
  isActive ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
}`}
```

### Import Organization
```javascript
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { calculateMoodScore } from '../utils/moodAnalysis'
import MoodCard from './MoodCard'
```

## Key Workflows

### Adding New Features
1. **Create Page**: Add to `src/pages/` with proper routing in `App.jsx`
2. **Add Components**: Feature-specific components in `components/featureName/`
3. **Data Management**: Use localStorage with `safespace_` prefix or Supabase service
4. **Navigation**: Update `src/components/Navigation.jsx` for new routes

### Testing Setup
```bash
# Run tests with coverage
npm run test:coverage

# Test specific component
npm test -- MoodTracker.test.jsx

# Watch mode for development
npm test -- --watch
```

### Build & Deployment
```bash
# Development server
npm run dev

# Production build
npm run build

# Preview build locally
npm run preview
```

## Data Patterns

### Mood Tracking Structure
```javascript
const moodEntry = {
  date: '2024-01-15',
  mood: 4, // 1-5 scale
  note: 'Feeling good today',
  tags: ['work', 'exercise'],
  timestamp: Date.now()
}
```

### Local Storage Keys
- `safespace_moods`: Daily mood entries
- `safespace_user`: User profile and preferences
- `safespace_settings`: App configuration
- `safespace_premium`: Subscription status
- `safespace_badges`: Achievement progress

### Supabase Integration
```javascript
// Services handle backend operations
import { moodService } from '../services/moodService'

// Hooks manage local vs remote data
const { moods, saveMood } = useMoods() // Automatically syncs
```

## Error Handling

### Component-Level Errors
```jsx
import SafeComponent from './SafeComponent'

function MyComponent() {
  return (
    <SafeComponent fallback={<div>Something went wrong</div>}>
      {/* Component content */}
    </SafeComponent>
  )
}
```

### Async Operations
```javascript
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const handleAction = async () => {
  setLoading(true)
  setError('')
  try {
    await someAsyncOperation()
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

## Privacy & Security

### Data Handling Rules
- **Never transmit sensitive data** without explicit user consent
- **Local storage only** for personal mental health data
- **Anonymous by default** - no personal identifiers required
- **Data export capability** - users can download their data anytime

### Content Moderation
- Implement basic content filtering for user-generated posts
- Use appropriate warning labels for sensitive mental health topics
- Respect user privacy settings in community features

## Performance Considerations

### Bundle Optimization
- **Lazy loading**: Use `React.lazy()` for route-based code splitting
- **Image optimization**: Compress and serve appropriate image sizes
- **Bundle analysis**: Run `npm run analyze` to identify large dependencies

### React Performance
```jsx
// Use useMemo for expensive calculations
const moodStats = useMemo(() => calculateMoodStats(moods), [moods])

// Optimize re-renders with useCallback
const handleMoodChange = useCallback((mood) => {
  setSelectedMood(mood)
}, [])
```

## Testing Guidelines

### Component Testing
```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import MoodTracker from './MoodTracker'

test('logs mood successfully', () => {
  render(<MoodTracker />)
  const moodButton = screen.getByLabelText('Good')
  fireEvent.click(moodButton)
  expect(screen.getByText('Mood logged!')).toBeInTheDocument()
})
```

### Coverage Requirements
- **Utilities**: 90%+ coverage
- **Components**: 80%+ coverage
- **Pages**: 70%+ coverage
- **Overall**: 75%+ coverage

## File Naming Conventions

### Components
- **PascalCase**: `MoodTracker.jsx`, `CreatePostModal.jsx`
- **Feature Prefix**: `mood/MoodCalendar.jsx`, `gratitude/GratitudeEntry.jsx`

### Utilities & Data
- **camelCase**: `moodAnalysis.js`, `badgeSystem.js`
- **Mock Prefix**: `mockPosts.js`, `mockResources.js`

### Test Files
- **Component Tests**: `ComponentName.test.jsx`
- **Utility Tests**: `utilityName.test.js`

## Common Patterns

### Modal Implementation
```jsx
const [isOpen, setIsOpen] = useState(false)

useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }
  return () => {
    document.body.style.overflow = 'unset'
  }
}, [isOpen])

return (
  <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    {/* Modal content */}
  </Modal>
)
```

### Form Handling
```jsx
const [formData, setFormData] = useState({ note: '', tags: [] })

const handleSubmit = (e) => {
  e.preventDefault()
  // Process form data
  localStorage.setItem('safespace_form_data', JSON.stringify(formData))
}
```

### Badge System Integration
```javascript
import { addPoints, checkMoodLogBadges } from '../utils/badgeSystem'

// Award points for actions
addPoints('mood-logged', 10)

// Check for new badges
const newBadges = checkMoodLogBadges(userMoodCount)
```

## Quality Assurance

### Pre-commit Checks
- **ESLint**: `npm run lint` for code quality
- **TypeScript**: `npm run type-check` for type safety
- **Tests**: `npm test` before committing

### Manual Testing Checklist
- [ ] Responsive design (320px-1920px)
- [ ] Dark/light theme compatibility
- [ ] Offline functionality
- [ ] Data persistence across sessions
- [ ] Error boundary recovery

## Key Files to Reference

### Architecture
- `src/App.jsx` - Main application and routing
- `src/components/Layout.jsx` - App structure
- `tailwind.config.js` - Design system configuration

### Data Management
- `src/hooks/useMoods.js` - Mood data management
- `src/services/moodService.js` - Backend mood operations
- `src/utils/badgeSystem.js` - Achievement system

### Components
- `src/components/MoodTracker.jsx` - Core mood logging
- `src/components/Navigation.jsx` - App navigation
- `src/components/SafeComponent.jsx` - Error resilience

### Configuration
- `vite.config.js` - Build configuration
- `package.json` - Dependencies and scripts
- `src/index.css` - Global styles and themes</content>
<parameter name="filePath">c:\Users\HP\OneDrive\Desktop\Projects\VS Code\Space4U\.github\copilot-instructions.md