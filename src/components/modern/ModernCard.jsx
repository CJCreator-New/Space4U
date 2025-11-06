import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { cardHover } from '../../theme/animations';

const MotionBox = motion(Box);

export function ModernCard({ children, onClick, ...props }) {
  return (
    <MotionBox
      bg="white"
      borderRadius="xl"
      boxShadow="md"
      p={6}
      border="1px solid"
      borderColor="gray.200"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      {...(onClick ? cardHover : {})}
      {...props}
    >
      {children}
    </MotionBox>
  );
}
