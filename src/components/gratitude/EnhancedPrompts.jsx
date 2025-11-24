import { useState } from 'react'
import { RefreshCw, Sparkles, Heart, Brain, Users, Briefcase, Leaf, X, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PROMPT_THEMES = [
  {
    id: 'general',
    name: 'General',
    icon: Sparkles,
    color: 'purple',
    prompts: [
      "What made you smile today?",
      "Who are you grateful for and why?",
      "What's a small win you had today?",
      "What's something beautiful you noticed?",
      "What challenge helped you grow?",
      "Who showed you kindness today?",
      "What's a comfort you're thankful for?",
      "What made you laugh recently?",
      "What's a skill you're grateful to have?",
      "What's something you're looking forward to?",
    ]
  },
  {
    id: 'relationships',
    name: 'Relationships',
    icon: Users,
    color: 'blue',
    prompts: [
      "Who made you feel loved today?",
      "What's a quality you appreciate in a friend?",
      "What meaningful conversation did you have?",
      "Who supported you when you needed it?",
      "What's a relationship you're thankful for?",
      "Who taught you something valuable?",
      "What's a memory with loved ones you're grateful for?",
      "Who made your day better just by being there?",
    ]
  },
  {
    id: 'personal',
    name: 'Personal Growth',
    icon: Brain,
    color: 'green',
    prompts: [
      "What did you learn today?",
      "What's a mistake that taught you something?",
      "What's a strength you discovered in yourself?",
      "What challenge did you overcome?",
      "What's something you're getting better at?",
      "What opportunity are you grateful for?",
      "What's a boundary you set that helped you?",
      "What failure led to growth?",
    ]
  },
  {
    id: 'work',
    name: 'Work & Career',
    icon: Briefcase,
    color: 'orange',
    prompts: [
      "What's a task you enjoyed doing?",
      "Who at work are you grateful for?",
      "What's a skill you used successfully?",
      "What opportunity did your job provide?",
      "What's a work achievement you're proud of?",
      "Who mentored or helped you professionally?",
      "What's a work-related comfort you're thankful for?",
    ]
  },
  {
    id: 'wellness',
    name: 'Health & Wellness',
    icon: Heart,
    color: 'pink',
    prompts: [
      "What's something about your body you appreciate?",
      "What healthy habit are you maintaining?",
      "What's a moment of peace you had?",
      "What support helped your well-being?",
      "What's a self-care activity you're grateful for?",
      "What rest or recovery are you thankful for?",
      "What's a health improvement you noticed?",
    ]
  },
  {
    id: 'nature',
    name: 'Nature & Environment',
    icon: Leaf,
    color: 'teal',
    prompts: [
      "What's beautiful in nature you saw today?",
      "What's a natural sound you're grateful for?",
      "What weather made you happy?",
      "What's a place in nature you love?",
      "What animal or plant brought you joy?",
      "What's a natural cycle you're thankful for?",
      "What environmental comfort do you have?",
    ]
  }
]

function EnhancedPrompts({ onPromptSelect, currentPrompt, onPromptThoughtsChange, selectedPrompts = [] }) {
  const [selectedTheme, setSelectedTheme] = useState('general')
  const [selectedPromptsState, setSelectedPromptsState] = useState(selectedPrompts)
  const [promptThoughts, setPromptThoughts] = useState({})
  const [expandedPrompt, setExpandedPrompt] = useState(null)

  const currentTheme = PROMPT_THEMES.find(t => t.id === selectedTheme)
  const randomPrompt = () => {
    const theme = PROMPT_THEMES.find(t => t.id === selectedTheme)
    return theme.prompts[Math.floor(Math.random() * theme.prompts.length)]
  }

  const handlePromptClick = (prompt) => {
    const isSelected = selectedPromptsState.includes(prompt)
    let newSelectedPrompts

    if (isSelected) {
      // Remove prompt
      newSelectedPrompts = selectedPromptsState.filter(p => p !== prompt)
      const newThoughts = { ...promptThoughts }
      delete newThoughts[prompt]
      setPromptThoughts(newThoughts)
    } else {
      // Add prompt
      newSelectedPrompts = [...selectedPromptsState, prompt]
    }

    setSelectedPromptsState(newSelectedPrompts)
    onPromptSelect(newSelectedPrompts)

    // Notify parent of thoughts change
    if (onPromptThoughtsChange) {
      onPromptThoughtsChange(promptThoughts)
    }
  }

  const handleThoughtChange = (prompt, thought) => {
    const newThoughts = { ...promptThoughts, [prompt]: thought }
    setPromptThoughts(newThoughts)

    if (onPromptThoughtsChange) {
      onPromptThoughtsChange(newThoughts)
    }
  }

  const removePrompt = (prompt) => {
    const newSelectedPrompts = selectedPromptsState.filter(p => p !== prompt)
    setSelectedPromptsState(newSelectedPrompts)
    onPromptSelect(newSelectedPrompts)

    const newThoughts = { ...promptThoughts }
    delete newThoughts[prompt]
    setPromptThoughts(newThoughts)

    if (onPromptThoughtsChange) {
      onPromptThoughtsChange(newThoughts)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-purple-500" />
          <span className="font-semibold text-lg text-gray-900 dark:text-white">Choose a Prompt</span>
        </div>
        <button
          onClick={() => handlePromptClick(randomPrompt())}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <RefreshCw size={14} />
          Random
        </button>
      </div>

      {/* Theme Selection */}
      <div className="flex flex-wrap gap-2">
        {PROMPT_THEMES.map((theme) => {
          const IconComponent = theme.icon
          const isSelected = selectedTheme === theme.id
          return (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected
                  ? `bg-${theme.color}-100 text-${theme.color}-800 ring-2 ring-${theme.color}-500 ring-offset-2 dark:ring-offset-gray-800`
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              <IconComponent size={14} />
              {theme.name}
            </button>
          )
        })}
      </div>

      {/* Current Theme Prompts */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <currentTheme.icon size={16} className={`text-${currentTheme.color}-500`} />
          <span className="font-semibold text-gray-900 dark:text-white">{currentTheme.name} Prompts</span>
        </div>
        <div className="space-y-2">
          {currentTheme.prompts.map((prompt, index) => {
            const isSelected = selectedPromptsState.includes(prompt)
            return (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-2 ${isSelected
                    ? `bg-${currentTheme.color}-50 text-${currentTheme.color}-900 dark:bg-${currentTheme.color}-900/30 dark:text-${currentTheme.color}-100`
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
              >
                {isSelected && <Check size={16} className={`mt-0.5 shrink-0 text-${currentTheme.color}-600`} />}
                <span className="text-sm">{prompt}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Prompts with Thoughts */}
      {selectedPromptsState.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-purple-500" />
            <span className="font-semibold text-purple-900 dark:text-purple-100">
              Selected Prompts ({selectedPromptsState.length})
            </span>
          </div>
          <div className="space-y-2">
            {selectedPromptsState.map((prompt, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800 overflow-hidden">
                <button
                  onClick={() => setExpandedPrompt(expandedPrompt === prompt ? null : prompt)}
                  className="w-full flex items-center justify-between p-3 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100">{prompt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removePrompt(prompt)
                      }}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <X size={14} />
                    </button>
                    {expandedPrompt === prompt ? <ChevronUp size={16} className="text-purple-400" /> : <ChevronDown size={16} className="text-purple-400" />}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedPrompt === prompt && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-3 pt-0 border-t border-purple-50 dark:border-purple-800/50">
                        <p className="text-xs text-gray-500 mb-2 mt-2">Add your thoughts about this prompt:</p>
                        <textarea
                          placeholder="Write your thoughts here..."
                          value={promptThoughts[prompt] || ''}
                          onChange={(e) => handleThoughtChange(prompt, e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedPrompts