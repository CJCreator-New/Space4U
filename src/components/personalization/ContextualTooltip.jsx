import { useState } from 'react'
import { Info, X } from 'lucide-react'

function ContextualTooltip({ content, position = 'top', children }) {
  const [show, setShow] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        {children}
      </div>

      {show && (
        <div className={`absolute ${positions[position]} z-50 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200`}>
          <div className="bg-gray-900 text-white rounded-xl p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <p className="font-semibold text-sm">{content.title}</p>
              </div>
              <button onClick={() => setShow(false)} className="hover:bg-white/10 rounded p-1">
                <X className="w-3 h-3" />
              </button>
            </div>
            
            <p className="text-sm text-gray-300 mb-3">{content.description}</p>
            
            {content.benefits && (
              <div className="space-y-1 mb-3">
                {content.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-green-400">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            )}

            {content.actions && (
              <div className="flex gap-2">
                {content.actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.onClick}
                    className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Arrow */}
          <div className={`absolute w-3 h-3 bg-gray-900 transform rotate-45 ${
            position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' :
            position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' :
            position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2' :
            'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'
          }`} />
        </div>
      )}
    </div>
  )
}

export default ContextualTooltip
