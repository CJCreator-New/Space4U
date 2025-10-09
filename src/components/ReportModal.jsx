import { useState } from 'react'
import { X, AlertTriangle, Check } from 'lucide-react'
import { REPORT_REASONS, reportPost } from '../utils/moderation'

function ReportModal({ isOpen, onClose, postId }) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = () => {
    const userId = JSON.parse(localStorage.getItem('safespace_user') || '{}').username || 'anonymous'
    reportPost(postId, reason, details, userId)
    setSubmitted(true)
    setTimeout(() => {
      onClose()
      setSubmitted(false)
      setReason('')
      setDetails('')
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {submitted ? (
          <div className="text-center py-8">
            <Check className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Report Submitted
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Thank you for helping keep our community safe
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={24} />
                Report Post
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for reporting
                </label>
                <div className="space-y-2">
                  {Object.entries(REPORT_REASONS).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input
                        type="radio"
                        name="reason"
                        value={key}
                        checked={reason === key}
                        onChange={(e) => setReason(e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional details (optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide more context..."
                  className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ReportModal
