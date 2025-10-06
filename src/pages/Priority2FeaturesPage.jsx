import { useState } from 'react'
import { AlertTriangle, BookOpen, Clock, Heart, Calendar, Pill } from 'lucide-react'
import TriggerTracker from '../components/priority2/TriggerTracker'
import JournalingPrompts from '../components/priority2/JournalingPrompts'
import WorryScheduler from '../components/priority2/WorryScheduler'
import SelfCompassion from '../components/priority2/SelfCompassion'
import TherapyPrep from '../components/priority2/TherapyPrep'
import MedicationTracker from '../components/priority2/MedicationTracker'

const TOOLS = [
  { id: 'triggers', name: 'Trigger Tracker', icon: AlertTriangle, color: 'red', description: 'Identify mood triggers' },
  { id: 'journal', name: 'Journaling Prompts', icon: BookOpen, color: 'blue', description: '500+ therapeutic prompts' },
  { id: 'worry', name: 'Worry Time', icon: Clock, color: 'yellow', description: 'Schedule worry periods' },
  { id: 'compassion', name: 'Self-Compassion', icon: Heart, color: 'pink', description: 'Practice self-kindness' },
  { id: 'therapy', name: 'Therapy Prep', icon: Calendar, color: 'purple', description: 'Prepare for sessions' },
  { id: 'medication', name: 'Medications', icon: Pill, color: 'green', description: 'Track medications' }
]

function Priority2FeaturesPage() {
  const [activeTool, setActiveTool] = useState(null)

  const renderTool = () => {
    switch(activeTool) {
      case 'triggers': return <TriggerTracker onClose={() => setActiveTool(null)} />
      case 'journal': return <JournalingPrompts onClose={() => setActiveTool(null)} />
      case 'worry': return <WorryScheduler onClose={() => setActiveTool(null)} />
      case 'compassion': return <SelfCompassion onClose={() => setActiveTool(null)} />
      case 'therapy': return <TherapyPrep onClose={() => setActiveTool(null)} />
      case 'medication': return <MedicationTracker onClose={() => setActiveTool(null)} />
      default: return null
    }
  }

  if (activeTool) return renderTool()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Wellness Tools</h1>
        <p className="text-text-secondary">Additional tools for deeper mental health support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map(tool => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="card p-6 text-left hover:scale-105 transition-transform group"
            >
              <div className={`w-12 h-12 rounded-xl bg-${tool.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 text-${tool.color}-500`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-text-secondary text-sm">{tool.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Priority2FeaturesPage
