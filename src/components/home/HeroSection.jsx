import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Heart, Users, ArrowRight } from 'lucide-react'

export default function HeroSection({ user }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 md:p-12 mb-8 shadow-2xl"
    >
      <div className="absolute inset-0 bg-black/10" />
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Your Safe Space 🌟
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl"
          >
            Track your wellness, connect with support, and discover tools for a healthier mind.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-wrap gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/gratitude')}
            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Sparkles size={20} />
            Get Started
            <ArrowRight size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/professional')}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
          >
            <Heart size={20} />
            Find Support
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/circles')}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
          >
            <Users size={20} />
            Join a Circle
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
