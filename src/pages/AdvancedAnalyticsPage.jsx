import { useState } from 'react'
import { BarChart3, Tag, Moon, BookOpen, Info, AlertTriangle } from 'lucide-react'
import TagAnalytics from '../components/priority5/TagAnalytics'
import SleepAnalytics from '../components/priority5/SleepAnalytics'
import MoodPrediction from '../components/priority5/MoodPrediction'
import SafeComponent from '../components/SafeComponent'

function AdvancedAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('tags')

  const tabs = [
    { id: 'tags', label: 'Tag Analytics', icon: Tag },
    { id: 'sleep', label: 'Sleep Patterns', icon: Moon },
    { id: 'prediction', label: 'Mood Prediction', icon: BarChart3, premium: true }
  ]

  const getEducationalContent = () => {
    switch(activeTab) {
      case 'tags':
        return {
          title: 'Understanding Mood Tags',
          content: 'Research shows that identifying specific emotions (emotional granularity) helps regulate them better. Studies by Dr. Lisa Feldman Barrett found that people who can precisely label their emotions have better mental health outcomes.',
          source: 'Barrett, L. F. (2017). How Emotions Are Made'
        }
      case 'sleep':
        return {
          title: 'Sleep & Mental Health Connection',
          content: 'Sleep and mood are bidirectionally related. Poor sleep can worsen mental health, while mental health issues can disrupt sleep. The CDC recommends 7-9 hours of sleep for adults for optimal mental and physical health.',
          source: 'Walker, M. (2017). Why We Sleep'
        }
      case 'prediction':
        return {
          title: 'Predictive Analytics in Mental Health',
          content: 'Machine learning can identify patterns in mood data, but predictions are probabilistic, not deterministic. These insights should inform self-awareness, not replace clinical judgment or professional assessment.',
          source: 'Torous et al. (2020). Digital Mental Health'
        }
      default:
        return null
    }
  }

  const educational = getEducationalContent()

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto p-4 pb-24">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 mb-6 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Advanced Analytics</h1>
          </div>
          <p className="text-white/90 text-lg">Research-backed insights into your mental health patterns</p>
        </div>
      </div>

      {/* General Disclaimer */}
      <div className="card p-4 bg-yellow-50 border border-yellow-200 mb-6">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1 text-gray-900">Analytics Disclaimer</p>
            <p className="text-gray-700">
              These analytics use statistical methods to identify patterns in your data. They are educational tools for self-reflection, 
              not diagnostic instruments. Correlation does not imply causation. For clinical assessment, consult a mental health professional.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={18} />
              {tab.label}
              {tab.premium && <span className="text-xs">💎</span>}
            </button>
          )
        })}
      </div>

      {/* Educational Content */}
      {educational && (
        <div className="card p-4 bg-blue-50 border border-blue-200 mb-6">
          <div className="flex gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1 text-gray-900">{educational.title}</p>
              <p className="text-gray-700 mb-2">{educational.content}</p>
              <p className="text-xs text-gray-500 italic">Source: {educational.source}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        {activeTab === 'tags' && <TagAnalytics />}
        {activeTab === 'sleep' && <SleepAnalytics />}
        {activeTab === 'prediction' && <MoodPrediction />}
      </div>

      {/* Research-Based Tips */}
      <div className="mt-8 space-y-4">
        <div className="card p-4 bg-purple-50 border border-purple-200">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1 text-gray-900">How to Use These Insights</p>
              <ul className="text-gray-700 space-y-1">
                <li>• Look for patterns over time, not single data points</li>
                <li>• Consider external factors (stress, life events, seasons)</li>
                <li>• Use insights to inform conversations with your therapist</li>
                <li>• Remember: self-tracking is a tool, not a solution</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-4 bg-green-50 border border-green-200">
          <div className="flex gap-3">
            <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1 text-gray-900">Evidence-Based Practices</p>
              <p className="text-gray-700">
                The analytics methods used here are based on research in affective science, sleep medicine, and computational psychiatry. 
                However, individual experiences vary, and these tools should complement, not replace, professional mental health care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    </SafeComponent>
  )
}

export default AdvancedAnalyticsPage
