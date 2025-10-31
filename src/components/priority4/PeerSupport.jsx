import { useState, useEffect } from 'react'
import { MessageCircle, Send } from 'lucide-react'

function PeerSupport() {
  const [matches, setMatches] = useState([])
  const [activeMatch, setActiveMatch] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('space4u_peer_matches')
    if (saved) setMatches(JSON.parse(saved))
  }, [])

  const findMatch = () => {
    const newMatch = {
      id: Date.now(),
      matchScore: Math.floor(Math.random() * 30) + 70,
      sharedChallenges: ['anxiety', 'stress'],
      messages: [],
      createdAt: new Date().toISOString()
    }
    const updated = [...matches, newMatch]
    setMatches(updated)
    localStorage.setItem('space4u_peer_matches', JSON.stringify(updated))
    setActiveMatch(newMatch.id)
  }

  const sendMessage = () => {
    if (!message.trim() || !activeMatch) return
    
    const updated = matches.map(m => {
      if (m.id === activeMatch) {
        return {
          ...m,
          messages: [...m.messages, {
            id: Date.now(),
            text: message,
            sender: 'me',
            timestamp: new Date().toISOString()
          }]
        }
      }
      return m
    })
    setMatches(updated)
    localStorage.setItem('space4u_peer_matches', JSON.stringify(updated))
    setMessage('')
  }

  const currentMatch = matches.find(m => m.id === activeMatch)

  return (
    <div className="space-y-6">
      {!activeMatch ? (
        <div className="bg-surface rounded-2xl p-6 text-center">
          <MessageCircle size={48} className="mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Find Peer Support</h3>
          <p className="text-text-secondary mb-4">Connect with someone who understands your journey</p>
          <button
            onClick={findMatch}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
          >
            Find a Match
          </button>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl overflow-hidden">
          <div className="bg-primary/10 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-primary">Peer Support Chat</h3>
                <p className="text-sm text-text-secondary">Match Score: {currentMatch?.matchScore}%</p>
              </div>
              <button
                onClick={() => setActiveMatch(null)}
                className="text-sm text-primary hover:underline"
              >
                Back to Matches
              </button>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {currentMatch?.messages.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                <p>Start the conversation!</p>
                <p className="text-sm">Share your experiences and support each other</p>
              </div>
            ) : (
              currentMatch?.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.sender === 'me'
                        ? 'bg-primary text-white'
                        : 'bg-background text-text-primary'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-background border border-gray-200 rounded-xl"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {matches.length > 0 && !activeMatch && (
        <div className="space-y-3">
          <h3 className="font-semibold text-text-primary">Your Matches</h3>
          {matches.map(match => (
            <div
              key={match.id}
              onClick={() => setActiveMatch(match.id)}
              className="bg-surface p-4 rounded-xl cursor-pointer hover:bg-surface/80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">Peer Support Match</p>
                  <p className="text-sm text-text-secondary">
                    {match.messages.length} messages â€¢ {match.matchScore}% match
                  </p>
                </div>
                <MessageCircle className="text-primary" size={20} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PeerSupport

