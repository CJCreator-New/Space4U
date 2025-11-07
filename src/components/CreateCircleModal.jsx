import { useState } from 'react'
import { X, Lock, Globe } from 'lucide-react'
import { usePremiumStatus } from '../hooks/usePremiumStatus'
import { api } from '../utils/supabase'

const CATEGORIES = [
  { value: 'mental-health', label: 'Mental Health' },
  { value: 'support', label: 'Support' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'educational', label: 'Educational' }
]

function CreateCircleModal({ onClose, onSuccess }) {
  const { isPremium } = usePremiumStatus()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    category: 'mental-health',
    description: '',
    visibility: 'public',
    icon: '🌟'
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    
    if (formData.name.length < 3 || formData.name.length > 50) {
      newErrors.name = 'Name must be 3-50 characters'
    }
    
    if (formData.description.length < 10 || formData.description.length > 500) {
      newErrors.description = 'Description must be 10-500 characters'
    }
    
    if (formData.visibility === 'private' && !isPremium) {
      newErrors.visibility = 'Private circles require Premium'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    
    setLoading(true)
    try {
      await api.createCircle(formData)
      onSuccess()
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Circle</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Circle Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl"
                placeholder="e.g., Anxiety Support"
                maxLength={50}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl"
                rows={4}
                placeholder="Describe your circle..."
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.description.length}/500</p>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Visibility</label>
              <div className="space-y-2">
                <button
                  onClick={() => setFormData({ ...formData, visibility: 'public' })}
                  className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl ${
                    formData.visibility === 'public' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  <Globe size={24} />
                  <div className="text-left">
                    <div className="font-medium">Public</div>
                    <div className="text-sm text-gray-500">Anyone can join</div>
                  </div>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, visibility: 'private' })}
                  disabled={!isPremium}
                  className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl ${
                    formData.visibility === 'private' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  } ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Lock size={24} />
                  <div className="text-left">
                    <div className="font-medium">Private {!isPremium && '(Premium)'}</div>
                    <div className="text-sm text-gray-500">Invite-only</div>
                  </div>
                </button>
              </div>
              {errors.visibility && <p className="text-red-500 text-sm mt-1">{errors.visibility}</p>}
            </div>

            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 rounded-xl font-medium"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Circle'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateCircleModal
