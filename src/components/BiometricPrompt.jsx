import { useState } from 'react'
import { Fingerprint, Lock } from 'lucide-react'
import { useBiometric } from '../hooks/useBiometric'

function BiometricPrompt({ onSuccess, onCancel, title = 'Authenticate' }) {
  const { isAvailable, biometricType, authenticate } = useBiometric()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuthenticate = async () => {
    setLoading(true)
    setError('')
    
    const result = await authenticate(title)
    
    if (result.success) {
      onSuccess?.()
    } else {
      setError(result.error || 'Authentication failed')
    }
    
    setLoading(false)
  }

  if (!isAvailable) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-scaleIn">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Fingerprint size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-text-secondary text-sm">
            {biometricType === 'face' ? 'Use Face ID' : 'Use fingerprint'} to continue
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleAuthenticate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
          
          <button
            onClick={onCancel}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium"
          >
            Use Password Instead
          </button>
        </div>
      </div>
    </div>
  )
}

export default BiometricPrompt
