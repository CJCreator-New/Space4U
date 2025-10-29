import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'

const motivationalQuotes = [
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown",
    category: "self-care"
  },
  {
    text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious. Having feelings doesn't make you a negative person. It makes you human.",
    author: "Lori Deschene",
    category: "validation"
  },
  {
    text: "Healing takes time, and asking for help is a courageous step.",
    author: "Mariska Hargitay",
    category: "healing"
  },
  {
    text: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.",
    author: "Julian Seifter",
    category: "identity"
  },
  {
    text: "Mental health problems don't define who you are. They are something you experience. You walk in the rain and you feel the rain, but you are not the rain.",
    author: "Matt Haig",
    category: "perspective"
  },
  {
    text: "There is hope, even when your brain tells you there isn't.",
    author: "John Green",
    category: "hope"
  },
  {
    text: "Self-care is how you take your power back.",
    author: "Lalah Delia",
    category: "empowerment"
  },
  {
    text: "It's okay to not be okay. It's okay to ask for help. It's okay to take time for yourself.",
    author: "Unknown",
    category: "permission"
  },
  {
    text: "You are stronger than you think. You have gotten through every bad day in your life, and you are undefeated.",
    author: "Unknown",
    category: "strength"
  },
  {
    text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Unknown",
    category: "recovery"
  },
  {
    text: "Your illness does not define you. Your strength and courage does.",
    author: "Unknown",
    category: "courage"
  },
  {
    text: "Sometimes the bravest thing you can do is ask for help.",
    author: "Unknown",
    category: "bravery"
  },
  {
    text: "Be gentle with yourself. You're doing the best you can.",
    author: "Unknown",
    category: "compassion"
  },
  {
    text: "Progress, not perfection.",
    author: "Unknown",
    category: "growth"
  },
  {
    text: "Your feelings are valid. Your struggles are real. You deserve support.",
    author: "Unknown",
    category: "validation"
  }
]

export default function MotivationalQuoteWidget() {
  const [currentQuote, setCurrentQuote] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Set initial quote
    setCurrentQuote(getRandomQuote())
  }, [])

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    return motivationalQuotes[randomIndex]
  }

  const handleRefresh = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentQuote(getRandomQuote())
      setIsAnimating(false)
    }, 300)
  }

  if (!currentQuote) return null

  const getCategoryColor = (category) => {
    const colors = {
      'self-care': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
      'validation': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'healing': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'identity': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      'perspective': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
      'hope': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      'empowerment': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      'permission': 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
      'strength': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      'recovery': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
      'courage': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
      'bravery': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      'compassion': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      'growth': 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300'
    }
    return colors[category] || colors['validation']
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 rounded-xl p-6 shadow-lg text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-yellow-300" />
            <h3 className="font-bold text-lg">Daily Inspiration</h3>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 hover:bg-white/20 rounded-lg transition-all ${isAnimating ? 'animate-spin' : ''}`}
            title="New quote"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <blockquote className="mb-4">
              <p className="text-lg font-medium leading-relaxed mb-3 italic">
                "{currentQuote.text}"
              </p>
              <footer className="text-sm text-white/90">
                — {currentQuote.author}
              </footer>
            </blockquote>

            {/* Category Tag */}
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(currentQuote.category)}`}>
                {currentQuote.category}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Tip */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-white/80">
            💡 Tap the refresh icon for a new quote anytime
          </p>
        </div>
      </div>
    </motion.div>
  )
}
