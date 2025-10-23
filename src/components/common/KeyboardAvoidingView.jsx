import { useKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance'

function KeyboardAvoidingView({ children, className = '' }) {
  const { keyboardHeight, isKeyboardVisible } = useKeyboardAvoidance()

  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{
        paddingBottom: isKeyboardVisible ? `${keyboardHeight}px` : '0px'
      }}
    >
      {children}
    </div>
  )
}

export default KeyboardAvoidingView
