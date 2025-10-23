import { useSpring, animated } from 'react-spring'
import { useState } from 'react'

function AnimatedButton({ children, onClick, className, ...props }) {
  const [isPressed, setIsPressed] = useState(false)

  const spring = useSpring({
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    config: { tension: 300, friction: 10 }
  })

  return (
    <animated.button
      style={spring}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </animated.button>
  )
}

export default AnimatedButton
