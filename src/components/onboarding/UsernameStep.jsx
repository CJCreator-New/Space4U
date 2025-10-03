import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import ProgressIndicator from './ProgressIndicator'

function UsernameStep({ data, onNext, onBack, onSkip }) {
  const [username, setUsername] = useState(data.username || '')
  const [error, setError] = useState('')

  const validateUsername = (value) => {
    if (value.length < 3) return 'Username must be at least 3 characters'
    if (value.length > 20) return 'Username must be 20 characters or less'
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, and underscores allowed'
    return ''
  }

  const handleChange = (e) => {
    const value = e.target.value
    setUsername(value)
    setError(validateUsername(value))
  }

  const handleSubmit = () => {
    const validationError = validateUsername(username)
    if (!validationError) {
      onNext({ username })
    } else {
      setError(validationError)
    }
  }

  const isValid = username && !error

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <button onClick={onSkip} className="text-text-secondary text-sm">Skip</button>
      </div>

      <ProgressIndicator current={1} total={4} />

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Choose your anonymous identity</h2>
        <p className="text-text-secondary text-sm">This is how you'll appear in communities - no real name needed</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={username}
          onChange={handleChange}
          placeholder="Enter username"
          className={`w-full p-4 border-2 rounded-2xl text-lg ${
            error ? 'border-danger' : 'border-gray-200 focus:border-primary'
          } outline-none transition-colors`}
        />
        {error && <p className="text-danger text-sm mt-2">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-colors ${
          isValid
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  )
}

export default UsernameStep