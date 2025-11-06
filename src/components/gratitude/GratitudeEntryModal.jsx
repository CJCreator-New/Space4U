import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Sparkles, BookOpen, Tag, Mic } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Input,
  Textarea,
  Text,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Box,
  FormControl,
  FormLabel,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Wrap,
  WrapItem,
  Badge,
  Card,
  CardBody,
  Grid,
  GridItem,
  useToast,
} from '@chakra-ui/react'
import VoiceRecorder from './VoiceRecorder'
import { GRATITUDE_CATEGORIES, GRATITUDE_TEMPLATES } from '../../data/gratitudeCategories'

function GratitudeEntryModal({ isOpen, onClose, onSave, entry, isPremium }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const toast = useToast()

  const { register, control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      items: [{ text: '' }, { text: '' }, { text: '' }],
      mood_rating: 3,
      notes: '',
      categories: [],
      template: null
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [voiceRecording, setVoiceRecording] = useState(null)

  useEffect(() => {
    if (entry) {
      const categories = entry.categories || []
      const template = entry.template || null
      const recording = entry.voiceRecording || null
      setSelectedCategories(categories)
      setSelectedTemplate(template)
      setVoiceRecording(recording)

      reset({
        date: entry.date,
        items: entry.items.map(text => ({ text })),
        mood_rating: entry.mood_rating || 3,
        notes: entry.notes || '',
        categories: categories,
        template: template
      })
    } else {
      setSelectedCategories([])
      setSelectedTemplate(null)
      setVoiceRecording(null)
      reset({
        date: new Date().toISOString().split('T')[0],
        items: [{ text: '' }, { text: '' }, { text: '' }],
        mood_rating: 3,
        notes: '',
        categories: [],
        template: null
      })
    }
  }, [entry, reset])

  const onSubmit = (data) => {
    const filledItems = data.items.filter(item => item.text.trim())
    if (filledItems.length === 0) return

    onSave({
      ...data,
      items: filledItems.map(item => item.text),
      categories: selectedCategories,
      template: selectedTemplate,
      voiceRecording: voiceRecording,
      id: entry?.id || Date.now()
    })

    toast({
      title: "Gratitude entry saved!",
      description: "Your gratitude entry has been recorded.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id)
    setValue('items', template.items.map(text => ({ text })))
    toast({
      title: "Template applied!",
      description: `Using the ${template.name} template.`,
      status: "info",
      duration: 2000,
      isClosable: true,
    })
  }

  const moodRating = watch('mood_rating')

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bgColor} borderRadius="2xl" borderColor={borderColor} borderWidth={1} maxH="90vh" overflow="hidden">
        <ModalHeader borderBottomWidth={1} borderColor={borderColor}>
          <HStack>
            <Sparkles size={20} />
            <Text>Gratitude Entry</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={0} overflowY="auto">
          <Tabs variant="soft-rounded" colorScheme="pink" isFitted>
            <TabList p={4} bg={useColorModeValue('gray.50', 'gray.700')}>
              <Tab>
                <HStack spacing={2}>
                  <BookOpen size={16} />
                  <Text>Entry</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <Tag size={16} />
                  <Text>Categories</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <Sparkles size={16} />
                  <Text>Templates</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <Mic size={16} />
                  <Text>Voice</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels p={6}>
              <TabPanel>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Date</FormLabel>
                      <Input
                        type="date"
                        {...register('date')}
                        bg={bgColor}
                        borderColor={borderColor}
                        _hover={{ borderColor: 'blue.300' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Gratitude Items</FormLabel>
                      <VStack spacing={3} align="stretch">
                        {fields.map((field, index) => (
                          <HStack key={field.id} spacing={3}>
                            <Input
                              placeholder={`What are you grateful for? (${index + 1})`}
                              {...register(`items.${index}.text`)}
                              bg={bgColor}
                              borderColor={borderColor}
                              _hover={{ borderColor: 'blue.300' }}
                              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                            />
                            {fields.length > 1 && (
                              <IconButton
                                icon={<Trash2 />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => remove(index)}
                                aria-label="Remove item"
                              />
                            )}
                          </HStack>
                        ))}
                        {fields.length < 5 && (
                          <Button
                            leftIcon={<Plus />}
                            size="sm"
                            variant="outline"
                            onClick={() => append({ text: '' })}
                            alignSelf="flex-start"
                          >
                            Add Item
                          </Button>
                        )}
                      </VStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>How are you feeling today? ({moodRating}/5)</FormLabel>
                      <Box px={4} py={2}>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={moodRating}
                          onChange={(value) => setValue('mood_rating', value)}
                          colorScheme="pink"
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                          {[1, 2, 3, 4, 5].map((value) => (
                            <SliderMark key={value} value={value} mt={2} fontSize="sm">
                              {value}
                            </SliderMark>
                          ))}
                        </Slider>
                      </Box>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <Textarea
                        placeholder="Any additional thoughts or reflections..."
                        {...register('notes')}
                        bg={bgColor}
                        borderColor={borderColor}
                        _hover={{ borderColor: 'blue.300' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                        rows={3}
                      />
                    </FormControl>

                    <HStack spacing={3} justify="flex-end" pt={4}>
                      <Button variant="ghost" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        colorScheme="pink"
                        isDisabled={!fields.some((_, index) => watch(`items.${index}.text`)?.trim())}
                      >
                        Save Entry
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              </TabPanel>

              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="sm" color="gray.600">
                    Select categories that relate to your gratitude items (optional)
                  </Text>
                  <Wrap spacing={3}>
                    {GRATITUDE_CATEGORIES.map((category) => (
                      <WrapItem key={category.id}>
                        <Button
                          variant={selectedCategories.includes(category.id) ? "solid" : "outline"}
                          colorScheme={category.color}
                          size="sm"
                          onClick={() => handleCategoryToggle(category.id)}
                          leftIcon={<Text fontSize="lg">{category.icon}</Text>}
                          borderRadius="full"
                        >
                          {category.name}
                        </Button>
                      </WrapItem>
                    ))}
                  </Wrap>
                  {selectedCategories.length > 0 && (
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" mb={2}>Selected Categories:</Text>
                      <Wrap spacing={2}>
                        {selectedCategories.map(catId => {
                          const category = GRATITUDE_CATEGORIES.find(c => c.id === catId)
                          return (
                            <WrapItem key={catId}>
                              <Badge colorScheme={category.color} borderRadius="full" px={3} py={1}>
                                {category.icon} {category.name}
                              </Badge>
                            </WrapItem>
                          )
                        })}
                      </Wrap>
                    </Box>
                  )}
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="sm" color="gray.600">
                    Choose a template to get started with pre-filled gratitude items
                  </Text>
                  <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                    {GRATITUDE_TEMPLATES.map((template) => (
                      <GridItem key={template.id}>
                        <Card
                          cursor="pointer"
                          onClick={() => handleTemplateSelect(template)}
                          bg={selectedTemplate === template.id ? 'pink.50' : bgColor}
                          borderColor={selectedTemplate === template.id ? 'pink.300' : borderColor}
                          borderWidth={2}
                          _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                          transition="all 0.2s"
                        >
                          <CardBody>
                            <VStack spacing={2} align="stretch">
                              <HStack>
                                <Sparkles size={16} color="pink" />
                                <Text fontWeight="semibold">{template.name}</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">{template.description}</Text>
                              <VStack spacing={1} align="stretch">
                                {template.items.slice(0, 2).map((item, i) => (
                                  <Text key={i} fontSize="xs" color="gray.500">• {item}</Text>
                                ))}
                                {template.items.length > 2 && (
                                  <Text fontSize="xs" color="gray.500">• +{template.items.length - 2} more...</Text>
                                )}
                              </VStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      </GridItem>
                    ))}
                  </Grid>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VoiceRecorder
                  onSaveRecording={setVoiceRecording}
                  isDisabled={false}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default GratitudeEntryModal
