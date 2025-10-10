import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

function EducationalTooltip({ title, content, children }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
      >
        {children || <HelpCircle className="w-4 h-4" />}
      </button>
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <p className="leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  )
}

export default EducationalTooltip
