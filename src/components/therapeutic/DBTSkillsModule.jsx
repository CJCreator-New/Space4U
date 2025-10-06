import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const SKILL_TYPES = {
  mindfulness: { label: 'Mindfulness', skills: ['Observe', 'Describe', 'Participate', 'One-mindfully', 'Non-judgmentally', 'Effectively'] },
  distress_tolerance: { label: 'Distress Tolerance', skills: ['STOP', 'TIP', 'ACCEPTS', 'Self-Soothe', 'IMPROVE', 'Pros and Cons'] },
  emotion_regulation: { label: 'Emotion Regulation', skills: ['Check the Facts', 'Opposite Action', 'Problem Solving', 'ABC PLEASE', 'Build Mastery', 'Cope Ahead'] },
  interpersonal_effectiveness: { label: 'Interpersonal Effectiveness', skills: ['DEAR MAN', 'GIVE', 'FAST', 'Validation'] }
}

function DBTSkillsModule({ onClose }) {
  const { user } = useAuth()
  const [entry, setEntry] = useState({
    skill_type: 'mindfulness',
    skill_name: '',
    situation: '',
    what_happened: '',
    skill_used: '',
    effectiveness: 5,
    notes: ''
  })

  const handleSave = async () => {
    if (user) {
      console.log('Saving to database:', entry)
    } else {
      const saved = JSON.parse(localStorage.getItem('safespace_dbt_skills') || '[]')
      saved.push({ ...entry, id: Date.now(), created_at: new Date().toISOString() })
      localStorage.setItem('safespace_dbt_skills', JSON.stringify(saved))
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">DBT Skills Practice</h2>
          <button onClick={onClose} className="p-2 hover:bg-hover rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Skill Category</label>
            <select
              value={entry.skill_type}
              onChange={(e) => setEntry({ ...entry, skill_type: e.target.value, skill_name: '' })}
              className="input w-full"
            >
              {Object.entries(SKILL_TYPES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Specific Skill</label>
            <select
              value={entry.skill_name}
              onChange={(e) => setEntry({ ...entry, skill_name: e.target.value })}
              className="input w-full"
            >
              <option value="">Select a skill...</option>
              {SKILL_TYPES[entry.skill_type].skills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Situation</label>
            <textarea
              value={entry.situation}
              onChange={(e) => setEntry({ ...entry, situation: e.target.value })}
              className="input w-full h-24"
              placeholder="What was happening?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">How did you use the skill?</label>
            <textarea
              value={entry.skill_used}
              onChange={(e) => setEntry({ ...entry, skill_used: e.target.value })}
              className="input w-full h-32"
              placeholder="Describe how you applied this DBT skill..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Effectiveness (1-10)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={entry.effectiveness}
                onChange={(e) => setEntry({ ...entry, effectiveness: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-2xl font-bold w-12 text-center">{entry.effectiveness}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes</label>
            <textarea
              value={entry.notes}
              onChange={(e) => setEntry({ ...entry, notes: e.target.value })}
              className="input w-full h-24"
              placeholder="Any other observations..."
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-border p-6">
          <button onClick={handleSave} className="btn-primary w-full">
            Save Practice Log
          </button>
        </div>
      </div>
    </div>
  )
}

export default DBTSkillsModule
