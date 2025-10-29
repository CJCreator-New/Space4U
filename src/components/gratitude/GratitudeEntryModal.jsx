import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
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
} from '@chakra-ui/react'

function GratitudeEntryModal({ isOpen, onClose, onSave, entry, isPremium }) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const { register, control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      items: [{ text: '' }, { text: '' }, { text: '' }],
      mood_rating: 3,
      notes: ''
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  useEffect(() => {
    if (entry) {
      reset({
        date: entry.date,
        items: entry.items.map(text => ({ text })),
        mood_rating: entry.mood_rating || 3,
        notes: entry.notes || ''
      })
    } else {
      reset({
        date: new Date().toISOString().split('T')[0],
        items: [{ text: '' }, { text: '' }, { text: '' }],
        mood_rating: 3,
        notes: ''
      })
    }
  }, [entry, reset])

  const onSubmit = (data) => {
    const filledItems = data.items.filter(item => item.text.trim())
    if (filledItems.length === 0) return

    onSave({
      ...data,
      items: filledItems.map(item => item.text),
      id: entry?.id || Date.now()
    })
  }

  const moodRating = watch('mood_rating')

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bgColor} borderRadius="2xl" borderColor={borderColor} borderWidth={1}>
        <ModalHeader borderBottomWidth={1} borderColor={borderColor}>
          Gratitude Entry
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={6}>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default GratitudeEntryModal
