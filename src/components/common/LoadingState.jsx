import { Loader2 } from 'lucide-react'

export function Spinner({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  }
  
  return (
    <Loader2 
      className={`animate-spin text-primary ${sizeClasses[size]} ${className}`}
    />
  )
}

export function CircleCardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-1/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="flex gap-4">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )
}

export function MoodCalendarSkeleton() {
  return (
    <div className="card p-6">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="card p-6">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
        <Spinner size="large" />
      </div>
    </div>
  )
}

export function ProgressBar({ progress = 0, className = '' }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  )
}

export default function LoadingState({ type = 'spinner', ...props }) {
  const components = {
    spinner: Spinner,
    circleCard: CircleCardSkeleton,
    postCard: PostCardSkeleton,
    calendar: MoodCalendarSkeleton,
    chart: ChartSkeleton,
    progress: ProgressBar
  }
  
  const Component = components[type] || Spinner
  return <Component {...props} />
}