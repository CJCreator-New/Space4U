import { useState, useEffect } from 'react'
import { Plus, Clock, CheckCircle2, Circle, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SafeComponent from '../components/SafeComponent'
import { getPremiumStatus } from '../utils/premiumUtils'
import LimitWarningBanner from '../components/common/LimitWarningBanner'
import DisclaimerBanner from '../components/wellness/DisclaimerBanner'
import { disclaimers } from '../data/disclaimers'

function WellnessPlanPage() {
  const navigate = useNavigate()
  const { isPremium } = getPremiumStatus()
  const [plans, setPlans] = useState([])
  const [activePlan, setActivePlan] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newActivity, setNewActivity] = useState({ title: '', time: '09:00', activity_type: 'morning_ritual', days: [1,2,3,4,5] })
  
  const FREE_ACTIVITY_LIMIT = 5
  const activityCount = activePlan?.activities?.length || 0
  const canAddActivity = isPremium || activityCount < FREE_ACTIVITY_LIMIT

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('space4u_wellness_plans') || '[]')
    setPlans(saved)
    if (saved.length > 0) setActivePlan(saved[0])
  }, [])

  const createPlan = () => {
    const plan = { id: Date.now(), name: 'My Wellness Plan', activities: [], is_active: true }
    const updated = [plan, ...plans]
    localStorage.setItem('space4u_wellness_plans', JSON.stringify(updated))
    setPlans(updated)
    setActivePlan(plan)
  }

  const addActivity = () => {
    if (!activePlan) return
    if (!canAddActivity) {
      navigate('/premium')
      return
    }
    const activity = { ...newActivity, id: Date.now(), completions: {} }
    const updated = plans.map(p => p.id === activePlan.id ? { ...p, activities: [...(p.activities || []), activity] } : p)
    localStorage.setItem('space4u_wellness_plans', JSON.stringify(updated))
    setPlans(updated)
    setActivePlan(updated.find(p => p.id === activePlan.id))
    setShowModal(false)
    setNewActivity({ title: '', time: '09:00', activity_type: 'morning_ritual', days: [1,2,3,4,5] })
  }

  const toggleCompletion = (activityId) => {
    const today = new Date().toISOString().split('T')[0]
    const updated = plans.map(p => {
      if (p.id === activePlan.id) {
        return {
          ...p,
          activities: p.activities.map(a => {
            if (a.id === activityId) {
              const completions = { ...a.completions }
              completions[today] = !completions[today]
              return { ...a, completions }
            }
            return a
          })
        }
      }
      return p
    })
    localStorage.setItem('space4u_wellness_plans', JSON.stringify(updated))
    setPlans(updated)
    setActivePlan(updated.find(p => p.id === activePlan.id))
  }

  const today = new Date().toISOString().split('T')[0]
  const todayActivities = activePlan?.activities?.filter(a => a.days.includes(new Date().getDay())) || []

  return (
    <SafeComponent>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Wellness Plan</h1>
            {isPremium && <Crown className="w-6 h-6 text-yellow-500" />}
          </div>
          <p className="text-text-secondary">Your personalized daily routine</p>
        </div>
        {!activePlan ? (
          <button onClick={createPlan} className="btn-primary">
            <Plus className="w-5 h-5" /> Create Plan
          </button>
        ) : (
          <button onClick={() => setShowModal(true)} disabled={!canAddActivity} className="btn-primary">
            <Plus className="w-5 h-5" /> Add Activity
          </button>
        )}
      </div>

      <div className="mb-8">
        <DisclaimerBanner disclaimer={disclaimers.general} />
      </div>

      {!isPremium && activityCount >= FREE_ACTIVITY_LIMIT && (
        <LimitWarningBanner
          current={activityCount}
          limit={FREE_ACTIVITY_LIMIT}
          itemName="activities"
          featureName="Unlimited Activities"
        />
      )}

      {!activePlan ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Create Your Wellness Plan</h3>
          <p className="text-text-secondary mb-6">Build a personalized daily routine for better mental health</p>
          <button onClick={createPlan} className="btn-primary">
            <Plus className="w-5 h-5" /> Create Plan
          </button>
        </div>
      ) : (
        <>
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Today's Activities</h2>
            <div className="space-y-3">
              {todayActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-hover rounded-lg">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleCompletion(activity.id)}>
                      {activity.completions?.[today] ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-text-secondary" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-medium">{activity.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span>{activity.time}</span>
                        <span className="capitalize">â€¢ {activity.activity_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {todayActivities.length === 0 && (
                <p className="text-text-secondary text-center py-8">No activities scheduled for today</p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">All Activities</h2>
            <div className="space-y-2">
              {activePlan.activities?.map(activity => (
                <div key={activity.id} className="p-4 bg-hover rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-text-secondary">{activity.time} â€¢ {activity.days.length} days/week</p>
                    </div>
                    <span className="text-sm text-text-secondary capitalize">{activity.activity_type.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">New Activity</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Activity Title</label>
                <input
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="input w-full"
                  placeholder="Morning meditation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={newActivity.activity_type}
                  onChange={(e) => setNewActivity({ ...newActivity, activity_type: e.target.value })}
                  className="input w-full"
                >
                  <option value="morning_ritual">Morning Ritual</option>
                  <option value="evening_ritual">Evening Ritual</option>
                  <option value="daily_task">Daily Task</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={addActivity} disabled={!newActivity.title} className="btn-primary flex-1">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  
    </SafeComponent>
  )
}

export default WellnessPlanPage

