# Animation System Installation & Usage

## Step 1: Install Icon Libraries

```bash
npm install @heroicons/react@^2.1.1
```

**Already Installed:**
- lucide-react ✅

## Step 2: Already Installed ✅
- Framer Motion ✅
- React Spring ✅
- Chakra UI ✅
- Lucide React ✅
- Animate.css ✅

## Step 3: Usage Examples

### 1. Animated Cards
```jsx
import { AnimatedCard } from './components/common/AnimatedCard';

<AnimatedCard delay={0.1} hover>
  <h3>Card Title</h3>
  <p>Card content with fade-in animation</p>
</AnimatedCard>
```

### 2. Animated Buttons
```jsx
import { AnimatedButton } from './components/common/AnimatedButton';

<AnimatedButton variant="primary" onClick={handleClick}>
  Click Me
</AnimatedButton>
```

### 3. Icons with Animation (Unified Library)
```jsx
import { Icon, Icons } from './components/common/IconLibrary';

// Lucide icons
<Icon name="Heart" library="lucide" size={24} color="#EF4444" animate />

// Heroicons solid
<Icon name="HeartIcon" library="hero-solid" size={24} color="#EF4444" animate />

// Heroicons outline
<Icon name="HeartIcon" library="hero-outline" size={24} color="#EF4444" animate />

// Convenience exports
<Icons.Heart size={24} color="#EF4444" animate />
<Icons.HeartSolid size={24} color="#EF4444" animate />
```

### 4. React Spring Animations
```jsx
import { useSlideUp, useFadeIn } from './utils/animations';
import { animated } from 'react-spring';

function MyComponent() {
  const slideStyle = useSlideUp();
  
  return (
    <animated.div style={slideStyle}>
      Content slides up smoothly
    </animated.div>
  );
}
```

### 5. Framer Motion Variants
```jsx
import { motion } from 'framer-motion';
import { fadeInUp, scaleIn } from './utils/animations';

<motion.div {...fadeInUp}>
  Fades in from bottom
</motion.div>

<motion.div {...scaleIn}>
  Scales in smoothly
</motion.div>
```

### 6. Staggered Children
{% raw %}
```jsx
import { motion } from 'framer-motion';
import { staggerChildren, fadeInUp } from './utils/animations';

<motion.div {...staggerChildren}>
  {items.map((item, i) => (
    <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }}>
      {item}
    </motion.div>
  ))}
</motion.div>
```
{% endraw %}

## Step 4: Apply to Existing Components

### Update HomePage Cards
```jsx
// Before
<div className="card">Content</div>

// After
<AnimatedCard delay={0.1}>Content</AnimatedCard>
```

### Update Buttons
```jsx
// Before
<button className="btn-primary">Click</button>

// After
<AnimatedButton variant="primary">Click</AnimatedButton>
```

### Update Icons
```jsx
// Before
<Heart size={20} />

// After
<Icon icon={Heart} size={20} animate />
```

## Performance Tips

1. **Use `will-change` sparingly** - Only for actively animating elements
2. **Prefer `transform` and `opacity`** - GPU accelerated
3. **Lazy load animations** - Don't animate off-screen content
4. **Respect reduced motion**:
```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

## Bundle Size
- Framer Motion: 30KB ✅
- React Spring: 15KB ✅
- React Icons: 0KB (tree-shaken) ✅
- Animation Utils: 2KB ✅
**Total: ~47KB** (Excellent for mental health app)

## Next Steps
1. Run `npm install react-icons@^5.0.1`
2. Test animations with `npm run dev`
3. Gradually replace static components
4. Monitor performance with React DevTools
