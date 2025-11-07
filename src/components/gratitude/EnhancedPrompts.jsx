import { useState } from 'react'
import { RefreshCw, Sparkles, Heart, Brain, Users, Briefcase, Leaf, X, Plus, Edit3 } from 'lucide-react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Wrap,
  WrapItem,
  Badge,
  useColorModeValue,
  Textarea,
  IconButton,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

const PROMPT_THEMES = [
  {
    id: 'general',
    name: 'General',
    icon: Sparkles,
    color: 'purple',
    prompts: [
      "What made you smile today?",
      "Who are you grateful for and why?",
      "What's a small win you had today?",
      "What's something beautiful you noticed?",
      "What challenge helped you grow?",
      "Who showed you kindness today?",
      "What's a comfort you're thankful for?",
      "What made you laugh recently?",
      "What's a skill you're grateful to have?",
      "What's something you're looking forward to?",
    ]
  },
  {
    id: 'relationships',
    name: 'Relationships',
    icon: Users,
    color: 'blue',
    prompts: [
      "Who made you feel loved today?",
      "What's a quality you appreciate in a friend?",
      "What meaningful conversation did you have?",
      "Who supported you when you needed it?",
      "What's a relationship you're thankful for?",
      "Who taught you something valuable?",
      "What's a memory with loved ones you're grateful for?",
      "Who made your day better just by being there?",
    ]
  },
  {
    id: 'personal',
    name: 'Personal Growth',
    icon: Brain,
    color: 'green',
    prompts: [
      "What did you learn today?",
      "What's a mistake that taught you something?",
      "What's a strength you discovered in yourself?",
      "What challenge did you overcome?",
      "What's something you're getting better at?",
      "What opportunity are you grateful for?",
      "What's a boundary you set that helped you?",
      "What failure led to growth?",
    ]
  },
  {
    id: 'work',
    name: 'Work & Career',
    icon: Briefcase,
    color: 'orange',
    prompts: [
      "What's a task you enjoyed doing?",
      "Who at work are you grateful for?",
      "What's a skill you used successfully?",
      "What opportunity did your job provide?",
      "What's a work achievement you're proud of?",
      "Who mentored or helped you professionally?",
      "What's a work-related comfort you're thankful for?",
    ]
  },
  {
    id: 'wellness',
    name: 'Health & Wellness',
    icon: Heart,
    color: 'pink',
    prompts: [
      "What's something about your body you appreciate?",
      "What healthy habit are you maintaining?",
      "What's a moment of peace you had?",
      "What support helped your well-being?",
      "What's a self-care activity you're grateful for?",
      "What rest or recovery are you thankful for?",
      "What's a health improvement you noticed?",
    ]
  },
  {
    id: 'nature',
    name: 'Nature & Environment',
    icon: Leaf,
    color: 'teal',
    prompts: [
      "What's beautiful in nature you saw today?",
      "What's a natural sound you're grateful for?",
      "What weather made you happy?",
      "What's a place in nature you love?",
      "What animal or plant brought you joy?",
      "What's a natural cycle you're thankful for?",
      "What environmental comfort do you have?",
    ]
  }
]

function EnhancedPrompts({ onPromptSelect, currentPrompt, onPromptThoughtsChange, selectedPrompts = [] }) {
  const [selectedTheme, setSelectedTheme] = useState('general')
  const [selectedPromptsState, setSelectedPromptsState] = useState(selectedPrompts)
  const [promptThoughts, setPromptThoughts] = useState({})
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const currentTheme = PROMPT_THEMES.find(t => t.id === selectedTheme)
  const randomPrompt = () => {
    const theme = PROMPT_THEMES.find(t => t.id === selectedTheme)
    return theme.prompts[Math.floor(Math.random() * theme.prompts.length)]
  }

  const handlePromptClick = (prompt) => {
    const isSelected = selectedPromptsState.includes(prompt)
    let newSelectedPrompts

    if (isSelected) {
      // Remove prompt
      newSelectedPrompts = selectedPromptsState.filter(p => p !== prompt)
      const newThoughts = { ...promptThoughts }
      delete newThoughts[prompt]
      setPromptThoughts(newThoughts)
    } else {
      // Add prompt
      newSelectedPrompts = [...selectedPromptsState, prompt]
    }

    setSelectedPromptsState(newSelectedPrompts)
    onPromptSelect(newSelectedPrompts)

    // Notify parent of thoughts change
    if (onPromptThoughtsChange) {
      onPromptThoughtsChange(promptThoughts)
    }
  }

  const handleThoughtChange = (prompt, thought) => {
    const newThoughts = { ...promptThoughts, [prompt]: thought }
    setPromptThoughts(newThoughts)

    if (onPromptThoughtsChange) {
      onPromptThoughtsChange(newThoughts)
    }
  }

  const removePrompt = (prompt) => {
    const newSelectedPrompts = selectedPromptsState.filter(p => p !== prompt)
    setSelectedPromptsState(newSelectedPrompts)
    onPromptSelect(newSelectedPrompts)

    const newThoughts = { ...promptThoughts }
    delete newThoughts[prompt]
    setPromptThoughts(newThoughts)

    if (onPromptThoughtsChange) {
      onPromptThoughtsChange(newThoughts)
    }
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between" align="center">
        <HStack spacing={2}>
          <Sparkles size={20} color="purple" />
          <Text fontWeight="semibold" fontSize="lg">Choose a Prompt</Text>
        </HStack>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handlePromptClick(randomPrompt())}
          leftIcon={<RefreshCw size={14} />}
        >
          Random
        </Button>
      </HStack>

      {/* Theme Selection */}
      <Wrap spacing={2}>
        {PROMPT_THEMES.map((theme) => {
          const IconComponent = theme.icon
          return (
            <WrapItem key={theme.id}>
              <Button
                variant={selectedTheme === theme.id ? "solid" : "outline"}
                colorScheme={theme.color}
                size="sm"
                onClick={() => setSelectedTheme(theme.id)}
                leftIcon={<IconComponent size={14} />}
                borderRadius="full"
              >
                {theme.name}
              </Button>
            </WrapItem>
          )
        })}
      </Wrap>

      {/* Current Theme Prompts */}
      <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl">
        <CardBody>
          <HStack mb={3}>
            <currentTheme.icon size={16} color={currentTheme.color} />
            <Text fontWeight="semibold">{currentTheme.name} Prompts</Text>
          </HStack>
          <VStack spacing={2} align="stretch">
            {currentTheme.prompts.map((prompt, index) => {
              const isSelected = selectedPromptsState.includes(prompt)
              return (
                <Button
                  key={index}
                  variant={isSelected ? "solid" : "ghost"}
                  colorScheme={isSelected ? currentTheme.color : "gray"}
                  justifyContent="flex-start"
                  textAlign="left"
                  h="auto"
                  py={2}
                  px={3}
                  borderRadius="md"
                  onClick={() => handlePromptClick(prompt)}
                  _hover={{ bg: isSelected ? `${currentTheme.color}.600` : `${currentTheme.color}.50` }}
                  whiteSpace="normal"
                  wordBreak="break-word"
                  leftIcon={isSelected ? <Check size={14} /> : undefined}
                >
                  <Text fontSize="sm">{prompt}</Text>
                </Button>
              )
            })}
          </VStack>
        </CardBody>
      </Card>

      {/* Selected Prompts with Thoughts */}
      {selectedPromptsState.length > 0 && (
        <Card bg="purple.50" borderColor="purple.200" borderWidth={1} borderRadius="xl">
          <CardBody>
            <HStack mb={3}>
              <Sparkles size={16} color="purple" />
              <Text fontWeight="semibold" color="purple.700">
                Selected Prompts ({selectedPromptsState.length})
              </Text>
            </HStack>
            <Accordion allowMultiple>
              {selectedPromptsState.map((prompt, index) => (
                <AccordionItem key={index} border="none">
                  <AccordionButton
                    _hover={{ bg: "purple.100" }}
                    borderRadius="md"
                    px={3}
                    py={2}
                  >
                    <Box flex="1" textAlign="left">
                      <HStack>
                        <Text fontSize="sm" fontWeight="medium" color="purple.800">
                          {prompt}
                        </Text>
                        <IconButton
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          icon={<X size={12} />}
                          onClick={(e) => {
                            e.stopPropagation()
                            removePrompt(prompt)
                          }}
                          aria-label="Remove prompt"
                        />
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack spacing={2} align="stretch">
                      <Text fontSize="xs" color="gray.600">
                        Add your thoughts about this prompt:
                      </Text>
                      <Textarea
                        placeholder="Write your thoughts here..."
                        value={promptThoughts[prompt] || ''}
                        onChange={(e) => handleThoughtChange(prompt, e.target.value)}
                        size="sm"
                        rows={3}
                        borderRadius="md"
                        bg="white"
                        borderColor="purple.200"
                        _focus={{ borderColor: "purple.300", boxShadow: "0 0 0 1px purple.300" }}
                      />
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>
      )}
    </VStack>
  )
}

export default EnhancedPrompts