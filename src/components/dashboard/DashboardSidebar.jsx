import { motion } from 'framer-motion'
import { Box, Stack, IconButton } from '@chakra-ui/react'
import { Home, Heart, Users, TrendingUp, User, Settings, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Heart, label: 'Mood', path: '/mood' },
  { icon: Users, label: 'Circles', path: '/circles' },
  { icon: TrendingUp, label: 'Insights', path: '/insights' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' }
]

function DashboardSidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <IconButton
        icon={<Menu />}
        aria-label="Open navigation menu"
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        top={4}
        left={4}
        zIndex={60}
        onClick={() => setIsOpen(true)}
        bg="white"
        shadow="lg"
      />

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 70
          }}
          className="md:hidden"
        />
      )}

      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25 }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '280px',
          zIndex: 80
        }}
        className="md:relative md:translate-x-0"
      >
        <Box bg="white" h="100vh" borderRight="1px solid" borderColor="gray.200" p={6} overflowY="auto">
          <IconButton
            icon={<X />}
            aria-label="Close navigation menu"
            display={{ base: 'flex', md: 'none' }}
            position="absolute"
            top={4}
            right={4}
            onClick={() => setIsOpen(false)}
            variant="ghost"
          />

          <Box mb={8} mt={{ base: 12, md: 0 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Space4U
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Your safe space</p>
          </Box>

          <Stack spacing={2} as="nav" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={3}
                      p={3}
                      borderRadius="lg"
                      bg={isActive ? 'purple.50' : 'transparent'}
                      color={isActive ? 'purple.600' : 'gray.700'}
                      fontWeight={isActive ? '600' : '500'}
                      _hover={{ bg: isActive ? 'purple.50' : 'gray.50' }}
                      transition="all 0.2s"
                      role="menuitem"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Box>
                  </motion.div>
                </Link>
              )
            })}
          </Stack>
        </Box>
      </motion.div>
    </>
  )
}

export default DashboardSidebar
