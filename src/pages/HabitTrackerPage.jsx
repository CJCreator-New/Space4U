import { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Circle, TrendingUp, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SafeComponent from '../components/SafeComponent'
import LimitWarningBanner from '../components/common/LimitWarningBanner'
import { getPremiumStatus } from '../utils/premiumUtils'
import DisclaimerBanner from '../components/wellness/DisclaimerBanner'
import ResearchCard from '../components/wellness/ResearchCard'
import { disclaimers } from '../data/disclaimers'
import { researchCitations } from '../data/researchCitations'
import HabitCompletionEffect from '../components/common/HabitCompletionEffect'
import HabitHeatMap from '../components/HabitHeatMap'

function HabitTrackerPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [habits, setHabits] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', icon: '', color: 'blue', frequency: 'daily' })
  const [showCompletionEffect, setShowCompletionEffect] = useState(false)
  const { isPremium } = getPremiumStatus()
  const FREE_HABIT_LIMIT = 5

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = async () => {
    const { getHabits } = await import('../utils/storageHelpers')
    const saved = await getHabits()
    setHabits(saved)
  }

  const handleAddClick = () => {
    if (!isPremium && habits.length >= FREE_HABIT_LIMIT) {
      navigate('/premium')
      return
    }
    setShowModal(true)
  }

  const addHabit = async () => {
    const { saveHabits } = await import('../utils/storageHelpers')
    const habit = { ...newHabit, id: Date.now(), completions: {} }
    const updated = [...habits, habit]
    await saveHabits(updated)
    setHabits(updated)
    setShowModal(false)
    setNewHabit({ name: '', icon: '', color: 'blue', frequency: 'daily' })
  }

  const toggleCompletion = async (habitId) => {
    const { saveHabits } = await import('../utils/storageHelpers')
    const today = new Date().toISOString().split('T')[0]
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const completions = { ...h.completions }
        const wasCompleted = completions[today]
        completions[today] = !completions[today]

        // Show completion effect if habit was just completed (not uncompleted)
        if (!wasCompleted && completions[today]) {
          setShowCompletionEffect(true)
        }

        return { ...h, completions }
      }
      return h
    })
    await saveHabits(updated)
    setHabits(updated)
  }

  const getStreak = (habit) => {
    let streak = 0
    let date = new Date()
    while (habit.completions[date.toISOString().split('T')[0]]) {
      streak++
      date.setDate(date.getDate() - 1)
    }
    return streak
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <SafeComponent>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{t('habits.title')}</h1>
            {isPremium && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium">
                <Crown size={12} />
                {t('common.premium')}
              </div>
            )}
          </div>
          <p className="text-text-secondary">{t('habits.subtitle')}</p>
        </div>
        <button onClick={handleAddClick} className="btn-primary">
          <Plus className="w-5 h-5" /> {t('habits.addHabit')}
        </button>
      </div>

      <div className="mb-6">
        <DisclaimerBanner disclaimer={disclaimers.habits} />
      </div>

      <div className="mb-6">
        <ResearchCard citations={researchCitations.habits} title="The Science of Habit Formation" />
      </div>

      {!isPremium && habits.length >= FREE_HABIT_LIMIT && (
        <LimitWarningBanner limit={FREE_HABIT_LIMIT} feature="habits" current={habits.length} />
      )}

      {habits.length === 0 ? (
        <div className="card p-12 text-center">
          <TrendingUp className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">{t('habits.empty.title')}</h3>
          <p className="text-text-secondary mb-4">{t('habits.empty.description')}</p>
          <div className="max-w-md mx-auto mb-6 text-left">
            <p className="text-sm font-medium text-gray-700 mb-2">{t('habits.empty.keysTitle')}</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {t('habits.empty.key1')}</li>
              <li>• {t('habits.empty.key2')}</li>
              <li>• {t('habits.empty.key3')}</li>
              <li>• {t('habits.empty.key4')}</li>
            </ul>
          </div>
          <button onClick={handleAddClick} className="btn-primary">
            <Plus className="w-5 h-5" /> {t('habits.createFirst')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {habits.map(habit => (
            <div key={habit.id} className="space-y-4">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleCompletion(habit.id)}
                      className="btn-micro text-4xl hover:scale-110 transition-transform"
                    >
                      {habit.completions[today] ? (
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      ) : (
                        <Circle className="w-10 h-10 text-text-secondary" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{habit.icon}</span>
                        <h3 className="text-xl font-semibold">{habit.name}</h3>
                      </div>
                      <p className="text-text-secondary text-sm">
                        {t('habits.streakInfo', { streak: getStreak(habit), total: Object.values(habit.completions).filter(Boolean).length })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <HabitHeatMap habitId={habit.id} habitName={habit.name} />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">{t('habits.modal.title')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('habits.modal.nameLabel')}</label>
                <input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="input w-full"
                  placeholder={t('habits.modal.namePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('habits.modal.iconLabel')}</label>
                <div className="flex gap-2 flex-wrap">
                  {['', '', '', '', '', '', '', ''].map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewHabit({ ...newHabit, icon })}
                      className={`text-3xl p-2 rounded-lg ${newHabit.icon === icon ? 'bg-primary/20' : 'hover:bg-hover'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button onClick={addHabit} disabled={!newHabit.name} className="btn-primary flex-1">{t('common.create')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Habit completion effect */}
    <HabitCompletionEffect
      show={showCompletionEffect}
      onComplete={() => setShowCompletionEffect(false)}
    />

    </SafeComponent>
  )
}

export default HabitTrackerPage

