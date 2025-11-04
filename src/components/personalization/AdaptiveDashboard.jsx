import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, Heart, Brain, Moon, Users, BookOpen, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { getMostUsedFeatures, getTimeBasedFeatures } from '../../utils/usageTracker'
import { generateRecommendations, checkInactiveFeatures, dismissRecommendation } from '../../utils/recommendationEngine'
import { isPersonalizationEnabled } from '../../utils/personalizationEngine'
import SmartCard from './SmartCard'
import InsightCard from './InsightCard'

const FEATURE_CONFIG = {
  'gratitude': { name: 'Gratitude Journal', icon: Heart, path: '/gratitude', color: 'text-pink-500' },
  'habits': { name: 'Habit Tracker', icon: Target, path: '/habits', color: 'text-green-500' },
  'mood-tracker': { name: 'Mood Tracker', icon: Heart, path: '/', color: 'text-blue-500' },
  'circles': { name: 'Support Circles', icon: Users, path: '/circles', color: 'text-purple-500' },
  'wellness': { name: 'Wellness Score', icon: TrendingUp, path: '/wellness', color: 'text-teal-500' },
  'insights': { name: 'Insights', icon: Brain, path: '/insights', color: 'text-indigo-500' },
  'resources': { name: 'Resources', icon: BookOpen, path: '/resources', color: 'text-orange-500' },
  'sleep-tracker': { name: 'Sleep Tracker', icon: Moon, path: '/tools', color: 'text-blue-600' }
}

function AdaptiveDashboard() {
  const navigate = useNavigate()
  const [topFeatures, setTopFeatures] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [showInactivePrompt, setShowInactivePrompt] = useState(false)
  const enabled = isPersonalizationEnabled()

  // Animation variants for staggered card entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  }

  useEffect(() => {
    if (!enabled) return

    const mostUsed = getMostUsedFeatures(6)
    const timeBased = getTimeBasedFeatures()
    const combined = [...new Set([...timeBased, ...mostUsed])].slice(0, 6)
    
    const features = combined.length > 0 ? combined : ['mood-tracker', 'gratitude', 'habits', 'circles', 'wellness', 'insights']
    setTopFeatures(features)

    const recs = generateRecommendations()
    setRecommendations(recs)

    const inactive = checkInactiveFeatures()
    setShowInactivePrompt(inactive)
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>Personalized for you</span>
      </div>

      {showInactivePrompt && (
        <div className="card p-4 bg-blue-50 border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">We miss you! 💙</p>
          <p className="text-sm text-blue-700 mb-3">It's been a few days since your last mood check-in. How are you feeling today?</p>
          <button onClick={() => navigate('/')} className="btn-primary text-sm">
            Quick Mood Check-In
          </button>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold mb-3">Your Top Tools</h3>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {topFeatures.map((featureId, index) => {
            const config = FEATURE_CONFIG[featureId]
            if (!config) return null
            return (
              <motion.div key={featureId} variants={cardVariants}>
                <SmartCard
                  feature={{
                    name: config.name,
                    icon: config.icon,
                    path: config.path,
                    gradient: 'from-primary to-purple-500'
                  }}
                  priority="medium"
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3">Recommended for You</h3>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {recommendations.map((rec, index) => {
              const config = FEATURE_CONFIG[rec.featureId]
              if (!config) return null
              return (
                <motion.div key={rec.featureId} variants={cardVariants}>
                  <SmartCard
                    feature={{
                      name: config.name,
                      icon: config.icon,
                      path: config.path,
                      description: rec.reason,
                      gradient: 'from-primary to-purple-500'
                    }}
                    priority={rec.priority}
                    isRecommended
                    onDismiss={() => dismissRecommendation(rec.featureId)}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdaptiveDashboard
