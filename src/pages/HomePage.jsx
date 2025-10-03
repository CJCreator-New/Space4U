import { useState, useEffect } from 'react'
import MoodTracker from '../components/MoodTracker'
import MoodCalendar from '../components/MoodCalendar'
import MoodTrends from '../components/MoodTrends'

function HomePage() {
  const [user, setUser] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem('safespace_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleMoodLogged = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          {user?.avatar && (
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
              {user.avatar}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back{user?.username ? `, ${user.username}` : ''}!
            </h1>
            <p className="text-text-secondary">Your mental health support companion</p>
          </div>
        </div>
      </div>
      
      <MoodTracker onMoodLogged={handleMoodLogged} />
      
      <MoodCalendar key={refreshKey} />
      
      <MoodTrends key={refreshKey} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-3">Quick Resources</h2>
          <p className="text-text-secondary">Access helpful tools and exercises</p>
        </div>
        
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-3">Support Network</h2>
          <p className="text-text-secondary">Connect with your circles</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage