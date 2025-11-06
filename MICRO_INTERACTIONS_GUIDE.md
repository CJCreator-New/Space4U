# Micro-interactions & Animations - Developer Guide

Quick reference for using animations and micro-interactions in Space4U.

---

## Button Micro-interactions

### Basic Usage
```jsx
<button className="btn-micro px-4 py-2 bg-primary text-white rounded-xl">
  Click Me
</button>
```

### With Loading State
```jsx
<button 
  className={`btn-micro px-4 py-2 bg-primary text-white rounded-xl ${loading ? 'btn-loading' : ''}`}
  disabled={loading}
>
  {loading ? 'Saving' : 'Save'}
</button>
```

### With Success State
```jsx
{showSuccess ? (
  <span className="btn-success-checkmark">✓</span>
) : (
  'Save'
)}
```

---

## Toast Notifications

### Import
```javascript
import { toast } from '../utils/toast'
```

### Usage
```javascript
// Success (green)
toast.success('Mood saved successfully! 🎉')

// Error (red)
toast.error('Failed to save mood')

// Warning (orange)
toast.warning('Please fill all required fields')

// Info (blue)
toast.info('New feature available')

// Custom duration (default: 3000ms)
toast.success('Quick message', 1500)
```

---

## Confetti Celebrations

### Import
```javascript
import confetti from 'canvas-confetti'
```

### Basic Confetti
```javascript
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 }
})
```

### Custom Colors
```javascript
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
})
```

### Confetti Burst (Multiple)
```javascript
const duration = 3000
const end = Date.now() + duration

const frame = () => {
  confetti({
    particleCount: 2,
    angle: 60,
    spread: 55,
    origin: { x: 0 }
  })
  confetti({
    particleCount: 2,
    angle: 120,
    spread: 55,
    origin: { x: 1 }
  })

  if (Date.now() < end) {
    requestAnimationFrame(frame)
  }
}

frame()
```

---

## CSS Animation Classes

### Mood Animations
```jsx
// Bounce animation
<div className="mood-bounce">
  😊
</div>

// Streak counter
<div className="streak-count-up">
  5 days
</div>
```

### Tab Animations
```jsx
<div className="tab-fade">
  Tab content here
</div>
```

---

## Framer Motion Animations

### Page Transitions (Already Implemented)
```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  Page content
</motion.div>
```

### Card Hover Effect
```jsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="card"
>
  Card content
</motion.div>
```

### Stagger Children
```jsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Best Practices

### Animation Timing
- **Micro-interactions**: 100-200ms
- **Page transitions**: 200-300ms
- **Celebrations**: 500-1000ms
- **Loading states**: Indefinite (until complete)

### Performance
- Use `transform` and `opacity` for GPU acceleration
- Avoid animating `width`, `height`, `top`, `left`
- Keep particle counts reasonable (< 200)
- Clean up animations on unmount

### Accessibility
```jsx
// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!prefersReducedMotion) {
  // Run animation
}
```

### User Experience
- Don't block UI with animations
- Provide immediate feedback (< 100ms)
- Keep celebrations brief (< 2s)
- Allow users to dismiss notifications

---

## Common Patterns

### Save Button with Full Feedback
```jsx
const [saving, setSaving] = useState(false)
const [showSuccess, setShowSuccess] = useState(false)

const handleSave = async () => {
  setSaving(true)
  try {
    await saveData()
    
    setShowSuccess(true)
    confetti({ particleCount: 100, spread: 70 })
    toast.success('Saved successfully!')
    
    setTimeout(() => setShowSuccess(false), 1000)
  } catch (error) {
    toast.error('Failed to save')
  } finally {
    setSaving(false)
  }
}

return (
  <button 
    onClick={handleSave}
    disabled={saving || showSuccess}
    className={`btn-micro px-4 py-2 bg-primary text-white rounded-xl ${saving ? 'btn-loading' : ''}`}
  >
    {showSuccess ? (
      <span className="btn-success-checkmark">✓</span>
    ) : saving ? (
      'Saving'
    ) : (
      'Save'
    )}
  </button>
)
```

### Animated List
```jsx
import { motion, AnimatePresence } from 'framer-motion'

<AnimatePresence>
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>
```

### Modal with Slide Animation
```jsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
      >
        Modal content
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

## Troubleshooting

### Animation Not Working
1. Check if element has `position: relative` or `absolute`
2. Verify CSS class is applied correctly
3. Check browser console for errors
4. Test in different browsers

### Performance Issues
1. Reduce particle count in confetti
2. Use `will-change: transform` sparingly
3. Debounce rapid animations
4. Profile with Chrome DevTools

### Accessibility Issues
1. Add `prefers-reduced-motion` check
2. Provide alternative feedback (text, icons)
3. Test with screen readers
4. Ensure keyboard navigation works

---

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Canvas Confetti Docs](https://www.npmjs.com/package/canvas-confetti)
- [CSS Animations Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

---

**Last Updated**: January 2025  
**Maintained By**: Space4U Development Team
