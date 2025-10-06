import { useState } from 'react'
import { BarChart3, Tag, Moon } from 'lucide-react'
import TagAnalytics from '../components/priority5/TagAnalytics'
import SleepAnalytics from '../components/priority5/SleepAnalytics'
import MoodPrediction from '../components/priority5/MoodPrediction'

function AdvancedAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('tags')

  const tabs = [
    { id: 'tags', label: 'Tag Analytics', icon: Tag },
    { id: 'sleep', label: 'Sleep Patterns', icon: Moon },
    { id: 'prediction', label: 'Mood Prediction', icon: BarChart3, premium: true }
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Advanced Analytics</h1>
        <p className="text-text-secondary">Deep insights into your mental health patterns</p>
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

      <div>
        {activeTab === 'tags' && <TagAnalytics />}
        {activeTab === 'sleep' && <SleepAnalytics />}
        {activeTab === 'prediction' && <MoodPrediction />}
      </div>
    </div>
  )
}

export default AdvancedAnalyticsPage
