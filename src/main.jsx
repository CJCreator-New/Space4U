import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { migrateLegacyStorageNamespace } from './utils/storageNamespaceMigration'

// Ensure UTF-8 encoding
if (document.characterSet !== 'UTF-8') {
  console.warn('Document encoding is not UTF-8:', document.characterSet)
}

migrateLegacyStorageNamespace()

// Initialize i18n after storage migration
import('./i18n/config').catch(err => console.warn('i18n initialization failed:', err))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker for PWA functionality
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration.scope)
      })
      .catch(error => {
        console.warn('⚠️ Service Worker registration failed:', error)
      })
  })
}