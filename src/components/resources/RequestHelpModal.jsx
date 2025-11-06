import { useState } from 'react'
import { Phone, MessageSquare, Mail } from 'lucide-react'

function RequestHelpModal({ isOpen, onClose, defaultNumber = '988' }) {
  const [contactMethod, setContactMethod] = useState('call')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const submitRequest = () => {
    // Simple local persistence for demo; real implementation should POST to backend
    const requests = JSON.parse(localStorage.getItem('space4u_help_requests') || '[]')
    requests.unshift({ method: contactMethod, notes, createdAt: new Date().toISOString() })
    localStorage.setItem('space4u_help_requests', JSON.stringify(requests))

    // If call, open dialer
    if (contactMethod === 'call' && typeof window !== 'undefined') {
      window.location.href = `tel:${defaultNumber}`
    }

    // If sms or email we just store and close for now
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
        <h3 className="text-xl font-semibold mb-2">Request Help</h3>
        <p className="text-sm text-text-secondary mb-4">Choose how you'd like to be contacted and add any notes for the support team.</p>

        <div className="space-y-3 mb-4">
          <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${contactMethod==='call' ? 'bg-primary/10 border border-primary' : 'bg-gray-50'}`}>
            <input type="radio" name="method" checked={contactMethod==='call'} onChange={() => setContactMethod('call')} />
            <Phone />
            <span>Call me ({defaultNumber})</span>
          </label>

          <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${contactMethod==='sms' ? 'bg-primary/10 border border-primary' : 'bg-gray-50'}`}>
            <input type="radio" name="method" checked={contactMethod==='sms'} onChange={() => setContactMethod('sms')} />
            <MessageSquare />
            <span>Send SMS</span>
          </label>

          <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${contactMethod==='email' ? 'bg-primary/10 border border-primary' : 'bg-gray-50'}`}>
            <input type="radio" name="method" checked={contactMethod==='email'} onChange={() => setContactMethod('email')} />
            <Mail />
            <span>Email support</span>
          </label>
        </div>

        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" className="w-full p-3 border border-gray-200 rounded-xl mb-4" rows={3} />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-xl">Cancel</button>
          <button onClick={submitRequest} className="px-4 py-2 bg-primary text-white rounded-xl">Request Help</button>
        </div>
      </div>
    </div>
  )
}

export default RequestHelpModal

