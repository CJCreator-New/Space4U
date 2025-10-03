import { X } from 'lucide-react'

function ConfirmModal({ 
  isOpen, 
  title, 
  description, 
  onConfirm, 
  onCancel, 
  danger = false,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${danger ? 'text-red-600' : 'text-text-primary'}`}>
              {title}
            </h2>
            <button onClick={onCancel} className="text-text-secondary hover:text-text-primary">
              <X size={24} />
            </button>
          </div>
          
          <p className="text-text-secondary mb-6">{description}</p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                danger 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal