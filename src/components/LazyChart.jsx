import { lazy, Suspense } from 'react'
import { Box, Skeleton } from '@chakra-ui/react'

// Lazy load Recharts components
const LazyAreaChart = lazy(() => 
  import('recharts').then(module => ({ default: module.AreaChart }))
)
const LazyArea = lazy(() => 
  import('recharts').then(module => ({ default: module.Area }))
)
const LazyXAxis = lazy(() => 
  import('recharts').then(module => ({ default: module.XAxis }))
)
const LazyYAxis = lazy(() => 
  import('recharts').then(module => ({ default: module.YAxis }))
)
const LazyCartesianGrid = lazy(() => 
  import('recharts').then(module => ({ default: module.CartesianGrid }))
)
const LazyTooltip = lazy(() => 
  import('recharts').then(module => ({ default: module.Tooltip }))
)
const LazyResponsiveContainer = lazy(() => 
  import('recharts').then(module => ({ default: module.ResponsiveContainer }))
)

const ChartFallback = () => (
  <Box h="full" w="full">
    <Skeleton height="100%" borderRadius="xl" />
  </Box>
)

export function LazyChart({ children, ...props }) {
  return (
    <Suspense fallback={<ChartFallback />}>
      {children}
    </Suspense>
  )
}

export {
  LazyAreaChart as AreaChart,
  LazyArea as Area,
  LazyXAxis as XAxis,
  LazyYAxis as YAxis,
  LazyCartesianGrid as CartesianGrid,
  LazyTooltip as Tooltip,
  LazyResponsiveContainer as ResponsiveContainer
}
