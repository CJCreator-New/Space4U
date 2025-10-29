import { NavLink } from 'react-router-dom';
import { Box, Flex, VStack, HStack, Text, IconButton, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerBody, DrawerCloseButton } from '@chakra-ui/react';
import { Home, Users, Brain, User, Activity, Heart, Sparkles, Building2, LogOut, LogIn, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSupabaseAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const MotionBox = motion(Box);

export function ModernNavigation() {
  const { user, signOut } = useSupabaseAuth();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navItems = [
    { path: '/', icon: Home, label: t('common.home') },
    { path: '/circles', icon: Users, label: t('common.circles') },
    { path: '/insights', icon: Brain, label: t('common.insights') },
    { path: '/gratitude', icon: Heart, label: t('gratitude.title') },
    { path: '/tools', icon: Activity, label: t('common.tools') },
    { path: '/analytics', icon: Sparkles, label: t('common.analytics') },
    { path: '/professional', icon: Building2, label: t('common.professional') },
    { path: '/profile', icon: User, label: t('common.profile') },
  ];

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const NavItem = ({ path, icon: Icon, label, onClick }) => (
    <NavLink to={path} onClick={onClick} style={{ textDecoration: 'none', width: '100%' }}>
      {({ isActive }) => (
        <MotionBox
          display="flex"
          alignItems="center"
          gap={3}
          px={4}
          py={3}
          borderRadius="2xl"
          bg={isActive ? 'primary.500' : 'transparent'}
          color={isActive ? 'white' : 'gray.600'}
          _hover={{ bg: isActive ? 'primary.600' : 'gray.50', color: isActive ? 'white' : 'gray.900' }}
          transition="all 0.2s"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          cursor="pointer"
          role="button"
          aria-label={`Navigate to ${label}`}
          minH="44px"
        >
          <Icon size={20} aria-hidden="true" />
          <Text fontWeight="medium">{label}</Text>
        </MotionBox>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <Box
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        borderTop="1px solid"
        borderColor="gray.200"
        zIndex={50}
        as="nav"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <Flex justify="space-around" px={2} py={1}>
          {navItems.slice(0, 5).map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <VStack
                  spacing={0}
                  minW="64px"
                  minH="56px"
                  px={2}
                  py={1}
                  borderRadius="lg"
                  color={isActive ? 'primary.500' : 'gray.500'}
                  _active={{ transform: 'scale(0.95)' }}
                  transition="all 0.2s"
                >
                  <Icon size={24} aria-hidden="true" strokeWidth={2} />
                  <Text fontSize="10px" mt={1} fontWeight="medium">{label}</Text>
                </VStack>
              )}
            </NavLink>
          ))}
          <NavLink to="/profile" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <VStack
                spacing={0}
                minW="64px"
                minH="56px"
                px={2}
                py={1}
                borderRadius="lg"
                color={isActive ? 'primary.500' : 'gray.500'}
                _active={{ transform: 'scale(0.95)' }}
                transition="all 0.2s"
              >
                <User size={24} aria-hidden="true" strokeWidth={2} />
                <Text fontSize="10px" mt={1} fontWeight="medium">{t('common.profile')}</Text>
              </VStack>
            )}
          </NavLink>
        </Flex>
      </Box>

      {/* Desktop Sidebar Navigation */}
      <Box
        display={{ base: 'none', md: 'block' }}
        position="fixed"
        left={0}
        top={0}
        h="full"
        w="64"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        zIndex={50}
        as="nav"
        role="navigation"
        aria-label="Main navigation"
      >
        <Box p={6}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, primary.500, mindfulness.500)"
            bgClip="text"
            mb={8}
          >
            Space4U
          </Text>
          <VStack spacing={2} align="stretch">
            {navItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
            {user ? (
              <MotionBox
                display="flex"
                alignItems="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="2xl"
                color="gray.600"
                _hover={{ bg: 'gray.50', color: 'gray.900' }}
                transition="all 0.2s"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                cursor="pointer"
                onClick={handleLogout}
                role="button"
                aria-label="Logout"
                minH="44px"
              >
                <LogOut size={20} aria-hidden="true" />
                <Text fontWeight="medium">{t('profile.logout')}</Text>
              </MotionBox>
            ) : (
              <NavItem path="/auth" icon={LogIn} label={t('auth.login')} />
            )}
          </VStack>
        </Box>
      </Box>
    </>
  );
}
