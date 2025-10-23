import { motion } from 'framer-motion'
import { Sparkles, Heart, Users, TrendingUp, ArrowRight } from 'lucide-react'

function OnboardingComplete({ userData, onFinish }) {
  const features = [
    { icon: Heart, label: 'Track your mood daily', color: 'text-pink-600' },
    { icon: Users, label: 'Join supportive circles', color: 'text-blue-600' },
    { icon: TrendingUp, label: 'View your insights', color: 'text-green-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center">
          {/* Celebration Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="relative mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Confetti particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
                }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][i % 4]
                }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Welcome, {userData.username}! 🎉
            </h1>
            <p className="text-gray-600 mb-8">
              Your safe space is ready. Let's start your wellness journey together.
            </p>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-4xl">{userData.avatar}</div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">{userData.username}</p>
                <p className="text-sm text-gray-600">{userData.interests?.length || 0} interests selected</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white rounded-xl p-3"
                >
                  <feature.icon className={`w-6 h-6 ${feature.color} mx-auto mb-2`} />
                  <p className="text-xs text-gray-700 leading-tight">{feature.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="space-y-3"
          >
            <button
              onClick={onFinish}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-xs text-gray-500">
              Remember: Your data stays private and secure on your device
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default OnboardingComplete
