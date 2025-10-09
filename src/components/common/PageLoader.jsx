import { Loader2 } from 'lucide-react'

function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto mb-2 text-primary dark:text-primary-light" size={32} />
        <p className="text-text-secondary dark:text-gray-300">{message}</p>
      </div>
    </div>
  )
}

export default PageLoader
