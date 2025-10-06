import { useState } from 'react'
import { Brain, Heart, Moon, Shield, ClipboardList, Wind, Activity } from 'lucide-react'
import CBTThoughtRecord from '../components/therapeutic/CBTThoughtRecord'
import DBTSkillsModule from '../components/therapeutic/DBTSkillsModule'
import MindfulnessExercises from '../components/therapeutic/MindfulnessExercises'
import SleepHygieneTracker from '../components/therapeutic/SleepHygieneTracker'
import CrisisSafetyPlan from '../components/therapeutic/CrisisSafetyPlan'
import MentalHealthAssessments from '../components/therapeutic/MentalHealthAssessments'

const TOOLS = [
  { id: 'cbt', name: 'CBT Thought Record', icon: Brain, color: 'blue', description: 'Challenge negative thought patterns' },
  { id: 'dbt', name: 'DBT Skills', icon: Heart, color: 'pink', description: 'Practice dialectical behavior therapy' },
  { id: 'mindfulness', name: 'Mindfulness', icon: Wind, color: 'purple', description: 'Guided meditation exercises' },
  { id: 'sleep', name: 'Sleep Tracker', icon: Moon, color: 'indigo', description: 'Monitor sleep patterns' },
  { id: 'crisis', name: 'Crisis Plan', icon: Shield, color: 'red', description: 'Emergency safety planning' },
  { id: 'assessments', name: 'Assessments', icon: ClipboardList, color: 'green', description: 'Mental health screening tools' }
]

function TherapeuticToolsPage() {
  const [activeTool, setActiveTool] = useState(null)

  const renderTool = () => {
    switch(activeTool) {
      case 'cbt': return <CBTThoughtRecord onClose={() => setActiveTool(null)} />
      case 'dbt': return <DBTSkillsModule onClose={() => setActiveTool(null)} />
      case 'mindfulness': return <MindfulnessExercises onClose={() => setActiveTool(null)} />
      case 'sleep': return <SleepHygieneTracker onClose={() => setActiveTool(null)} />
      case 'crisis': return <CrisisSafetyPlan onClose={() => setActiveTool(null)} />
      case 'assessments': return <MentalHealthAssessments onClose={() => setActiveTool(null)} />
      default: return null
    }
  }

  if (activeTool) return renderTool()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Therapeutic Tools</h1>
        </div>
        <p className="text-text-secondary">Evidence-based tools to support your mental wellness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map(tool => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`card p-6 text-left hover:scale-105 transition-transform group`}
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

export default TherapeuticToolsPage
