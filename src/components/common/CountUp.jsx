import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

function CountUp({ value, duration = 1 }) {
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (current) => Math.round(current))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    spring.set(value)
    const unsubscribe = display.onChange(setDisplayValue)
    return unsubscribe
  }, [value, spring, display])

  return <motion.span>{displayValue}</motion.span>
}

export default CountUp
