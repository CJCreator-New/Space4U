import { useState, useEffect } from 'react'
import { AlertCircle, Send, Heart } from 'lucide-react'

function SupportRequests() {
  const [requests, setRequests] = useState([])
  const [message, setMessage] = useState('')
  const [urgency, setUrgency] = useState('medium')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [responseText, setResponseText] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('space4u_support_requests')
    if (saved) setRequests(JSON.parse(saved))
  }, [])

  const createRequest = () => {
    const newRequest = {
      id: Date.now(),
      message,
      urgency,
      isAnonymous,
      status: 'open',
      responses: [],
      createdAt: new Date().toISOString()
    }
    const updated = [newRequest, ...requests]
    setRequests(updated)
    localStorage.setItem('space4u_support_requests', JSON.stringify(updated))
    setMessage('')
  }

  const addResponse = (requestId) => {
    const updated = requests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          responses: [...r.responses, {
            id: Date.now(),
            text: responseText,
            timestamp: new Date().toISOString()
          }],
          status: 'responded'
        }
      }
      return r
    })
    setRequests(updated)
    localStorage.setItem('space4u_support_requests', JSON.stringify(updated))
    setResponseText('')
  }

  const urgencyColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    crisis: 'bg-red-100 text-red-700'
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Request Support</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Urgency Level</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high', 'crisis'].map(level => (
                <button
                  key={level}
                  onClick={() => setUrgency(level)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                    urgency === level ? urgencyColors[level] : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded"
              />
              Post anonymously
            </label>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What kind of support do you need?"
            className="w-full px-4 py-3 bg-background border border-gray-200 rounded-xl resize-none"
            rows={4}
          />

          <button
            onClick={createRequest}
            disabled={!message.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <AlertCircle size={18} />
            Request Support
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary">Community Support Requests</h3>
        
        {requests.length === 0 ? (
          <div className="text-center py-12 text-text-secondary bg-surface rounded-2xl">
            <Heart size={48} className="mx-auto mb-3 opacity-50" />
            <p>No support requests yet</p>
          </div>
        ) : (
          requests.map(request => (
            <div key={request.id} className="bg-surface rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${urgencyColors[request.urgency]}`}>
                      {request.urgency}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                    {request.isAnonymous && (
                      <span className="text-xs text-text-secondary">â€¢ Anonymous</span>
                    )}
                  </div>
                  <p className="text-text-primary">{request.message}</p>
                </div>
              </div>

              {request.responses.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-text-secondary">Responses</h4>
                  {request.responses.map(response => (
                    <div key={response.id} className="bg-background p-3 rounded-xl">
                      <p className="text-sm text-text-primary">{response.text}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {new Date(response.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Offer support..."
                  className="flex-1 px-4 py-2 bg-background border border-gray-200 rounded-xl text-sm"
                />
                <button
                  onClick={() => addResponse(request.id)}
                  disabled={!responseText.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SupportRequests

