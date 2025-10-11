# Design System Quick Reference

## 🚀 Quick Start

### Import Components
```jsx
import Button from './components/common/Button'
import Card from './components/common/Card'
import Modal from './components/common/Modal'
import FormInput from './components/common/FormInput'
import SkeletonLoader from './components/common/SkeletonLoader'
import EmptyState from './components/common/EmptyState'
import ProgressBar from './components/common/ProgressBar'
import Toast from './components/common/Toast'
```

### Import Hooks
```jsx
import { useTheme } from './contexts/ThemeContext'
import { useToast } from './hooks/useToast'
import { useHaptic } from './hooks/useHaptic'
import { usePullToRefresh } from './hooks/usePullToRefresh'
```

## 📦 Component Cheat Sheet

### Button
```jsx
<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```
Variants: primary | secondary | outline | ghost | danger
Sizes: sm | md | lg

### Card
```jsx
<Card hover onClick={handleClick}>
  Content
</Card>
```

### Modal
```jsx
<Modal isOpen={open} onClose={close} title="Title" size="md">
  Content
</Modal>
```
Sizes: sm | md | lg | xl

### Form Input
```jsx
<FormInput
  label="Email"
  error="Error message"
  success="Success message"
  helperText="Helper text"
  required
/>
```

### Skeleton Loader
```jsx
<SkeletonLoader variant="card" count={3} />
```
Variants: card | text | title | avatar | button | list

### Empty State
```jsx
<EmptyState
  icon="📭"
  title="No items"
  description="Get started"
  action={handleAction}
  actionLabel="Create"
/>
```

### Progress Bar
```jsx
<ProgressBar current={3} total={5} showLabel />
```

## 🎨 CSS Classes

### Animations
- `animate-fadeIn` - Fade in
- `animate-slideUp` - Slide up
- `animate-scaleIn` - Scale in
- `animate-shimmer` - Loading shimmer
- `hover-lift` - Lift on hover
- `active:scale-95` - Press feedback

### Colors
- `text-info` `bg-info`
- `text-success` `bg-success`
- `text-warning` `bg-warning`
- `text-error` `bg-error`

### Form States
- `input-error` - Error state
- `input-success` - Success state

### Utilities
- `touch-target` - 48x48px minimum
- `spinner` - Loading spinner
- `smooth-scroll` - Smooth scrolling

## 🎯 Common Patterns

### Loading → Empty → Data
```jsx
{loading ? (
  <SkeletonLoader variant="card" count={3} />
) : data.length === 0 ? (
  <EmptyState icon="📭" title="No data" />
) : (
  data.map(item => <Card key={item.id}>{item}</Card>)
)}
```

### Form with Validation
```jsx
<FormInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
<Button type="submit" loading={submitting}>
  Submit
</Button>
```

### Modal with Progress
```jsx
<Modal isOpen={open} onClose={close} title="Upload">
  <ProgressBar current={progress} total={100} />
  <Button loading={uploading}>Upload</Button>
</Modal>
```

### Toast Notifications
```jsx
const { success, error } = useToast()

const handleAction = async () => {
  try {
    await doSomething()
    success('Success!')
  } catch (err) {
    error('Failed!')
  }
}
```

### Dark Mode Toggle
```jsx
const { theme, toggleTheme } = useTheme()

<button onClick={toggleTheme}>
  {theme === 'dark' ? '🌞' : '🌙'}
</button>
```

### Haptic Feedback
```jsx
const { vibrate } = useHaptic()

<button onClick={() => {
  vibrate('medium')
  handleAction()
}}>
  Action
</button>
```

### Pull to Refresh
```jsx
const { isPulling, pullDistance } = usePullToRefresh(async () => {
  await refreshData()
})

<div style={{ transform: `translateY(${pullDistance}px)` }}>
  {isPulling && <div>Release to refresh</div>}
  <Content />
</div>
```

## 📏 Spacing Scale

- `p-2` / `m-2` = 8px
- `p-4` / `m-4` = 16px
- `p-6` / `m-6` = 24px
- `p-8` / `m-8` = 32px
- `gap-2` = 8px
- `gap-4` = 16px

## 🎨 Color Palette

- Primary: `#6366F1`
- Secondary: `#8B5CF6`
- Success: `#10B981`
- Warning: `#F59E0B`
- Danger: `#EF4444`
- Info: `#3B82F6`

## 📱 Touch Targets

- Minimum: 48x48px
- Spacing: 24px between elements
- Use `touch-target` class for icons

## ✨ Best Practices

1. **Always use Button component** instead of raw `<button>`
2. **Wrap cards in Card component** for consistency
3. **Use FormInput** for all form fields
4. **Show loading states** with SkeletonLoader
5. **Show empty states** with EmptyState
6. **Use haptic feedback** for important actions
7. **Support dark mode** with `dark:` classes
8. **Add animations** with `animate-*` classes
9. **Use semantic colors** (success, error, warning)
10. **Test on mobile** for touch targets and gestures

## 🐛 Troubleshooting

### Dark mode not working
- Ensure ThemeProvider wraps your app
- Use `dark:` prefix for dark mode styles

### Haptic not working
- Only works on native mobile or browsers with vibration API
- Gracefully degrades if not available

### Animations janky
- Use `will-change` for animated elements
- Reduce motion for accessibility

### Touch targets too small
- Use `touch-target` class
- Minimum 48x48px for all interactive elements

## 📚 Full Documentation

See `DESIGN_SYSTEM_COMPLETE.md` for comprehensive documentation.
