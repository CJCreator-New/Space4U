# Development Guidelines & Standards

## Code Quality Standards

### File Structure & Naming
- **Component Files**: Use PascalCase for React components (e.g., `SettingsPage.jsx`, `CreatePostModal.jsx`)
- **Utility Files**: Use camelCase for utility modules (e.g., `badgeSystem.js`, `moodAnalysis.js`)
- **Data Files**: Prefix mock data files with "mock" (e.g., `mockResources.js`, `mockPosts.js`)
- **File Extensions**: Use `.jsx` for React components, `.js` for utilities and data files

### Import Organization
- **React Imports First**: Always import React hooks first
- **External Libraries**: Import third-party libraries after React
- **Internal Imports**: Import local components, utilities, and data last
- **Destructuring**: Use destructured imports for multiple items from same module

```javascript
import { useState, useEffect } from 'react'
import { X, Tag, AlertTriangle } from 'lucide-react'
import { calculateAverageMood, detectWeekdayPatterns } from '../utils/moodAnalysis'
```

### Component Structure Standards
- **Functional Components**: Use function declarations, not arrow functions for main components
- **Props Destructuring**: Destructure props in function parameters when practical
- **Default Props**: Define default values using destructuring defaults
- **Export Pattern**: Use default exports for main components

```javascript
function ComponentName({ prop1, prop2 = defaultValue }) {
  // Component logic
}

export default ComponentName
```

## State Management Patterns

### Local Storage Integration
- **Consistent Keys**: Use `safespace_` prefix for all localStorage keys
- **JSON Serialization**: Always use JSON.parse/stringify for complex data
- **Error Handling**: Provide fallback values with `|| '{}'` or `|| '[]'`
- **Data Validation**: Merge with default objects to ensure data integrity

```javascript
const DEFAULT_SETTINGS = { /* default structure */ }
const saved = localStorage.getItem('safespace_settings')
const settings = saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
```

### State Initialization
- **useState with Functions**: Use function form for complex initial state
- **Multiple State Variables**: Prefer multiple useState calls over single complex object
- **Loading States**: Always include loading states for async operations
- **Error States**: Include error handling state variables

```javascript
const [settings, setSettings] = useState(DEFAULT_SETTINGS)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
```

## UI/UX Patterns

### Styling Conventions
- **Tailwind Classes**: Use utility-first approach with Tailwind CSS
- **Conditional Styling**: Use template literals for dynamic classes
- **Color System**: Use semantic color names (`text-primary`, `bg-surface`)
- **Responsive Design**: Apply responsive prefixes (`md:`, `lg:`) consistently

```javascript
className={`px-4 py-2 rounded-xl font-medium transition-colors ${
  isActive ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
}`}
```

### Interactive Elements
- **Button States**: Always include hover, disabled, and loading states
- **Transitions**: Use `transition-colors` or `transition-all` for smooth interactions
- **Loading Indicators**: Use Lucide icons with `animate-spin` for loading states
- **Accessibility**: Include proper ARIA labels and keyboard navigation

### Modal Patterns
- **Overlay Structure**: Use fixed positioning with backdrop blur
- **Animation Classes**: Apply slide-up animations for mobile-first modals
- **Escape Handling**: Always implement ESC key and backdrop click to close
- **Body Scroll Lock**: Prevent background scrolling when modal is open

```javascript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }
  return () => {
    document.body.style.overflow = 'unset'
  }
}, [isOpen])
```

## Data Handling Patterns

### Mock Data Structure
- **Consistent IDs**: Use timestamp-based or string-based unique identifiers
- **Rich Metadata**: Include creation timestamps, author info, and categorization
- **Nested Objects**: Structure data with clear hierarchies and relationships
- **Extensible Design**: Design data structures to accommodate future features

```javascript
export const mockResources = {
  articles: [
    {
      id: 'understanding-anxiety',
      title: 'Understanding Anxiety',
      author: 'Dr. Sarah Chen',
      readTime: 5,
      content: `# Markdown content here`,
      tags: ['anxiety', 'education'],
      publishedAt: '2024-01-15'
    }
  ]
}
```

### Data Processing
- **Utility Functions**: Create reusable functions for common data operations
- **Date Handling**: Use consistent date formatting and parsing
- **Filtering & Sorting**: Implement chainable data transformation methods
- **Validation**: Include data validation before processing

## Component Communication

### Props Patterns
- **Callback Props**: Use `onEventName` pattern for event handlers
- **Data Props**: Pass minimal required data, not entire objects when possible
- **Optional Props**: Use destructuring defaults for optional properties
- **Prop Validation**: Include PropTypes or TypeScript for type safety

```javascript
function CreatePostModal({ isOpen, onClose, circle, onPostCreated }) {
  // Component implementation
}
```

### Event Handling
- **Async Operations**: Always handle loading and error states
- **User Feedback**: Provide immediate feedback for user actions
- **Optimistic Updates**: Update UI immediately, then sync with storage
- **Error Recovery**: Include retry mechanisms and graceful degradation

## Performance Optimization

### React Optimization
- **useEffect Dependencies**: Always include proper dependency arrays
- **Conditional Rendering**: Use early returns for loading/error states
- **Event Listeners**: Clean up event listeners in useEffect cleanup
- **Memory Management**: Remove timeouts and intervals in cleanup functions

### Data Optimization
- **Lazy Loading**: Load data only when needed
- **Caching Strategy**: Cache computed values and API responses
- **Batch Updates**: Group related state updates together
- **Debouncing**: Implement debouncing for search and input handlers

## Error Handling

### User-Facing Errors
- **Toast Notifications**: Use temporary toast messages for success/error feedback
- **Inline Validation**: Show validation errors near relevant form fields
- **Graceful Degradation**: Provide fallback UI when features fail
- **Clear Messaging**: Use human-readable error messages

### Development Errors
- **Console Logging**: Use descriptive console messages for debugging
- **Error Boundaries**: Implement error boundaries for component isolation
- **Fallback Values**: Always provide sensible defaults for missing data
- **Type Checking**: Use TypeScript or PropTypes for runtime validation

## Security & Privacy

### Data Protection
- **Local Storage Only**: Never transmit sensitive data to external servers
- **Data Sanitization**: Sanitize user input before storage or display
- **Privacy First**: Design features with privacy as default setting
- **Secure Defaults**: Use secure configurations by default

### Content Security
- **XSS Prevention**: Use React's built-in XSS protection
- **Input Validation**: Validate all user inputs on client side
- **Content Filtering**: Implement content moderation for user-generated content
- **Safe Rendering**: Use proper escaping for dynamic content

## Testing Considerations

### Component Testing
- **User Interactions**: Test user flows and interactions
- **State Changes**: Verify state updates work correctly
- **Error Scenarios**: Test error handling and edge cases
- **Accessibility**: Test keyboard navigation and screen reader compatibility

### Integration Testing
- **Data Flow**: Test data flow between components
- **Storage Integration**: Test localStorage read/write operations
- **Route Navigation**: Test navigation between pages
- **Feature Integration**: Test complete user workflows

## Documentation Standards

### Code Comments
- **Complex Logic**: Comment complex algorithms and business logic
- **API Interfaces**: Document function parameters and return values
- **Configuration**: Explain configuration objects and their purposes
- **Workarounds**: Document any temporary fixes or workarounds

### README Updates
- **Feature Documentation**: Document new features and their usage
- **Setup Instructions**: Keep setup and installation instructions current
- **API Changes**: Document breaking changes and migration paths
- **Contributing Guidelines**: Maintain clear contribution guidelines