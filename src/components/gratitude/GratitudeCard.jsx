import { Edit2, Trash2, Calendar } from 'lucide-react'
import {
  Card,
  CardBody,
  HStack,
  VStack,
  Text,
  IconButton,
  Box,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

function GratitudeCard({ entry, onEdit, onDelete, isPremium }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        bg={bgColor}
        borderColor={borderColor}
        borderWidth={1}
        borderRadius="xl"
        shadow="lg"
        _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
        transition="all 0.2s"
      >
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <HStack spacing={2}>
              <Calendar size={16} />
              <Text fontSize="sm" color="gray.600">
                {formatDate(entry.date)}
              </Text>
              <Text fontSize="2xl">
                {['😔', '😕', '😊', '😄', '🤩'][entry.mood_rating - 1]}
              </Text>
            </HStack>
            <HStack spacing={2}>
              <IconButton
                icon={<Edit2 />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                onClick={() => onEdit(entry)}
                aria-label="Edit entry"
              />
              <IconButton
                icon={<Trash2 />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => onDelete(entry.date)}
                aria-label="Delete entry"
              />
            </HStack>
          </HStack>

          <VStack spacing={2} mb={4} align="stretch">
            {entry.items.map((item, i) => (
              <HStack key={i} spacing={3} align="flex-start">
                <Text fontSize="xl">✨</Text>
                <Text flex={1}>{item}</Text>
              </HStack>
            ))}
          </VStack>

          {entry.notes && (
            <Box pt={4} borderTopWidth={1} borderColor={borderColor}>
              <Text fontSize="sm" color="gray.600" fontStyle="italic">
                {entry.notes}
              </Text>
            </Box>
          )}
        </CardBody>
      </Card>
    </motion.div>
  )
}

export default GratitudeCard
