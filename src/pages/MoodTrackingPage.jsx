import { useState } from 'react'
import { motion } from 'framer-motion'
import EnhancedMoodTracker from '../components/mood/EnhancedMoodTracker'
import EnhancedMoodTrends from '../components/mood/EnhancedMoodTrends'
import MoodCalendar from '../components/MoodCalendar'
import SafeComponent from '../components/SafeComponent'

const MotionDiv = motion.div

function MoodTrackingPage() {
  const [activeTab, setActiveTab] = useState('log')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleMoodLogged = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-2">Mood Tracking</h1>
        <p className="text-gray-600">
          Track your daily moods and discover patterns in your emotional well-being
        </p>
      </MotionDiv>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('log')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'log' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📝 Log Mood
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'trends' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📈 Trends
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-6 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'calendar' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📅 Calendar
        </button>
      </div>

      {activeTab === 'log' && (
        <SafeComponent>
          <EnhancedMoodTracker onMoodLogged={handleMoodLogged} />
        </SafeComponent>
      )}

      {activeTab === 'trends' && (
        <SafeComponent>
          <EnhancedMoodTrends key={refreshKey} />
        </SafeComponent>
      )}

      {activeTab === 'calendar' && (
        <SafeComponent>
          <MoodCalendar key={refreshKey} />
        </SafeComponent>
      )}

      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500"
      >
        <h3 className="font-semibold mb-2">💡 Tips for Better Mood Tracking</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Log your mood at the same time each day for consistency</p>
          <p>• Add notes to remember what influenced your mood</p>
          <p>• Use tags to identify patterns and triggers</p>
          <p>• Review your trends weekly to spot improvements</p>
        </div>
      </MotionDiv>
    </div>
  )
}

export default MoodTrackingPage
