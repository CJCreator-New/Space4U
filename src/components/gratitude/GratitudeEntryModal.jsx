import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Sparkles, BookOpen, Tag, Mic, Check } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Root as DialogRoot,
  Portal as DialogPortal,
  Overlay as DialogOverlay,
  Content as DialogContent,
  Title as DialogTitle,
  Close as DialogClose
} from '@radix-ui/react-dialog'
import {
  Root as TabsRoot,
  List as TabsList,
  Trigger as TabsTrigger,
  Content as TabsContent
} from '@radix-ui/react-tabs'
import { motion, AnimatePresence } from 'framer-motion'
import VoiceRecorder from './VoiceRecorder'
import { GRATITUDE_CATEGORIES, GRATITUDE_TEMPLATES } from '../../data/gratitudeCategories'

function GratitudeEntryModal({ isOpen, onClose, onSave, entry, isPremium, selectedPrompts = [], promptThoughts = {} }) {
  const { register, control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      items: [{ text: '' }, { text: '' }, { text: '' }],
      mood_rating: 3,
      notes: '',
      categories: [],
      template: null,
      selectedPrompts: selectedPrompts,
      promptThoughts: promptThoughts
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [voiceRecording, setVoiceRecording] = useState(null)
  const [currentSelectedPrompts, setCurrentSelectedPrompts] = useState(selectedPrompts)
  const [currentPromptThoughts, setCurrentPromptThoughts] = useState(promptThoughts)
  const [showToast, setShowToast] = useState(null) // { title, description, type }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  useEffect(() => {
    if (entry) {
      const categories = entry.categories || []
      const template = entry.template || null
      const recording = entry.voiceRecording || null
      const entryPrompts = entry.selectedPrompts || selectedPrompts
      const entryThoughts = entry.promptThoughts || promptThoughts
      setSelectedCategories(categories)
      setSelectedTemplate(template)
      setVoiceRecording(recording)
      setCurrentSelectedPrompts(entryPrompts)
      setCurrentPromptThoughts(entryThoughts)

      reset({
        date: entry.date,
        items: entry.items.map(text => ({ text })),
        mood_rating: entry.mood_rating || 3,
        notes: entry.notes || '',
        categories: categories,
        template: template,
        selectedPrompts: entryPrompts,
        promptThoughts: entryThoughts
      })
    } else {
      setSelectedCategories([])
      setSelectedTemplate(null)
      setVoiceRecording(null)
      setCurrentSelectedPrompts(selectedPrompts)
      setCurrentPromptThoughts(promptThoughts)
      reset({
        date: new Date().toISOString().split('T')[0],
        items: [{ text: '' }, { text: '' }, { text: '' }],
        mood_rating: 3,
        notes: '',
        categories: [],
        template: null,
        selectedPrompts: selectedPrompts,
        promptThoughts: promptThoughts
      })
    }
  }, [entry, reset, selectedPrompts, promptThoughts, isOpen])

  const onSubmit = (data) => {
    const filledItems = data.items.filter(item => item.text.trim())
    if (filledItems.length === 0) return

    onSave({
      ...data,
      items: filledItems.map(item => item.text),
      categories: selectedCategories,
      template: selectedTemplate,
      voiceRecording: voiceRecording,
      selectedPrompts: currentSelectedPrompts,
      promptThoughts: currentPromptThoughts,
      id: entry?.id || Date.now()
    })

    setShowToast({
      title: "Gratitude entry saved!",
      description: "Your gratitude entry has been recorded.",
      type: "success"
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
    setShowToast({
      title: "Template applied!",
      description: `Using the ${template.name} template.`,
      type: "info"
    })
  }

  const moodRating = watch('mood_rating')

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl max-h-[90vh] flex flex-col">

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Sparkles size={20} className="text-pink-500" />
              Gratitude Entry
            </DialogTitle>
            <DialogClose className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X size={20} className="text-gray-500" />
            </DialogClose>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <TabsRoot defaultValue="entry" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-6">
                {[
                  { value: 'entry', icon: <BookOpen size={16} />, label: 'Entry' },
                  { value: 'categories', icon: <Tag size={16} />, label: 'Categories' },
                  { value: 'templates', icon: <Sparkles size={16} />, label: 'Templates' },
                  { value: 'voice', icon: <Mic size={16} />, label: 'Voice' },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="group flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:text-pink-600 dark:data-[state=active]:text-pink-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors outline-none"
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="entry" className="outline-none">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                      <input
                        type="date"
                        {...register('date')}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gratitude Items</label>
                      <div className="space-y-3">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex gap-3">
                            <input
                              placeholder={`What are you grateful for? (${index + 1})`}
                              {...register(`items.${index}.text`)}
                              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            {fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                        {fields.length < 5 && (
                          <button
                            type="button"
                            onClick={() => append({ text: '' })}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Plus size={16} />
                            Add Item
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        How are you feeling today? ({moodRating}/5)
                      </label>
                      <div className="px-2 py-4">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          {...register('mood_rating')}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-500">
                          {[1, 2, 3, 4, 5].map(val => (
                            <span key={val}>{val}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                      <textarea
                        placeholder="Any additional thoughts or reflections..."
                        {...register('notes')}
                        rows={3}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>

                    {currentSelectedPrompts.length > 0 && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selected Prompts & Thoughts</label>
                        <div className="space-y-3">
                          {currentSelectedPrompts.map((prompt, index) => (
                            <div key={index} className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-2">
                              <p className="text-sm font-medium text-purple-800 dark:text-purple-300">{prompt}</p>
                              <textarea
                                placeholder="Your thoughts on this prompt..."
                                value={currentPromptThoughts[prompt] || ''}
                                onChange={(e) => {
                                  const newThoughts = { ...currentPromptThoughts, [prompt]: e.target.value }
                                  setCurrentPromptThoughts(newThoughts)
                                }}
                                rows={2}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!fields.some((_, index) => watch(`items.${index}.text`)?.trim())}
                        className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
                      >
                        Save Entry
                      </button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="categories" className="outline-none space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select categories that relate to your gratitude items (optional)
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {GRATITUDE_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategories.includes(category.id)
                            ? `bg-${category.color}-100 text-${category.color}-800 ring-2 ring-${category.color}-500 ring-offset-2 dark:ring-offset-gray-800`
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="templates" className="outline-none space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose a template to get started with pre-filled gratitude items
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {GRATITUDE_TEMPLATES.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${selectedTemplate === template.id
                            ? 'bg-pink-50 border-pink-300 dark:bg-pink-900/20 dark:border-pink-700'
                            : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-800'
                          }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-pink-500" />
                            <span className="font-semibold text-gray-900 dark:text-white">{template.name}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                          <div className="space-y-1 pt-2">
                            {template.items.slice(0, 2).map((item, i) => (
                              <p key={i} className="text-xs text-gray-500 dark:text-gray-500">• {item}</p>
                            ))}
                            {template.items.length > 2 && (
                              <p className="text-xs text-gray-500 dark:text-gray-500">• +{template.items.length - 2} more...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="outline-none">
                  <VoiceRecorder
                    onSaveRecording={setVoiceRecording}
                    isDisabled={false}
                  />
                </TabsContent>
              </div>
            </TabsRoot>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
              >
                <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                  {showToast.type === 'success' ? (
                    <Check className="text-green-400" size={20} />
                  ) : (
                    <Sparkles className="text-blue-400" size={20} />
                  )}
                  <div>
                    <p className="font-medium text-sm">{showToast.title}</p>
                    <p className="text-xs text-gray-300">{showToast.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}

export default GratitudeEntryModal
