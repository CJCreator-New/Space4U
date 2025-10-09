import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return
      }

      // Keyboard shortcuts
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        showKeyboardHelp()
      } else if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        focusSearch()
      } else if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        navigate('/')
      } else if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        navigate('/circles')
      } else if (e.key === 'i' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        navigate('/insights')
      } else if (e.key === 'p' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        navigate('/profile')
      } else if (e.key === 'Escape') {
        closeModals()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [navigate])
}

function showKeyboardHelp() {
  const helpModal = document.getElementById('keyboard-help-modal')
  if (helpModal) {
    helpModal.style.display = 'flex'
  } else {
    alert('Keyboard Shortcuts:\n? - Show this help\n/ - Focus search\nh - Home\nc - Circles\ni - Insights\np - Profile\nEsc - Close modals')
  }
}

function focusSearch() {
  const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]')
  if (searchInput) {
    searchInput.focus()
  }
}

function closeModals() {
  const modals = document.querySelectorAll('[role="dialog"], .modal')
  modals.forEach(modal => {
    const closeButton = modal.querySelector('button[aria-label*="Close"], button[aria-label*="close"]')
    if (closeButton) {
      closeButton.click()
    }
  })
}
