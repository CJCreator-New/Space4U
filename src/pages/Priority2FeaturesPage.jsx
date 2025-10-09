import { useState } from 'react'
import { AlertTriangle, BookOpen, Clock, Heart, Calendar, Pill, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TriggerTracker from '../components/priority2/TriggerTracker'
import JournalingPrompts from '../components/priority2/JournalingPrompts'
import WorryScheduler from '../components/priority2/WorryScheduler'
import SelfCompassion from '../components/priority2/SelfCompassion'
import TherapyPrep from '../components/priority2/TherapyPrep'
import MedicationTracker from '../components/priority2/MedicationTracker'
import SafeComponent from '../components/SafeComponent'
import { getPremiumStatus } from '../utils/premiumUtils'

const TOOLS = [
  { id: 'triggers', name: 'Trigger Tracker', icon: AlertTriangle, color: 'red', description: 'Identify mood triggers', premium: false },
  { id: 'journal', name: 'Journaling Prompts', icon: BookOpen, color: 'blue', description: '500+ therapeutic prompts', premium: true },
  { id: 'worry', name: 'Worry Time', icon: Clock, color: 'yellow', description: 'Schedule worry periods', premium: false },
  { id: 'compassion', name: 'Self-Compassion', icon: Heart, color: 'pink', description: 'Practice self-kindness', premium: false },
  { id: 'therapy', name: 'Therapy Prep', icon: Calendar, color: 'purple', description: 'Prepare for sessions', premium: true },
  { id: 'medication', name: 'Medications', icon: Pill, color: 'green', description: 'Track medications', premium: true }
]

function Priority2FeaturesPage() {
  const navigate = useNavigate()
  const [activeTool, setActiveTool] = useState(null)
  const { isPremium } = getPremiumStatus()
  
  const handleToolClick = (tool) => {
    if (tool.premium && !isPremium) {
      navigate('/premium')
      return
    }
    setActiveTool(tool.id)
  }

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
    <SafeComponent>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Advanced Wellness Tools</h1>
          {isPremium && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium">
              <Crown size={12} />
              Premium
            </div>
          )}
        </div>
        <p className="text-text-secondary">Additional tools for deeper mental health support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map(tool => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className={`card p-6 text-left hover:scale-105 transition-transform group ${
                tool.premium && !isPremium ? 'opacity-70' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${tool.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 text-${tool.color}-500`} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">{tool.name}</h3>
                {tool.premium && !isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
              </div>
              <p className="text-text-secondary text-sm">{tool.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  
    </SafeComponent>
  )
}

export default Priority2FeaturesPage
