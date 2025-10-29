# Space4U Design System

**Version:** 1.0  
**Last Updated:** January 2025  
**Purpose:** Therapeutic mental health application design system

---

## 1. Color System

### Primary Colors (Therapeutic)
```css
--primary: #6366F1        /* Trust, calm */
--primary-light: #818CF8  /* Hover states */
--primary-dark: #4F46E5   /* Active states */
--secondary: #8B5CF6      /* Mindfulness purple */
```

### Semantic Colors
```css
--success: #10B981        /* Growth, achievement */
--warning: #F59E0B        /* Caution, attention */
--danger: #EF4444         /* Crisis, error */
--info: #3B82F6           /* Information */
```

### Neutral Colors
```css
--background: #F8F9FE     /* App background */
--surface: #FFFFFF        /* Card background */
--text-primary: #1F2937   /* Main text */
--text-secondary: #6B7280 /* Secondary text */
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--gradient-success: linear-gradient(135deg, #10B981 0%, #059669 100%)
--gradient-warm: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)
--gradient-cool: linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)
```

---

## 2. Typography

### Font Families
```css
--font-primary: 'Inter', system-ui, sans-serif     /* Main UI */
--font-secondary: 'Poppins', system-ui, sans-serif /* Headings */
--font-accent: 'Nunito', system-ui, sans-serif     /* Friendly text */
```

### Font Sizes
```css
--text-xs: 14px
--text-sm: 16px
--text-md: 18px
--text-lg: 20px
--text-xl: 24px
--text-2xl: 32px
--text-3xl: 40px
```

### Font Weights
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

---

## 3. Spacing System (8pt Grid)

```css
--space-xs: 8px
--space-sm: 16px
--space-md: 24px
--space-lg: 32px
--space-xl: 48px
--space-2xl: 64px
```

---

## 4. Border Radius

```css
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
--radius-2xl: 32px
--radius-full: 9999px
```

---

## 5. Shadows

```css
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

---

## 6. Components

### Buttons

**Primary Button**
```jsx
<button className="btn-primary">
  Click Me
</button>
```
- Min height: 48px
- Padding: 0.875rem 1.5rem
- Border radius: 12px
- Gradient background
- Hover: translateY(-2px)

**Secondary Button**
```jsx
<button className="btn-secondary">
  Cancel
</button>
```

**Icon Button**
```jsx
<button className="touch-target">
  <Icon name="Heart" size={24} />
</button>
```
- Min size: 48x48px

### Cards

**Basic Card**
```jsx
<div className="card">
  Content
</div>
```
- Background: white
- Border radius: 16px
- Shadow: sm
- Hover: lift effect

**Animated Card**
```jsx
<AnimatedCard delay={0.1} hover>
  Content
</AnimatedCard>
```

### Inputs

**Text Input**
```jsx
<input className="input" type="text" />
```
- Min height: 48px
- Border radius: 12px
- Focus: primary color ring

**Textarea**
```jsx
<textarea className="input" rows={4} />
```

---

## 7. Icons

### Usage
```jsx
import { Icon } from './components/common/IconLibrary';

// Lucide (default)
<Icon name="Heart" library="lucide" size={24} color="#EF4444" animate />

// Heroicons
<Icon name="HeartIcon" library="hero-solid" size={24} animate />

// React Icons
<Icon name="FaHeart" library="react-icons" size={24} />
```

### Icon Sizes
- Small: 16px
- Medium: 20px
- Large: 24px
- XLarge: 32px
- 2XLarge: 48px

---

## 8. Animations

### Timing Functions
```javascript
gentle: { tension: 120, friction: 14 }
calm: { tension: 80, friction: 20 }
smooth: config.smooth
```

### Common Animations
```jsx
// Fade in
<motion.div {...fadeIn}>Content</motion.div>

// Slide up
<motion.div {...fadeInUp}>Content</motion.div>

// Scale in
<motion.div {...scaleIn}>Content</motion.div>

// Stagger children
<motion.div {...staggerChildren}>
  {items.map((item, i) => (
    <motion.div key={i} {...fadeInUp}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Hover Effects
```jsx
// Card hover
<motion.div {...cardHover}>Card</motion.div>

// Button press
<motion.button {...buttonPress}>Click</motion.button>
```

---

## 9. Breakpoints

```css
--breakpoint-sm: 480px   /* Mobile landscape */
--breakpoint-md: 768px   /* Tablet */
--breakpoint-lg: 992px   /* Desktop */
--breakpoint-xl: 1280px  /* Large desktop */
--breakpoint-2xl: 1536px /* Extra large */
```

### Usage
{% raw %}
```jsx
<Box 
  p={{ base: 4, md: 6, lg: 8 }}
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
>
  Responsive content
</Box>
```
{% endraw %}

---

## 10. Accessibility

### Touch Targets
- Minimum: 48x48px
- Comfortable: 56x56px
- Spacing: 8px between targets

### Color Contrast
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Critical actions: 7:1 recommended

### Focus States
```css
.focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
}
```

### Screen Reader
```jsx
<div role="status" aria-live="polite">
  Status message
</div>
```

---

## 11. Usage Examples

### Page Layout
{% raw %}
```jsx
import { Box, Container } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { pageTransition } from './utils/animations';

function Page() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="1200px" py={{ base: 4, md: 6 }}>
        <motion.div {...pageTransition}>
          <h1>Page Title</h1>
          <p>Content</p>
        </motion.div>
      </Container>
    </Box>
  );
}
```
{% endraw %}

### Feature Card
```jsx
import { AnimatedCard } from './components/common/AnimatedCard';
import { Icon } from './components/common/IconLibrary';

function FeatureCard({ icon, title, description }) {
  return (
    <AnimatedCard delay={0.1} hover>
      <div className="text-center p-6">
        <Icon name={icon} library="lucide" size={48} color="#6366F1" animate />
        <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </AnimatedCard>
  );
}
```

### Form
```jsx
import { AnimatedButton } from './components/common/AnimatedButton';

function Form() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input type="email" className="input w-full" />
      </div>
      <AnimatedButton variant="primary" type="submit">
        Submit
      </AnimatedButton>
    </form>
  );
}
```

---

## 12. Best Practices

### Do's ✅
- Use 8pt spacing grid
- Maintain 48px minimum touch targets
- Apply gentle animations (300-400ms)
- Use semantic colors
- Test with screen readers
- Support reduced motion
- Maintain 4.5:1 contrast ratio

### Don'ts ❌
- Don't use jarring animations
- Don't ignore accessibility
- Don't use colors alone for meaning
- Don't make touch targets smaller than 44px
- Don't use more than 3 font families
- Don't animate on scroll without user preference check

---

## 13. Component Library

### Available Components
- `AnimatedCard` - Card with fade-in and hover
- `AnimatedButton` - Button with press feedback
- `Icon` - Unified icon component
- `ModernLayout` - Page layout wrapper
- `ModernNavigation` - Responsive navigation
- `PageLoader` - Loading spinner
- `SplashScreen` - App splash screen

### Import Pattern
```jsx
import { AnimatedCard, AnimatedButton, Icon } from './components/common';
```

---

## 14. Performance Guidelines

### Bundle Size Targets
- Initial load: <200KB
- Total bundle: <500KB
- Per route: <50KB

### Animation Performance
- Use `transform` and `opacity` (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Respect `prefers-reduced-motion`

### Code Splitting
```jsx
const Page = lazy(() => import('./pages/Page'));

<Suspense fallback={<PageLoader />}>
  <Page />
</Suspense>
```

---

**This design system ensures Space4U provides a consistent, accessible, and therapeutic user experience.**
