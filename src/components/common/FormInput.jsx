import { useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

function FormInput({
  label,
  error,
  success,
  helperText,
  required,
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          className={`input w-full ${
            error ? 'input-error' : success ? 'input-success' : ''
          } ${props.className || ''}`}
        />
        {error && (
          <AlertCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-danger"
            size={20}
          />
        )}
        {success && !error && (
          <CheckCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-success"
            size={20}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      {success && !error && (
        <p className="mt-1 text-sm text-success flex items-center gap-1">
          <CheckCircle size={14} />
          {success}
        </p>
      )}
      {helperText && !error && !success && (
        <p className="mt-1 text-sm text-text-secondary dark:text-gray-300">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default FormInput
