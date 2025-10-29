import { useSpring, animated, config } from 'react-spring'
import { useInView } from 'react-intersection-observer'
import { Card, CardBody } from '@chakra-ui/react'

function SpringAnimatedCard({ children, delay = 0, ...props }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const spring = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px) scale(1)' : 'translateY(30px) scale(0.95)',
    config: config.gentle,
    delay
  })

  return (
    <animated.div ref={ref} style={spring}>
      <Card {...props}>
        <CardBody>{children}</CardBody>
      </Card>
    </animated.div>
  )
}

export default SpringAnimatedCard
