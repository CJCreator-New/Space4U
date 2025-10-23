import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Card, CardBody, Stack, IconButton, Collapse, useDisclosure } from '@chakra-ui/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Crown, Sparkles, Smile, Heart, BookOpen, Menu, ChevronDown, TrendingUp, Users, Brain, Zap } from 'lucide-react'
import MoodTracker from '../components/MoodTracker'
import MoodCalendar from '../components/MoodCalendar'
import MoodTrends from '../components/MoodTrends'
import { getPremiumStatus } from '../utils/premiumUtils'

const quickActions = [
  { id: 'mood', icon: Smile, label: 'Log Mood', path: null, color: 'from-indigo-500 to-purple-600' },
  { id: 'gratitude', icon: Heart, label: 'Gratitude', path: '/gratitude', color: 'from-pink-500 to-red-600' },
  { id: 'journal', icon: BookOpen, label: 'Journal', path: '/advanced-tools', color: 'from-blue-500 to-cyan-600' }
]

const featureGroups = [
  {
    title: 'Daily Wellness',
    icon: Heart,
    items: [
      { icon: '❤️', label: 'Gratitude Journal', path: '/gratitude', desc: 'Daily gratitude practice' },
      { icon: '🎯', label: 'Habit Tracker', path: '/habits', desc: 'Build healthy habits' },
      { icon: '💭', label: 'Emotion Wheel', path: '/emotions', desc: 'Explore your emotions' }
    ]
  },
  {
    title: 'Tools & Resources',
    icon: Brain,
    items: [
      { icon: '🛠️', label: 'Coping Skills', path: '/coping-skills', desc: '100+ strategies' },
      { icon: '⏰', label: 'Reminders', path: '/reminders', desc: 'Stay on track' },
      { icon: '🧰', label: 'Therapy Tools', path: '/tools', desc: 'CBT, DBT, Mindfulness' }
    ]
  },
  {
    title: 'Insights & Growth',
    icon: TrendingUp,
    items: [
      { icon: '📊', label: 'Wellness Score', path: '/wellness', desc: 'Track your progress' },
      { icon: '🚀', label: 'Advanced Tools', path: '/advanced-tools', desc: 'Deep dive features' },
      { icon: '🏆', label: 'Challenges', path: '/gamification', desc: 'Gamified wellness' }
    ]
  },
  {
    title: 'Community & Support',
    icon: Users,
    items: [
      { icon: '🤝', label: 'Social Hub', path: '/social', desc: 'Connect with others' },
      { icon: '📊', label: 'Analytics', path: '/analytics', desc: 'Deep insights' },
      { icon: '🏥', label: 'Professional', path: '/professional', desc: 'Therapist integration' }
    ]
  }
]

function EnhancedHomePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showMoodTracker, setShowMoodTracker] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [expandedGroups, setExpandedGroups] = useState({})
  const { isPremium, trialActive, daysLeft } = getPremiumStatus()

  useEffect(() => {
    const userData = localStorage.getItem('safespace_user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const toggleGroup = (title) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <Box maxW="1200px" mx="auto" p={4}>
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          color="white"
          mb={6}
          overflow="hidden"
          position="relative"
        >
          <CardBody p={8}>
            <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" spacing={4}>
              <Stack direction="row" align="center" spacing={4}>
                {user?.avatar && (
                  <Box
                    w="80px"
                    h="80px"
                    bg="whiteAlpha.200"
                    backdropFilter="blur(10px)"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="3xl"
                    border="2px solid"
                    borderColor="whiteAlpha.300"
                    position="relative"
                  >
                    {user.avatar}
                    {isPremium && (
                      <Box
                        position="absolute"
                        top="-4px"
                        right="-4px"
                        w="24px"
                        h="24px"
                        bg="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Crown size={14} />
                      </Box>
                    )}
                  </Box>
                )}
                <Box>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}
                  >
                    Welcome back{user?.username ? `, ${user.username}` : ''}! 👋
                  </motion.h1>
                  <p style={{ opacity: 0.9 }}>Your mind matters. Let's check in today.</p>
                </Box>
              </Stack>

              {/* Quick Actions Menu */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton
                    icon={<Menu />}
                    aria-label="Quick actions menu"
                    bg="whiteAlpha.200"
                    _hover={{ bg: 'whiteAlpha.300' }}
                    color="white"
                    size="lg"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="bg-white rounded-xl shadow-2xl p-2 min-w-[200px] z-50"
                    sideOffset={5}
                  >
                    {quickActions.map((action) => (
                      <DropdownMenu.Item
                        key={action.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer outline-none"
                        onSelect={() => action.path ? navigate(action.path) : setShowMoodTracker(true)}
                      >
                        <action.icon size={20} className="text-gray-700" />
                        <span className="font-medium text-gray-800">{action.label}</span>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Stack>
          </CardBody>
        </Card>
      </motion.div>

      {/* Premium Banner */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/premium">
            <Card
              bg="linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
              mb={6}
              _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
              transition="all 0.3s"
              cursor="pointer"
            >
              <CardBody p={6}>
                <Stack direction="row" justify="space-between" align="center">
                  <Stack direction="row" align="center" spacing={4}>
                    <Box
                      w="48px"
                      h="48px"
                      bg="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Crown size={24} color="white" />
                    </Box>
                    <Box>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937' }}>
                        Upgrade to Premium
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                        Unlock unlimited features and insights
                      </p>
                    </Box>
                  </Stack>
                  <Sparkles size={24} color="#f59e0b" />
                </Stack>
              </CardBody>
            </Card>
          </Link>
        </motion.div>
      )}

      {/* Mood Tracker */}
      <AnimatePresence>
        {showMoodTracker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Box mb={6}>
              <MoodTracker onMoodLogged={() => { setRefreshKey(prev => prev + 1); setShowMoodTracker(false) }} />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood Visualizations */}
      <Stack spacing={6} mb={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MoodCalendar key={refreshKey} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MoodTrends key={refreshKey} />
        </motion.div>
      </Stack>

      {/* Feature Groups */}
      <Box mb={6}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Wellness Tools
        </h2>
        <Stack spacing={4}>
          {featureGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card>
                <CardBody p={0}>
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    aria-expanded={expandedGroups[group.title]}
                    aria-controls={`group-${group.title}`}
                  >
                    <Stack direction="row" align="center" spacing={3}>
                      <Box
                        w="40px"
                        h="40px"
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <group.icon size={20} color="white" />
                      </Box>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{group.title}</h3>
                    </Stack>
                    <motion.div
                      animate={{ rotate: expandedGroups[group.title] ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <Collapse in={expandedGroups[group.title]}>
                    <Box id={`group-${group.title}`} p={4} pt={0}>
                      <div className="grid gap-3 md:grid-cols-3">
                        {group.items.map((item) => (
                          <Link key={item.path} to={item.path}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                              <Stack spacing={2}>
                                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                                <h4 style={{ fontWeight: '600', fontSize: '0.875rem' }}>{item.label}</h4>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.desc}</p>
                              </Stack>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </Box>
                  </Collapse>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </Box>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}
      >
        <IconButton
          icon={<Zap />}
          aria-label="Quick log mood"
          size="lg"
          borderRadius="full"
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          color="white"
          boxShadow="xl"
          _hover={{ transform: 'scale(1.1)' }}
          onClick={() => setShowMoodTracker(true)}
          w="60px"
          h="60px"
        />
      </motion.div>
    </Box>
  )
}

export default EnhancedHomePage
