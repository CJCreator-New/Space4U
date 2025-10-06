import { useState } from 'react'
import { UserCheck, Sparkles, Shield } from 'lucide-react'

function TherapistPortal() {
  const [isPremium] = useState(false)

  if (!isPremium) {
    return (
      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-8 text-white text-center">
        <Sparkles size={48} className="mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Therapist Portal</h3>
        <p className="mb-6 opacity-90">
          Connect with licensed therapists and share your progress securely
        </p>
        <ul className="text-left max-w-md mx-auto mb-6 space-y-2">
          <li className="flex items-center gap-2">
            <Shield size={16} />
            <span>HIPAA-compliant data sharing</span>
          </li>
          <li className="flex items-center gap-2">
            <UserCheck size={16} />
            <span>Verified therapist connections</span>
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span> Secure messaging
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span> Homework assignments
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span> Progress tracking
          </li>
        </ul>
        <a
          href="/premium"
          className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-xl font-medium hover:bg-gray-100"
        >
          Upgrade to Premium
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Connected Therapists</h3>
        <p className="text-text-secondary">No therapists connected yet</p>
      </div>
    </div>
  )
}

export default TherapistPortal
