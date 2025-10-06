import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

function CrisisSafetyPlan({ onClose }) {
  const { user } = useAuth()
  const [plan, setPlan] = useState({
    warning_signs: [''],
    coping_strategies: [''],
    distractions: [''],
    support_contacts: [{ name: '', phone: '', relationship: '' }],
    professional_contacts: [{ name: '', phone: '', type: '' }],
    safe_environment: '',
    reasons_to_live: ['']
  })

  useEffect(() => {
    const saved = localStorage.getItem('safespace_crisis_plan')
    if (saved) setPlan(JSON.parse(saved))
  }, [])

  const addItem = (field) => {
    setPlan(prev => ({ ...prev, [field]: [...prev[field], field.includes('contact') ? { name: '', phone: '', relationship: '' } : ''] }))
  }

  const updateItem = (field, index, value) => {
    setPlan(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const removeItem = (field, index) => {
    setPlan(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    if (user) {
      console.log('Saving to database:', plan)
    } else {
      localStorage.setItem('safespace_crisis_plan', JSON.stringify(plan))
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Crisis Safety Plan</h2>
            <p className="text-sm text-text-secondary">Your personalized emergency support plan</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-hover rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="font-semibold mb-3">1. Warning Signs</h3>
            {plan.warning_signs.map((sign, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={sign}
                  onChange={(e) => updateItem('warning_signs', i, e.target.value)}
                  className="input flex-1"
                  placeholder="What tells you a crisis may be developing?"
                />
                {plan.warning_signs.length > 1 && (
                  <button onClick={() => removeItem('warning_signs', i)} className="p-2 hover:bg-hover rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addItem('warning_signs')} className="btn-secondary text-sm mt-2">
              <Plus className="w-4 h-4" /> Add Warning Sign
            </button>
          </div>

          <div>
            <h3 className="font-semibold mb-3">2. Internal Coping Strategies</h3>
            {plan.coping_strategies.map((strategy, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={strategy}
                  onChange={(e) => updateItem('coping_strategies', i, e.target.value)}
                  className="input flex-1"
                  placeholder="Things you can do without contacting anyone"
                />
                {plan.coping_strategies.length > 1 && (
                  <button onClick={() => removeItem('coping_strategies', i)} className="p-2 hover:bg-hover rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addItem('coping_strategies')} className="btn-secondary text-sm mt-2">
              <Plus className="w-4 h-4" /> Add Strategy
            </button>
          </div>

          <div>
            <h3 className="font-semibold mb-3">3. Support Contacts</h3>
            {plan.support_contacts.map((contact, i) => (
              <div key={i} className="card p-4 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={contact.name}
                    onChange={(e) => updateItem('support_contacts', i, { ...contact, name: e.target.value })}
                    className="input"
                    placeholder="Name"
                  />
                  <input
                    value={contact.phone}
                    onChange={(e) => updateItem('support_contacts', i, { ...contact, phone: e.target.value })}
                    className="input"
                    placeholder="Phone"
                  />
                  <div className="flex gap-2">
                    <input
                      value={contact.relationship}
                      onChange={(e) => updateItem('support_contacts', i, { ...contact, relationship: e.target.value })}
                      className="input flex-1"
                      placeholder="Relationship"
                    />
                    {plan.support_contacts.length > 1 && (
                      <button onClick={() => removeItem('support_contacts', i)} className="p-2 hover:bg-hover rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => addItem('support_contacts')} className="btn-secondary text-sm">
              <Plus className="w-4 h-4" /> Add Contact
            </button>
          </div>

          <div>
            <h3 className="font-semibold mb-3">4. Professional Contacts</h3>
            {plan.professional_contacts.map((contact, i) => (
              <div key={i} className="card p-4 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={contact.name}
                    onChange={(e) => updateItem('professional_contacts', i, { ...contact, name: e.target.value })}
                    className="input"
                    placeholder="Name/Organization"
                  />
                  <input
                    value={contact.phone}
                    onChange={(e) => updateItem('professional_contacts', i, { ...contact, phone: e.target.value })}
                    className="input"
                    placeholder="Phone"
                  />
                  <div className="flex gap-2">
                    <input
                      value={contact.type}
                      onChange={(e) => updateItem('professional_contacts', i, { ...contact, type: e.target.value })}
                      className="input flex-1"
                      placeholder="Type (therapist, hotline)"
                    />
                    {plan.professional_contacts.length > 1 && (
                      <button onClick={() => removeItem('professional_contacts', i)} className="p-2 hover:bg-hover rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => addItem('professional_contacts')} className="btn-secondary text-sm">
              <Plus className="w-4 h-4" /> Add Professional
            </button>
          </div>

          <div>
            <h3 className="font-semibold mb-3">5. Reasons for Living</h3>
            {plan.reasons_to_live.map((reason, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={reason}
                  onChange={(e) => updateItem('reasons_to_live', i, e.target.value)}
                  className="input flex-1"
                  placeholder="What makes life worth living?"
                />
                {plan.reasons_to_live.length > 1 && (
                  <button onClick={() => removeItem('reasons_to_live', i)} className="p-2 hover:bg-hover rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addItem('reasons_to_live')} className="btn-secondary text-sm mt-2">
              <Plus className="w-4 h-4" /> Add Reason
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-border p-6">
          <button onClick={handleSave} className="btn-primary w-full">
            Save Safety Plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default CrisisSafetyPlan
