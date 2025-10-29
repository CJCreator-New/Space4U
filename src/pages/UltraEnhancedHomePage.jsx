import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSpring, animated, useTrail, config } from 'react-spring'
import { useInView } from 'react-intersection-observer'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Box, Card, CardBody, Stack, IconButton } from '@chakra-ui/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Crown, Sparkles, Smile, Heart, BookOpen, Menu, TrendingUp, Users, Brain, Zap } from 'lucide-react'
import MoodTracker from '../components/MoodTracker'
import MoodCalendar from '../components/MoodCalendar'
import MoodTrends from '../components/MoodTrends'
import { getPremiumStatus } from '../utils/premiumUtils'

const quickActions = [
  { id: 'mood', icon: Smile, label: 'Log Mood', color: '#667eea' },
  { id: 'gratitude', icon: Heart, label: 'Gratitude', path: '/gratitude', color: '#ec4899' },
  { id: 'journal', icon: BookOpen, label: 'Journal', path: '/advanced-tools', color: '#3b82f6' },
  { id: 'coping', icon: Brain, label: 'Coping', path: '/coping-skills', color: '#8b5cf6' }
]

const featureGroups = [
  {
    title: 'Daily Wellness',
    items: [
      { icon: '❤️', label: 'Gratitude', path: '/gratitude' },
      { icon: '🎯', label: 'Habits', path: '/habits' },
      { icon: '💭', label: 'Emotions', path: '/emotions' }
    ]
  },
  {
    title: 'Tools & Resources',
    items: [
      { icon: '🛠️', label: 'Coping Skills', path: '/coping-skills' },
      { icon: '⏰', label: 'Reminders', path: '/reminders' },
      { icon: '🧰', label: 'Therapy Tools', path: '/tools' }
    ]
  }
]

function UltraEnhancedHomePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showMoodTracker, setShowMoodTracker] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { isPremium } = getPremiumStatus()
  const [parent] = useAutoAnimate()
  
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [cardsRef, cardsInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    const userData = localStorage.getItem('safespace_user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const heroSpring = useSpring({
    opacity: heroInView ? 1 : 0,
    transform: heroInView ? 'translateY(0px)' : 'translateY(-30px)',
    config: config.gentle
  })

  const actionTrail = useTrail(quickActions.length, {
    opacity: cardsInView ? 1 : 0,
    transform: cardsInView ? 'scale(1)' : 'scale(0.9)',
    config: config.wobbly
  })

  const fabSpring = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: 1, rotate: 0 },
    delay: 1000,
    config: config.wobbly
  })

  return (
    <Box maxW="1200px" mx="auto" p={4}>
      <animated.div ref={heroRef} style={heroSpring}>
        <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white" mb={6} overflow="hidden">
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
                      <Box position="absolute" top="-4px" right="-4px" w="24px" h="24px" bg="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                        <Crown size={14} />
                      </Box>
                    )}
                  </Box>
                )}
                <Box>
                  <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Welcome back{user?.username ? `, ${user.username}` : ''}! 👋
                  </h1>
                  <p style={{ opacity: 0.9 }}>Your mind matters. Let's check in today.</p>
                </Box>
              </Stack>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton icon={<Menu />} aria-label="Quick actions" bg="whiteAlpha.200" _hover={{ bg: 'whiteAlpha.300' }} color="white" size="lg" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="bg-white rounded-xl shadow-2xl p-2 min-w-[200px] z-50" sideOffset={5}>
                    {quickActions.map((action) => (
                      <DropdownMenu.Item
                        key={action.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer outline-none"
                        onSelect={() => action.path ? navigate(action.path) : setShowMoodTracker(true)}
                      >
                        <action.icon size={20} />
                        <span className="font-medium">{action.label}</span>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </Stack>
          </CardBody>
        </Card>
      </animated.div>

      {!isPremium && (
        <Link to="/premium">
          <Card bg="linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" mb={6} _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }} transition="all 0.3s" cursor="pointer">
            <CardBody p={6}>
              <Stack direction="row" justify="space-between" align="center">
                <Stack direction="row" align="center" spacing={4}>
                  <Box w="48px" h="48px" bg="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                    <Crown size={24} color="white" />
                  </Box>
                  <Box>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Upgrade to Premium</h3>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Unlock unlimited features</p>
                  </Box>
                </Stack>
                <Sparkles size={24} color="#f59e0b" />
              </Stack>
            </CardBody>
          </Card>
        </Link>
      )}

      <div ref={parent}>
        {showMoodTracker && (
          <Box mb={6}>
            <MoodTracker onMoodLogged={() => { setRefreshKey(prev => prev + 1); setShowMoodTracker(false) }} />
          </Box>
        )}
      </div>

      <Stack spacing={6} mb={6}>
        <MoodCalendar key={refreshKey} />
        <MoodTrends key={refreshKey} />
      </Stack>

      <Box mb={6} ref={cardsRef}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actionTrail.map((style, index) => {
            const action = quickActions[index]
            return (
              <animated.button
                key={action.id}
                style={style}
                onClick={() => action.path ? navigate(action.path) : setShowMoodTracker(true)}
                className="p-6 rounded-2xl flex flex-col items-center gap-3 transition-all hover:shadow-lg"
                aria-label={action.label}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: action.color }}>
                  <action.icon size={28} color="white" />
                </div>
                <span className="font-semibold text-gray-800">{action.label}</span>
              </animated.button>
            )
          })}
        </div>
      </Box>

      <Stack spacing={4}>
        {featureGroups.map((group) => (
          <Card key={group.title}>
            <CardBody p={6}>
              <h3 className="text-lg font-bold mb-4">{group.title}</h3>
              <div className="grid gap-3 md:grid-cols-3">
                {group.items.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all">
                      <span className="text-3xl block mb-2">{item.icon}</span>
                      <h4 className="font-semibold text-sm">{item.label}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </Stack>

      <animated.div style={{ ...fabSpring, position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}>
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
      </animated.div>
    </Box>
  )
}

export default UltraEnhancedHomePage
