import { useCapacitor } from '../../hooks/useCapacitor'

function MobileOptimizedButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  haptic = true,
  disabled = false,
  className = '',
  ...props 
}) {
  const { hapticFeedback } = useCapacitor()

  const handleClick = async (e) => {
    if (disabled) return
    
    if (haptic) {
      await hapticFeedback()
    }
    
    onClick?.(e)
  }

  const baseClasses = 'font-medium rounded-xl transition-all duration-200 active:scale-95 select-none'
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]'
  }

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 disabled:bg-gray-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-50',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:border-gray-300 disabled:text-gray-300',
    ghost: 'text-primary hover:bg-primary/10 disabled:text-gray-300'
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default MobileOptimizedButton