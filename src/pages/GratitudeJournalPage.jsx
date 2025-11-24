import { useState, useEffect } from 'react'
import { Heart, Plus, Calendar, TrendingUp, Sparkles, Info, BookOpen, Crown, Lock, RefreshCw, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import GratitudeEntryModal from '../components/gratitude/GratitudeEntryModal'
import GratitudeCard from '../components/gratitude/GratitudeCard'
import GratitudeAnalytics from '../components/gratitude/GratitudeAnalytics'
import StreakDisplay from '../components/gratitude/StreakDisplay'
import GratitudeChallenges from '../components/gratitude/GratitudeChallenges'
import SafeComponent from '../components/SafeComponent'
import WeeklySummary from '../components/gratitude/WeeklySummary'
import GratitudeStats from '../components/gratitude/GratitudeStats'
import { getPremiumStatus } from '../utils/premiumUtils'
import { useNavigate } from 'react-router-dom'
import DisclaimerBanner from '../components/wellness/DisclaimerBanner'
import ResearchCard from '../components/wellness/ResearchCard'
import CrisisResources from '../components/wellness/CrisisResources'
import { disclaimers } from '../data/disclaimers'
import { researchCitations } from '../data/researchCitations'
import EnhancedPrompts from '../components/gratitude/EnhancedPrompts'
import { trackEvent, EVENTS, trackPageView } from '../utils/analytics'
import { usePagination } from '../hooks/usePagination'
import { motion } from 'framer-motion'

function GratitudeJournalPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [allEntries, setAllEntries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [dailyPrompt, setDailyPrompt] = useState('')
  const [selectedPrompts, setSelectedPrompts] = useState([])
  const [promptThoughts, setPromptThoughts] = useState({})
  const { isPremium } = getPremiumStatus()

  const FREE_ENTRY_LIMIT = 10

  // Use pagination hook
  const {
    data: entries,
    hasMore,
    loadMore,
    pageInfo
  } = usePagination({
    data: allEntries,
    pageSize: 15,
    infinite: true,
    sortFn: (a, b) => new Date(b.date) - new Date(a.date) // Newest first
  })

  useEffect(() => {
    loadEntries()
  }, [user])

  useEffect(() => {
    // Track page view only once on mount
    trackPageView('gratitude_journal')
  }, [])

  const loadEntries = async () => {
    const { getGratitudeEntries } = await import('../utils/storageHelpers')
    const entries = await getGratitudeEntries()
    setAllEntries(entries)
    calculateStreak(entries)
  }

  const calculateStreak = (entries) => {
    if (!entries.length) {
      setStreak(0)
      setLongestStreak(0)
      return
    }

    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
    let current = 0
    let longest = 0
    let tempStreak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const entry of sorted) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))

      if (diffDays === current) {
        current++
        tempStreak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else break
    }

    // Calculate longest streak
    const dates = sorted.map(e => new Date(e.date).setHours(0, 0, 0, 0))
    let maxStreak = 0
    let currentStreak = 1

    for (let i = 1; i < dates.length; i++) {
      const diff = (dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 1
      }
    }

    setStreak(tempStreak)
    setLongestStreak(Math.max(maxStreak, tempStreak))
  }

  const handleSave = async (entry) => {
    const { getGratitudeEntries, saveGratitudeEntries } = await import('../utils/storageHelpers')
    const saved = await getGratitudeEntries()
    const existing = saved.findIndex(e => e.date === entry.date)

    if (!isPremium && existing < 0 && saved.length >= FREE_ENTRY_LIMIT) {
      return
    }

    if (existing >= 0) saved[existing] = entry
    else saved.unshift(entry)

    await saveGratitudeEntries(saved)
    trackEvent(EVENTS.FEATURE_USED, { feature: 'gratitude_entry_saved', isNew: existing < 0 })
    loadEntries()
    setShowModal(false)
    setSelectedEntry(null)
  }

  const handleAddClick = () => {
    if (!isPremium && allEntries.length >= FREE_ENTRY_LIMIT && !todayEntry) {
      navigate('/premium')
      return
    }
    setShowModal(true)
  }

  const handleEdit = (entry) => {
    setSelectedEntry(entry)
    setShowModal(true)
  }

  const handleDelete = async (date) => {
    const { getGratitudeEntries, saveGratitudeEntries } = await import('../utils/storageHelpers')
    const saved = await getGratitudeEntries()
    const filtered = saved.filter(e => e.date !== date)
    await saveGratitudeEntries(filtered)
    loadEntries()
  }

  const todayEntry = allEntries.find(e => e.date === new Date().toISOString().split('T')[0])

  return (
    <SafeComponent>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Disclaimer */}
          <div className="mb-6">
            <DisclaimerBanner disclaimer={disclaimers.gratitude} />
          </div>

          {/* Research Support */}
          <div className="mb-6">
            <ResearchCard citations={researchCitations.gratitude} title="Why Gratitude Works" />
          </div>

          <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <Heart className="text-pink-500 w-8 h-8" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('gratitude.title')}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{t('gratitude.subtitle')}</p>
                </div>
              </div>
              <button
                onClick={handleAddClick}
                className="flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <Plus size={20} />
                {todayEntry ? t('gratitude.editToday') : t('gratitude.addEntry')}
              </button>
            </div>

            {!isPremium && allEntries.length >= FREE_ENTRY_LIMIT && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="text-orange-500 shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200">{t('gratitude.limitReached')}</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    {t('gratitude.limitMessage', { limit: FREE_ENTRY_LIMIT })}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/premium')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Crown size={16} />
                  {t('premium.upgrade')}
                </button>
              </div>
            )}

            {/* Enhanced Prompts */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <EnhancedPrompts
                  onPromptSelect={setSelectedPrompts}
                  selectedPrompts={selectedPrompts}
                  onPromptThoughtsChange={setPromptThoughts}
                />
              </div>
            </div>

            {/* Streak Display */}
            <div className="mb-6">
              <StreakDisplay current={streak} longest={longestStreak} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-yellow-500 w-5 h-5" />
                  <span className="text-gray-600 dark:text-gray-400">{t('gratitude currentStreak')}</span>
                </div>
                <h2 className="text-3xl font-bold text-yellow-500">{streak}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('gratitude days')}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-blue-500 w-5 h-5" />
                  <span className="text-gray-600 dark:text-gray-400">{t('gratitude totalEntries')}</span>
                </div>
                <h2 className="text-3xl font-bold text-blue-500">{allEntries.length}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('gratitude entries')}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-green-500 w-5 h-5" />
                  <span className="text-gray-600 dark:text-gray-400">{t('gratitude weeklyGoal')}</span>
                </div>
                <h2 className="text-3xl font-bold text-green-500">
                  {Math.min(7, allEntries.filter(e => {
                    const entryDate = new Date(e.date)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return entryDate >= weekAgo
                  }).length)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">/7 {t('gratitude.thisWeek')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('gratitude recentEntries')}</h2>
              {allEntries.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-12 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">{t('gratitude noEntries')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t('gratitude.startJourney')}</p>
                  <button
                    onClick={handleAddClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold transition-colors"
                  >
                    <Plus size={20} />
                    {t('gratitude.addFirstEntry')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.slice(0, 5).map((entry, index) => (
                    <motion.div
                      key={entry.date || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GratitudeCard
                        entry={entry}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isPremium={isPremium}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {allEntries.length > 0 && (
              <>
                <div>
                  <GratitudeChallenges entries={allEntries} />
                </div>
                <div>
                  <GratitudeAnalytics entries={allEntries} />
                </div>
                <div>
                  <WeeklySummary entries={Object.fromEntries(allEntries.map(e => [e.date, e]))} />
                </div>
                <div>
                  <GratitudeStats entries={allEntries} />
                </div>
              </>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center py-4">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  <RefreshCw size={20} />
                  {t('common.loadMore')}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <GratitudeEntryModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedEntry(null)
          }}
          onSave={handleSave}
          entry={selectedEntry}
          isPremium={isPremium}
          selectedPrompts={selectedPrompts}
          promptThoughts={promptThoughts}
        />
      </div>
    </SafeComponent>
  )
}

export default GratitudeJournalPage
