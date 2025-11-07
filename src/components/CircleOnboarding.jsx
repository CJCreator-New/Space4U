import { useState } from 'react'
import { Check } from 'lucide-react'
import { api } from '../utils/supabase'

const INTERESTS = [
  { id: 'anxiety', label: 'Anxiety Support', icon: '🌊' },
  { id: 'depression', label: 'Depression', icon: '🌱' },
  { id: 'stress', label: 'Stress Management', icon: '💼' },
  { id: 'relationships', label: 'Relationships', icon: '❤️' },
  { id: 'wellness', label: 'General Wellness', icon: '✨' },
  { id: 'student', label: 'Student Life', icon: '📚' },
  { id: 'lgbtq', label: 'LGBTQ+ Support', icon: '🏳️‍🌈' },
  { id: 'parenting', label: 'Parenting', icon: '👶' }
]

function CircleOnboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState([])
  const [recommendedCircles, setRecommendedCircles] = useState([])
  const [joinedCircles, setJoinedCircles] = useState([])
  const [loading, setLoading] = useState(false)

  const toggleInterest = (id) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleNext = async () => {
    if (step === 1) {
      if (selectedInterests.length < 2) {
        alert('Please select at least 2 interests')
        return
      }
      
      setLoading(true)
      try {
        const circles = await api.getRecommendedCircles(selectedInterests)
        setRecommendedCircles(circles)
        setStep(2)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    } else if (step === 2) {
      setLoading(true)
      try {
        await api.completeCircleOnboarding({
          interests: selectedInterests,
          joinedCircles
        })
        onComplete()
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleJoinCircle = async (circleId) => {
    try {
      await api.joinCircle(circleId)
      setJoinedCircles(prev => [...prev, circleId])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold mb-2">Welcome to Circles!</h2>
            <p className="text-gray-600 mb-6">
              Select your interests to find the perfect communities for you
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {INTERESTS.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedInterests.includes(interest.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{interest.icon}</div>
                  <div className="text-sm font-medium">{interest.label}</div>
                  {selectedInterests.includes(interest.id) && (
                    <Check className="absolute top-2 right-2 text-primary" size={16} />
                  )}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Selected: {selectedInterests.length} (minimum 2, maximum 5)
            </p>

            <button
              onClick={handleNext}
              disabled={selectedInterests.length < 2 || selectedInterests.length > 5 || loading}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold mb-2">Recommended Circles</h2>
            <p className="text-gray-600 mb-6">
              Join circles that match your interests
            </p>

            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {recommendedCircles.map(circle => (
                <div key={circle.id} className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{circle.icon}</div>
                    <div>
                      <div className="font-medium">{circle.name}</div>
                      <div className="text-sm text-gray-500">{circle.members} members</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinCircle(circle.id)}
                    disabled={joinedCircles.includes(circle.id)}
                    className={`px-4 py-2 rounded-xl font-medium ${
                      joinedCircles.includes(circle.id)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-primary text-white'
                    }`}
                  >
                    {joinedCircles.includes(circle.id) ? 'Joined' : 'Join'}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50"
            >
              {loading ? 'Completing...' : 'Complete Setup'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default CircleOnboarding
