import { useState, useEffect } from 'react'
import { Heart, Plus, Calendar, TrendingUp, Sparkles, Info, BookOpen, Crown, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import GratitudeEntryModal from '../components/gratitude/GratitudeEntryModal'
import GratitudeCard from '../components/gratitude/GratitudeCard'
import GratitudeStats from '../components/gratitude/GratitudeStats'
import SafeComponent from '../components/SafeComponent'
import { getPremiumStatus } from '../utils/premiumUtils'
import { useNavigate } from 'react-router-dom'
import DisclaimerBanner from '../components/wellness/DisclaimerBanner'
import ResearchCard from '../components/wellness/ResearchCard'
import CrisisResources from '../components/wellness/CrisisResources'
import { disclaimers } from '../data/disclaimers'
import { researchCitations } from '../data/researchCitations'

function GratitudeJournalPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [streak, setStreak] = useState(0)
  const { isPremium } = getPremiumStatus()
  
  const FREE_ENTRY_LIMIT = 10

  useEffect(() => {
    loadEntries()
  }, [user])

  const loadEntries = () => {
    const saved = localStorage.getItem('safespace_gratitude_entries')
    if (saved) {
      const parsed = JSON.parse(saved)
      setEntries(parsed)
      calculateStreak(parsed)
    }
  }

  const calculateStreak = (entries) => {
    if (!entries.length) return setStreak(0)
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))
    let count = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const entry of sorted) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === count) {
        count++
        currentDate.setDate(currentDate.getDate() - 1)
      } else break
    }
    setStreak(count)
  }

  const handleSave = (entry) => {
    const saved = JSON.parse(localStorage.getItem('safespace_gratitude_entries') || '[]')
    const existing = saved.findIndex(e => e.date === entry.date)
    
    if (!isPremium && existing < 0 && saved.length >= FREE_ENTRY_LIMIT) {
      return
    }
    
    if (existing >= 0) saved[existing] = entry
    else saved.unshift(entry)
    
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(saved))
    loadEntries()
    setShowModal(false)
    setSelectedEntry(null)
  }
  
  const handleAddClick = () => {
    if (!isPremium && entries.length >= FREE_ENTRY_LIMIT && !todayEntry) {
      navigate('/premium')
      return
    }
    setShowModal(true)
  }

  const handleEdit = (entry) => {
    setSelectedEntry(entry)
    setShowModal(true)
  }

  const handleDelete = (date) => {
    const saved = JSON.parse(localStorage.getItem('safespace_gratitude_entries') || '[]')
    const filtered = saved.filter(e => e.date !== date)
    localStorage.setItem('safespace_gratitude_entries', JSON.stringify(filtered))
    loadEntries()
  }

  const todayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0])

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Disclaimer */}
      <div className="mb-6">
        <DisclaimerBanner disclaimer={disclaimers.gratitude} />
      </div>

      {/* Research Support */}
      <div className="mb-6">
        <ResearchCard citations={researchCitations.gratitude} title="Why Gratitude Works" />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <div>
              <h1 className="text-3xl font-bold">{t('gratitude.title')}</h1>
              <p className="text-text-secondary">{t('gratitude.subtitle')}</p>
            </div>
          </div>
          <button onClick={handleAddClick} className="btn-primary">
            <Plus className="w-5 h-5" /> {todayEntry ? t('gratitude.editToday') : t('gratitude.addEntry')}
          </button>
        </div>

        {!isPremium && entries.length >= FREE_ENTRY_LIMIT && (
          <div className="card p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-orange-600" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{t('gratitude.limitReached')}</p>
                  <p className="text-gray-700">{t('gratitude.limitMessage', { limit: FREE_ENTRY_LIMIT })}</p>
                </div>
              </div>
              <button onClick={() => navigate('/premium')} className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap">
                <Crown size={16} />
                {t('premium.upgrade')}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-text-secondary">{t('gratitude.currentStreak')}</span>
            </div>
            <p className="text-3xl font-bold">{t('gratitude.streakDays', { count: streak })}</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-text-secondary">{t('gratitude.totalEntries')}</span>
            </div>
            <p className="text-3xl font-bold">{entries.length}</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-text-secondary">{t('gratitude.thisMonth')}</span>
            </div>
            <p className="text-3xl font-bold">
              {entries.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}
            </p>
          </div>
        </div>

        <GratitudeStats entries={entries} />
      </div>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="card p-12 text-center">
            <Heart className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">{t('gratitude.empty.title')}</h3>
            <p className="text-text-secondary mb-4">{t('gratitude.empty.description')}</p>
            
            {/* Benefits List */}
            <div className="max-w-md mx-auto mb-6 text-left">
              <p className="text-sm font-medium text-gray-700 mb-2">{t('gratitude.empty.benefitsTitle')}</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {t('gratitude.empty.benefit1')}</li>
                <li>• {t('gratitude.empty.benefit2')}</li>
                <li>• {t('gratitude.empty.benefit3')}</li>
                <li>• {t('gratitude.empty.benefit4')}</li>
              </ul>
            </div>
            
            <button onClick={handleAddClick} className="btn-primary">
              <Plus className="w-5 h-5" /> {t('gratitude.createFirst')}
            </button>
          </div>
        ) : (
          entries.map(entry => (
            <GratitudeCard
              key={entry.date}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {showModal && (
        <GratitudeEntryModal
          entry={selectedEntry}
          onClose={() => { setShowModal(false); setSelectedEntry(null) }}
          onSave={handleSave}
        />
      )}

      {/* Tips & Resources */}
      <div className="mt-8 space-y-4">
        <div className="card p-4 bg-blue-50 border border-blue-200">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1 text-gray-900">{t('gratitude.guidelines.title')}</p>
              <ul className="text-gray-700 space-y-1">
                <li>• {t('gratitude.guidelines.tip1')}</li>
                <li>• {t('gratitude.guidelines.tip2')}</li>
                <li>• {t('gratitude.guidelines.tip3')}</li>
                <li>• {t('gratitude.guidelines.tip4')}</li>
                <li>• {t('gratitude.guidelines.tip5')}</li>
              </ul>
            </div>
          </div>
        </div>

        <CrisisResources compact />
      </div>
    </div>
  
    </SafeComponent>
  )
}

export default GratitudeJournalPage
