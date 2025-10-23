import { useState } from 'react'
import { ArrowLeft, Fingerprint, Share2, Smartphone, Sun, Moon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useBiometric } from '../hooks/useBiometric'
import { useShare } from '../hooks/useShare'
import { useStatusBar } from '../hooks/useStatusBar'
import { useTheme } from '../contexts/ThemeContext'
import { useHaptic } from '../hooks/useHaptic'
import BiometricPrompt from '../components/BiometricPrompt'
import KeyboardAvoidingView from '../components/common/KeyboardAvoidingView'

function NativeDemoPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { isAvailable, biometricType } = useBiometric()
  const { share, isSharing, canShare } = useShare()
  const { triggerHaptic } = useHaptic()
  const [showBiometric, setShowBiometric] = useState(false)
  const [biometricResult, setBiometricResult] = useState('')
  const [shareResult, setShareResult] = useState('')

  useStatusBar({
    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
    style: theme === 'dark' ? 'light' : 'dark'
  })

  const handleBiometric = () => {
    triggerHaptic('medium')
    setShowBiometric(true)
  }

  const handleBiometricSuccess = () => {
    setBiometricResult('✅ Authentication successful!')
    setShowBiometric(false)
    triggerHaptic('success')
  }

  const handleShare = async () => {
    triggerHaptic('light')
    const result = await share({
      title: 'Space4U - Mental Health Support',
      text: 'Check out this amazing mental health app!',
      url: 'https://space4u.app'
    })
    
    if (result.success) {
      setShareResult(result.fallback ? '📋 Copied to clipboard!' : '✅ Shared successfully!')
      triggerHaptic('success')
    } else {
      setShareResult('❌ Share failed')
    }
  }

  const handleThemeToggle = () => {
    triggerHaptic('light')
    toggleTheme()
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="touch-target mb-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Native Features Demo</h1>
        <p className="text-indigo-100 mt-1">Platform integrations</p>
      </div>

      <KeyboardAvoidingView>
        <div className="p-6 space-y-6">
          {/* Biometric Auth */}
          <section className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Fingerprint size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Biometric Authentication</h2>
                <p className="text-sm text-text-secondary">
                  {isAvailable ? `${biometricType === 'face' ? 'Face ID' : 'Fingerprint'} available` : 'Not available'}
                </p>
              </div>
            </div>

            <button
              onClick={handleBiometric}
              disabled={!isAvailable}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Biometric Auth
            </button>

            {biometricResult && (
              <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                {biometricResult}
              </div>
            )}
          </section>

          {/* Native Share */}
          <section className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Share2 size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Native Share</h2>
                <p className="text-sm text-text-secondary">
                  {canShare() ? 'Share API available' : 'Not available'}
                </p>
              </div>
            </div>

            <button
              onClick={handleShare}
              disabled={isSharing || !canShare()}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-xl font-medium disabled:opacity-50"
            >
              {isSharing ? 'Sharing...' : 'Share App'}
            </button>

            {shareResult && (
              <div className="mt-3 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                {shareResult}
              </div>
            )}
          </section>

          {/* Status Bar Theming */}
          <section className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Smartphone size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Status Bar Theming</h2>
                <p className="text-sm text-text-secondary">
                  Current: {theme === 'dark' ? 'Dark' : 'Light'} mode
                </p>
              </div>
            </div>

            <button
              onClick={handleThemeToggle}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              Toggle Theme
            </button>

            <p className="mt-3 text-sm text-text-secondary">
              Status bar color updates automatically with theme
            </p>
          </section>

          {/* Haptic Feedback */}
          <section className="card p-6">
            <h2 className="font-semibold mb-4">Haptic Feedback</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => triggerHaptic('light')}
                className="bg-gray-100 py-3 rounded-xl font-medium"
              >
                Light
              </button>
              <button
                onClick={() => triggerHaptic('medium')}
                className="bg-gray-100 py-3 rounded-xl font-medium"
              >
                Medium
              </button>
              <button
                onClick={() => triggerHaptic('heavy')}
                className="bg-gray-100 py-3 rounded-xl font-medium"
              >
                Heavy
              </button>
              <button
                onClick={() => triggerHaptic('success')}
                className="bg-green-100 text-green-700 py-3 rounded-xl font-medium"
              >
                Success
              </button>
            </div>
          </section>

          {/* Keyboard Test */}
          <section className="card p-6">
            <h2 className="font-semibold mb-4">Keyboard Avoidance</h2>
            <p className="text-sm text-text-secondary mb-4">
              Tap input to test keyboard avoidance
            </p>
            <input
              type="text"
              placeholder="Type something..."
              className="input w-full"
            />
          </section>
        </div>
      </KeyboardAvoidingView>

      {showBiometric && (
        <BiometricPrompt
          title="Authenticate to Continue"
          onSuccess={handleBiometricSuccess}
          onCancel={() => setShowBiometric(false)}
        />
      )}
    </div>
  )
}

export default NativeDemoPage
