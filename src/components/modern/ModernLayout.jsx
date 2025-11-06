import { Box, Container } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { pageTransition } from '../../theme/animations';
import Navigation from '../Navigation';
import LanguageSwitcher from '../LanguageSwitcher';

export function ModernLayout() {
  return (
    <Box minH="100vh" bg="gray.50">
      <a 
        href="#main-content" 
        style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 999,
          padding: '1rem',
          backgroundColor: '#4A90C2',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none'
        }}
        onFocus={(e) => {
          e.target.style.left = '1rem';
          e.target.style.top = '1rem';
        }}
        onBlur={(e) => {
          e.target.style.left = '-9999px';
        }}
      >
        Skip to main content
      </a>
      
      <Box display={{ base: 'block', md: 'flex' }}>
        <Navigation />
        <Box 
          as="main" 
          id="main-content"
          flex="1" 
          pb={{ base: 20, md: 0 }} 
          ml={{ base: 0, md: 64 }}
        >
          <Container maxW="1200px" p={{ base: 4, md: 6 }}>
            <Box display="flex" justifyContent="flex-end" mb={4}>
              <LanguageSwitcher />
            </Box>
            <motion.div {...pageTransition}>
              <Outlet />
            </motion.div>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
