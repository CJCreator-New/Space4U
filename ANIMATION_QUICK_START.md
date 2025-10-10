# Animation System - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Import Components
```jsx
import ConfettiExplosion from './components/animations/ConfettiExplosion'
import GlowingButton from './components/animations/GlowingButton'
import AnimatedCard from './components/animations/AnimatedCard'
import SuccessAnimation from './components/animations/SuccessAnimation'
import FloatingParticles from './components/animations/FloatingParticles'
import MoodWave from './components/animations/MoodWave'
```

### Step 2: Use in Your Components
```jsx
function MyPage() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  return (
    <div>
      {/* Background ambiance */}
      <FloatingParticles count={20} />
      
      {/* Mood wave */}
      <MoodWave mood={3} />
      
      {/* Animated card */}
      <AnimatedCard gradient="from-indigo-500 to-purple-600">
        <div className="p-6">
          <h3>My Feature</h3>
          <GlowingButton onClick={() => setShowSuccess(true)}>
            Complete
          </GlowingButton>
        </div>
      </AnimatedCard>

      {/* Success animation */}
      <SuccessAnimation 
        show={showSuccess}
        message="Great job!"
        icon="trophy"
        onClose={() => setShowSuccess(false)}
      />

      {/* Confetti */}
      <ConfettiExplosion active={showConfetti} />
    </div>
  )
}
```

---

## 🎯 Common Use Cases

### 1. Celebrate Achievement
```jsx
import SuccessAnimation from './components/animations/SuccessAnimation'

const [showSuccess, setShowSuccess] = useState(false)

// When user completes something
handleComplete = () => {
  setShowSuccess(true)
}

<SuccessAnimation 
  show={showSuccess}
  message="7-Day Streak!"
  icon="trophy"
  onClose={() => setShowSuccess(false)}
/>
```

### 2. Enhanced Buttons
```jsx
import GlowingButton from './components/animations/GlowingButton'

<GlowingButton variant="primary" onClick={handleSave}>
  Save Changes
</GlowingButton>

<GlowingButton variant="success" onClick={handleSubmit}>
  Submit
</GlowingButton>

<GlowingButton variant="warning" onClick={handleWarning}>
  Warning
</GlowingButton>
```

### 3. Beautiful Cards
```jsx
import AnimatedCard from './components/animations/AnimatedCard'

<AnimatedCard gradient="from-pink-500 to-purple-600" glow>
  <div className="p-6">
    <h3>Gratitude Journal</h3>
    <p>Daily practice</p>
  </div>
</AnimatedCard>
```

### 4. Mood-Based UI
```jsx
import MoodWave from './components/animations/MoodWave'

<MoodWave mood={currentMoodRating} />
```

### 5. Background Ambiance
```jsx
import FloatingParticles from './components/animations/FloatingParticles'

<FloatingParticles 
  count={30} 
  colors={['#6B73FF', '#9B59B6', '#2ECC71', '#FFD93D']} 
/>
```

---

## 🎨 Quick Animations

### Confetti on Click
```jsx
import { createConfetti } from './utils/animations'

<button onClick={() => createConfetti(50)}>
  Celebrate!
</button>
```

### Fireworks on Click
```jsx
import { createFireworks } from './utils/animations'

<button onClick={(e) => createFireworks(e.clientX, e.clientY)}>
  Boom!
</button>
```

### Sparkles on Hover
```jsx
import { createSparkles } from './utils/animations'

<div onMouseEnter={(e) => createSparkles(e.currentTarget)}>
  Hover me!
</div>
```

### Ripple on Click
```jsx
import { createRipple } from './utils/animations'

<button onClick={(e) => createRipple(e.clientX, e.clientY, '#6B73FF')}>
  Click me!
</button>
```

---

## 📦 All Components at a Glance

| Component | Purpose | When to Use |
|-----------|---------|-------------|
| ConfettiExplosion | 100 particles explosion | Major achievements |
| FloatingParticles | Background ambiance | Calm pages |
| GlowingButton | Animated button | Primary CTAs |
| AnimatedCard | Hover effects card | Feature cards |
| MoodWave | Animated waves | Mood pages |
| SuccessAnimation | Full celebration | Completions |

---

## 🎯 Animation Variants

### GlowingButton Variants
```jsx
<GlowingButton variant="primary">Primary</GlowingButton>
<GlowingButton variant="success">Success</GlowingButton>
<GlowingButton variant="warning">Warning</GlowingButton>
<GlowingButton variant="danger">Danger</GlowingButton>
```

### SuccessAnimation Icons
```jsx
<SuccessAnimation icon="check" />  // CheckCircle
<SuccessAnimation icon="star" />   // Star
<SuccessAnimation icon="heart" />  // Heart
<SuccessAnimation icon="trophy" /> // Trophy
```

### MoodWave Moods
```jsx
<MoodWave mood={1} /> // Red/Orange (low)
<MoodWave mood={2} /> // Orange/Yellow
<MoodWave mood={3} /> // Teal/Green (anxious)
<MoodWave mood={4} /> // Blue/Purple (stable)
<MoodWave mood={5} /> // Green/Yellow (high)
```

---

## ⚡ Performance Tips

1. **Limit particle count**: Use 20-50 for floating, 50-100 for confetti
2. **Clean up**: All animations auto-cleanup after completion
3. **Conditional rendering**: Only render when needed
4. **Reduced motion**: Respect user preferences (future enhancement)

---

## 🎉 That's It!

You now have a complete animation system with:
- ✅ Confetti & fireworks
- ✅ Glowing buttons
- ✅ Animated cards
- ✅ Mood waves
- ✅ Success celebrations
- ✅ Floating particles
- ✅ Ripple effects
- ✅ Sparkles

**Start adding animations to your app now!** 🚀
