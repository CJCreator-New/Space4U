import { Button as ChakraButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionButton = motion(ChakraButton);

export function ModernButton({ children, variant = 'solid', ...props }) {
  return (
    <MotionButton
      variant={variant}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      minH="44px"
      minW="44px"
      {...props}
    >
      {children}
    </MotionButton>
  );
}
