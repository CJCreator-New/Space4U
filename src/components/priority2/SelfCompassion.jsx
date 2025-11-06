import { useState } from 'react'

const PROMPTS = [
  'Write a letter to yourself as if you were your best friend',
  'What would you say to comfort a friend in your situation?',
  'Acknowledge three things you did well today',
  'What do you need to hear right now?'
]

function SelfCompassion({ onClose }) {
  const [content, setContent] = useState('')
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('space4u_self_compassion') || '[]'))

  const saveLog = () => {
    const log = { id: Date.now(), content, created_at: new Date().toISOString() }
    const updated = [log, ...logs]
    localStorage.setItem('space4u_self_compassion', JSON.stringify(updated))
    setLogs(updated)
    setContent('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Self-Compassion Exercises</h1>
        <button onClick={onClose} className="btn-secondary">Back</button>
      </div>

      <div className="card p-6 mb-6">
        <h3 className="font-semibold mb-4">Choose a Prompt</h3>
        <div className="space-y-2 mb-4">
          {PROMPTS.map((prompt, i) => (
            <button key={i} onClick={() => setContent(prompt + '\n\n')} className="w-full text-left p-3 bg-hover hover:bg-hover/80 rounded-lg">{prompt}</button>
          ))}
        </div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="input w-full h-48 mb-4" placeholder="Write with kindness to yourself..." />
        <button onClick={saveLog} disabled={!content} className="btn-primary w-full">Save</button>
      </div>

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="card p-6">
            <p className="text-sm text-text-secondary mb-2">{new Date(log.created_at).toLocaleDateString()}</p>
            <p className="whitespace-pre-wrap">{log.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelfCompassion

