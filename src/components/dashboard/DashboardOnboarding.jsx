import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardBody, Stack, IconButton } from '@chakra-ui/react'
import { X, ArrowRight, Sparkles } from 'lucide-react'

const steps = [
  {
    title: 'Welcome to Space4U! ðŸŽ‰',
    desc: 'Your personal mental wellness companion',
    action: 'Get Started'
  },
  {
    title: 'Track Your Mood ðŸ˜Š',
    desc: 'Log daily moods and see patterns over time',
    action: 'Next'
  },
  {
    title: 'Join Circles ðŸ¤',
    desc: 'Connect with supportive communities',
    action: 'Next'
  },
  {
    title: 'View Insights ðŸ“Š',
    desc: 'Get personalized wellness analytics',
    action: 'Finish'
  }
]

function DashboardOnboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem('space4u_dashboard_onboarding')
    if (!completed) {
      setTimeout(() => setShow(true), 500)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    localStorage.setItem('space4u_dashboard_onboarding', 'true')
    setShow(false)
    onComplete?.()
  }

  if (!show) return null

  const step = steps[currentStep]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={handleComplete}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card maxW="md" w="full">
            <CardBody p={8}>
              <Stack spacing={6}>
                <div className="flex justify-between items-start">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Sparkles size={32} className="text-purple-600" />
                  </motion.div>
                  <IconButton
                    icon={<X size={18} />}
                    aria-label="Close onboarding"
                    size="sm"
                    variant="ghost"
                    onClick={handleComplete}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h2>
                  <p className="text-gray-600">{step.desc}</p>
                </div>

                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <motion.div
                      key={index}
                      className="h-1 flex-1 rounded-full"
                      style={{
                        backgroundColor: index <= currentStep ? '#667eea' : '#e5e7eb'
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <span>{step.action}</span>
                  <ArrowRight size={20} />
                </motion.button>

                <button
                  onClick={handleComplete}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip tutorial
                </button>
              </Stack>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DashboardOnboarding

