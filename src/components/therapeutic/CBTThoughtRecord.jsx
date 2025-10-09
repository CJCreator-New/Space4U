import { useState } from 'react'
import { X, Plus, Minus, Info } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Disclaimer from '../common/Disclaimer'

function CBTThoughtRecord({ onClose }) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [record, setRecord] = useState({
    situation: '',
    automatic_thought: '',
    emotions: [{ emotion: '', intensity: 5 }],
    evidence_for: '',
    evidence_against: '',
    balanced_thought: '',
    outcome_emotions: [{ emotion: '', intensity: 5 }]
  })

  const addEmotion = (type) => {
    setRecord(prev => ({
      ...prev,
      [type]: [...prev[type], { emotion: '', intensity: 5 }]
    }))
  }

  const updateEmotion = (type, index, field, value) => {
    setRecord(prev => ({
      ...prev,
      [type]: prev[type].map((e, i) => i === index ? { ...e, [field]: value } : e)
    }))
  }

  const removeEmotion = (type, index) => {
    setRecord(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    if (user) {
      // Save to Supabase via API
      console.log('Saving to database:', record)
    } else {
      // Save to localStorage
      const saved = JSON.parse(localStorage.getItem('safespace_thought_records') || '[]')
      saved.push({ ...record, id: Date.now(), created_at: new Date().toISOString() })
      localStorage.setItem('safespace_thought_records', JSON.stringify(saved))
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">CBT Thought Record</h2>
            <p className="text-sm text-text-secondary">Step {step} of 4</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-hover rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {step === 1 && (
            <>
              <Disclaimer type="therapy" />
              
              <div className="card p-4 bg-blue-50 border border-blue-200">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">How CBT Thought Records Work</p>
                    <p>This technique helps you identify and challenge negative thought patterns. By examining the evidence, you can develop more balanced perspectives.</p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">1. What was the situation?</label>
                <p className="text-xs text-text-secondary mb-2">Describe the event or situation that triggered your thoughts</p>
                <textarea
                  value={record.situation}
                  onChange={(e) => setRecord({ ...record, situation: e.target.value })}
                  className="input w-full h-24"
                  placeholder="Example: I sent a text to my friend and they didn't reply for 3 hours..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">2. What automatic thought came to mind?</label>
                <p className="text-xs text-text-secondary mb-2">What went through your mind? What did you think would happen?</p>
                <textarea
                  value={record.automatic_thought}
                  onChange={(e) => setRecord({ ...record, automatic_thought: e.target.value })}
                  className="input w-full h-24"
                  placeholder="Example: They're ignoring me. They must be angry with me..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">3. What emotions did you feel?</label>
                <p className="text-xs text-text-secondary mb-2">Rate the intensity from 1 (mild) to 10 (extreme)</p>
                {record.emotions.map((emotion, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={emotion.emotion}
                      onChange={(e) => updateEmotion('emotions', i, 'emotion', e.target.value)}
                      className="input flex-1"
                      placeholder="Emotion (e.g., anxious, sad)"
                    />
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={emotion.intensity}
                      onChange={(e) => updateEmotion('emotions', i, 'intensity', parseInt(e.target.value))}
                      className="w-32"
                    />
                    <span className="w-8 text-center">{emotion.intensity}</span>
                    {record.emotions.length > 1 && (
                      <button onClick={() => removeEmotion('emotions', i)} className="p-2 hover:bg-hover rounded-lg">
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => addEmotion('emotions')} className="btn-secondary text-sm">
                  <Plus className="w-4 h-4" /> Add Emotion
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Evidence FOR the thought</label>
                <textarea
                  value={record.evidence_for}
                  onChange={(e) => setRecord({ ...record, evidence_for: e.target.value })}
                  className="input w-full h-32"
                  placeholder="What facts support this thought?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Evidence AGAINST the thought</label>
                <textarea
                  value={record.evidence_against}
                  onChange={(e) => setRecord({ ...record, evidence_against: e.target.value })}
                  className="input w-full h-32"
                  placeholder="What facts contradict this thought?"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <div>
              <label className="block text-sm font-medium mb-2">Balanced thought</label>
              <textarea
                value={record.balanced_thought}
                onChange={(e) => setRecord({ ...record, balanced_thought: e.target.value })}
                className="input w-full h-40"
                placeholder="Based on the evidence, what's a more balanced way to think about this?"
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <label className="block text-sm font-medium mb-2">How do you feel now?</label>
              {record.outcome_emotions.map((emotion, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={emotion.emotion}
                    onChange={(e) => updateEmotion('outcome_emotions', i, 'emotion', e.target.value)}
                    className="input flex-1"
                    placeholder="Emotion"
                  />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={emotion.intensity}
                    onChange={(e) => updateEmotion('outcome_emotions', i, 'intensity', parseInt(e.target.value))}
                    className="w-32"
                  />
                  <span className="w-8 text-center">{emotion.intensity}</span>
                  {record.outcome_emotions.length > 1 && (
                    <button onClick={() => removeEmotion('outcome_emotions', i)} className="p-2 hover:bg-hover rounded-lg">
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={() => addEmotion('outcome_emotions')} className="btn-secondary text-sm">
                <Plus className="w-4 h-4" /> Add Emotion
              </button>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-border p-6 flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1">
              Previous
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary flex-1">
              Next
            </button>
          ) : (
            <button onClick={handleSave} className="btn-primary flex-1">
              Save Record
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CBTThoughtRecord
