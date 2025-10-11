import { useEffect, useState } from 'react'

export function useKeyboardAvoidance() {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    let keyboardShowListener
    let keyboardHideListener

    const setupListeners = async () => {
      if (window.Capacitor) {
        const { Keyboard } = await import('@capacitor/keyboard')
        
        keyboardShowListener = await Keyboard.addListener('keyboardWillShow', info => {
          setKeyboardHeight(info.keyboardHeight)
          setIsKeyboardVisible(true)
        })

        keyboardHideListener = await Keyboard.addListener('keyboardWillHide', () => {
          setKeyboardHeight(0)
          setIsKeyboardVisible(false)
        })
      }
    }

    setupListeners()

    return () => {
      keyboardShowListener?.remove()
      keyboardHideListener?.remove()
    }
  }, [])

  return { keyboardHeight, isKeyboardVisible }
}
