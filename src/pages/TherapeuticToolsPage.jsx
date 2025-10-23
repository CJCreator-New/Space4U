import { useState, useEffect } from 'react'
import { Brain, Heart, Moon, Shield, ClipboardList, Wind, Activity, TrendingUp, Clock, Star, Crown, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CBTThoughtRecord from '../components/therapeutic/CBTThoughtRecord'
import DBTSkillsModule from '../components/therapeutic/DBTSkillsModule'
import MindfulnessExercises from '../components/therapeutic/MindfulnessExercises'
import SleepHygieneTracker from '../components/therapeutic/SleepHygieneTracker'
import CrisisSafetyPlan from '../components/therapeutic/CrisisSafetyPlan'
import MentalHealthAssessments from '../components/therapeutic/MentalHealthAssessments'
import SafeComponent from '../components/SafeComponent'
import { getPremiumStatus } from '../utils/premiumUtils'
import DisclaimerBanner from '../components/wellness/DisclaimerBanner'
import ResearchCard from '../components/wellness/ResearchCard'
import CrisisResources from '../components/wellness/CrisisResources'
import { disclaimers } from '../data/disclaimers'
import { researchCitations } from '../data/researchCitations'

const TOOLS_CONFIG = [
  { id: 'cbt', icon: Brain, gradient: 'from-blue-500 to-cyan-500', premium: false },
  { id: 'dbt', icon: Heart, gradient: 'from-pink-500 to-rose-500', premium: true },
  { id: 'mindfulness', icon: Wind, gradient: 'from-purple-500 to-indigo-500', premium: false },
  { id: 'sleep', icon: Moon, gradient: 'from-indigo-500 to-blue-500', premium: true },
  { id: 'crisis', icon: Shield, gradient: 'from-red-500 to-orange-500', premium: false },
  { id: 'assessments', icon: ClipboardList, gradient: 'from-green-500 to-emerald-500', premium: false }
]

function TherapeuticToolsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [activeTool, setActiveTool] = useState(null)
  const [toolStats, setToolStats] = useState({})
  const { isPremium } = getPremiumStatus()

  const TOOLS = TOOLS_CONFIG.map(tool => ({
    ...tool,
    name: t(`therapy.tools.${tool.id}.name`),
    description: t(`therapy.tools.${tool.id}.description`),
    category: t(`therapy.tools.${tool.id}.category`)
  }))

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('safespace_tool_usage') || '{}')
    setToolStats(stats)
  }, [])

  const trackToolUsage = (tool) => {
    if (tool.premium && !isPremium) {
      navigate('/premium')
      return
    }
    const stats = JSON.parse(localStorage.getItem('safespace_tool_usage') || '{}')
    stats[tool.id] = (stats[tool.id] || 0) + 1
    localStorage.setItem('safespace_tool_usage', JSON.stringify(stats))
    setToolStats(stats)
    setActiveTool(tool.id)
  }

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

  const totalUsage = Object.values(toolStats).reduce((sum, count) => sum + count, 0)
  const mostUsed = TOOLS.find(t => t.id === Object.keys(toolStats).sort((a, b) => (toolStats[b] || 0) - (toolStats[a] || 0))[0])

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8 mb-6 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">{t('therapy.title')}</h1>
            {isPremium && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                <Crown size={16} />
                {t('common.premium')}
              </div>
            )}
          </div>
          <p className="text-white/90 text-lg mb-4">{t('therapy.subtitle')}</p>
          
          {totalUsage > 0 && (
            <div className="flex gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="flex items-center gap-2 text-white">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">{t('therapy.sessions', { count: totalUsage })}</span>
                </div>
              </div>
              {mostUsed && (
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="flex items-center gap-2 text-white">
                    <Star size={16} />
                    <span className="text-sm font-medium">{t('therapy.mostUsed', { tool: mostUsed.name })}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Clinical Disclaimer */}
      <div className="mb-6">
        <DisclaimerBanner disclaimer={disclaimers.therapeutic} collapsible={false} />
      </div>

      {/* Research Support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ResearchCard citations={researchCitations.cbt} title="CBT Research" />
        <ResearchCard citations={researchCitations.dbt} title="DBT Research" />
        <ResearchCard citations={researchCitations.mindfulness} title="Mindfulness Research" />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map(tool => {
          const Icon = tool.icon
          const usageCount = toolStats[tool.id] || 0
          return (
            <button
              key={tool.id}
              onClick={() => trackToolUsage(tool)}
              className={`card p-6 text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${
                tool.premium && !isPremium ? 'opacity-70' : ''
              }`}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              
              <div className="relative z-10">
                {/* Icon with Gradient */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {tool.category}
                  </span>
                  {tool.premium && !isPremium && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      <Crown size={10} />
                      {t('common.premium')}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-primary transition-colors">{tool.name}</h3>
                <p className="text-text-secondary text-sm mb-4">{tool.description}</p>
                
                {/* Usage Stats */}
                {usageCount > 0 && (
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Clock size={14} />
                    <span>{t('therapy.usedTimes', { count: usageCount })}</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Crisis Resources */}
      <div className="mt-8">
        <CrisisResources />
      </div>
    </div>
  
    </SafeComponent>
  )
}

export default TherapeuticToolsPage
