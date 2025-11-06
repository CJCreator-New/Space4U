import { Edit2, Trash2, Calendar, Play, Mic } from 'lucide-react'
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
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { GRATITUDE_CATEGORIES } from '../../data/gratitudeCategories'

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

          {entry.categories && entry.categories.length > 0 && (
            <Box mb={4}>
              <Wrap spacing={2}>
                {entry.categories.map(catId => {
                  const category = GRATITUDE_CATEGORIES.find(c => c.id === catId)
                  return category ? (
                    <WrapItem key={catId}>
                      <Badge
                        colorScheme={category.color}
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="xs"
                      >
                        {category.icon} {category.name}
                      </Badge>
                    </WrapItem>
                  ) : null
                })}
              </Wrap>
            </Box>
          )}

          {entry.voiceRecording && (
            <Box mb={4}>
              <HStack spacing={2} p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                <Mic size={16} color="blue" />
                <Text fontSize="sm" color="blue.700" flex={1}>
                  Voice recording ({Math.floor(entry.voiceRecording.duration / 60)}:{(entry.voiceRecording.duration % 60).toString().padStart(2, '0')})
                </Text>
                <Button size="xs" variant="ghost" colorScheme="blue" leftIcon={<Play size={12} />}>
                  Play
                </Button>
              </HStack>
            </Box>
          )}

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
