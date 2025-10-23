import { Loader } from 'lucide-react'
import { useHaptic } from '../../hooks/useHaptic'

function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  haptic = true,
  className = '',
  ...props
}) {
  const { vibrate } = useHaptic()

  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-text-primary dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-primary/10',
    danger: 'bg-danger text-white hover:bg-danger/90'
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[56px]'
  }

  const handleClick = (e) => {
    if (haptic && !disabled && !loading) {
      vibrate('light')
    }
    props.onClick?.(e)
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-semibold
        transition-all duration-200
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading && <Loader className="animate-spin" size={20} />}
      {children}
    </button>
  )
}

export default Button
