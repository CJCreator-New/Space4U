import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2, Loader2, Heart } from 'lucide-react'
import * as Label from '@radix-ui/react-label'
import zxcvbn from 'zxcvbn'

function EnhancedLoginPage({ onLogin, onSignup, onFederatedAuth }) {
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()
  const password = watch('password', '')

  const passwordStrength = password ? zxcvbn(password) : null
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

  const onSubmit = async (data) => {
    setError('')
    setSuccess('')

    if (isSignup && !privacyAccepted) {
      setError('Please accept the privacy agreement to continue')
      return
    }

    if (isSignup && passwordStrength?.score < 2) {
      setError('Please choose a stronger password. Try adding numbers, symbols, or making it longer.')
      return
    }

    setLoading(true)
    try {
      if (isSignup) {
        await onSignup(data)
        setSuccess('Account created! Redirecting to your safe space...')
      } else {
        await onLogin(data)
        setSuccess('Welcome back! Loading your dashboard...')
      }
    } catch (err) {
      const contextualError = err.message?.includes('email') 
        ? 'This email is already registered. Try logging in instead.'
        : err.message?.includes('password')
        ? 'Incorrect password. Try again or reset your password.'
        : 'Unable to connect. Please check your internet and try again.'
      setError(contextualError)
    } finally {
      setLoading(false)
    }
  }

  const handleFederatedAuth = async (provider) => {
    setLoading(true)
    setError('')
    try {
      await onFederatedAuth(provider)
    } catch (err) {
      setError(`${provider} sign-in failed. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
    setError('')
    setSuccess('')
    setPrivacyAccepted(false)
    reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Heart className="w-8 h-8 text-white" fill="white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Space4U</h1>
            <p className="text-gray-600 font-medium">Your mind matters. Your story is safe.</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                role="status"
                aria-live="polite"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label.Root htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label.Root>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  placeholder="you@example.com"
                  aria-required="true"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  id="email-error"
                  className="text-red-600 text-sm mt-2"
                  role="alert"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div>
              <Label.Root htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label.Root>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: isSignup ? 8 : 1,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-2 outline-none transition-all ${
                    errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  placeholder="••••••••"
                  aria-required="true"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 rounded p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  id="password-error"
                  className="text-red-600 text-sm mt-2"
                  role="alert"
                >
                  {errors.password.message}
                </motion.p>
              )}

              {isSignup && password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <div className="flex gap-1 mb-2" role="progressbar" aria-valuenow={passwordStrength.score} aria-valuemin="0" aria-valuemax="4" aria-label="Password strength">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor: i <= passwordStrength.score ? strengthColors[passwordStrength.score] : '#e5e7eb'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColors[passwordStrength.score] }}>
                    Password strength: {strengthLabels[passwordStrength.score]}
                  </p>
                </motion.div>
              )}
            </div>

            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-200"
                    aria-required="true"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I agree to the <a href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</a> and understand that all my data is stored locally on my device for maximum privacy.
                  </span>
                </label>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || (isSignup && !privacyAccepted)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleFederatedAuth('google')}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Sign in with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={() => handleFederatedAuth('apple')}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Sign in with Apple"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 rounded px-2 py-1"
            >
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              <span className="text-blue-600 font-semibold">{isSignup ? 'Sign In' : 'Sign Up'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EnhancedLoginPage
