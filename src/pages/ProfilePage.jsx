import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Edit, TrendingUp, Users, Award, Clock, MessageCircle, Heart, 
  ChevronRight, Bell, Shield, Globe, HelpCircle, Info, Download, 
  Trash2, X, Check, Eye, Calendar, Target, Book, Settings, Crown
} from 'lucide-react'
import SafeComponent from '../components/SafeComponent'
import MicroInteraction from '../components/common/MicroInteraction'
import OnboardingTip from '../components/common/OnboardingTip'
import { 
  BADGES, 
  LEVELS, 
  initializeBadgeSystem, 
  getProgressToNextLevel
} from '../utils/badgeSystem'

const AVATARS = ['', '', '', '', '', '', '', '', '', 'â˜•', '', 'â­']

function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [badgeData, setBadgeData] = useState(null)
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [circles, setCircles] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [showPremiumBanner, setShowPremiumBanner] = useState(true)
  const [editForm, setEditForm] = useState({
    username: '',
    avatar: '',
    bio: '',
    interests: []
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const { getUserProfile } = await import('../utils/storageHelpers')
    const userData = await getUserProfile()
    const safeUserData = userData || {}
    setUser(safeUserData)
    setEditForm({
      username: safeUserData.username || '',
      avatar: safeUserData.avatar || '',
      bio: safeUserData.bio || '',
      interests: safeUserData.interests || []
    })
    
    const badges = await initializeBadgeSystem()
    setBadgeData(badges)
    
    calculateStats()
    loadActivities()
    loadCircles()
    loadSavedPosts()
    
    const dismissedBanner = localStorage.getItem('space4u_premium_banner_dismissed')
    setShowPremiumBanner(!dismissedBanner)
  }

  const calculateStats = async () => {
    const { storage } = await import('../services/storage')
    const moods = await storage.get('space4u_moods') || {}
    const posts = await storage.get('space4u_user_posts') || []
    const userCircles = await storage.get('space4u_user_circles') || []
    
    const moodEntries = Object.values(moods)
    const currentStreak = calculateStreak(moods)
    const thisWeekMoods = moodEntries.filter(mood => {
      const moodDate = new Date(mood.timestamp)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return moodDate >= weekAgo
    })
    
    const avgMood = thisWeekMoods.length > 0 
      ? thisWeekMoods.reduce((sum, mood) => sum + mood.mood, 0) / thisWeekMoods.length
      : 0
    
    const heartsReceived = posts.reduce((total, post) => total + (post.hearts || 0), 0)
    
    setStats({
      currentStreak,
      totalMoodLogs: moodEntries.length,
      avgMoodThisWeek: avgMood,
      circlesJoined: userCircles.length,
      postsCreated: posts.length,
      heartsReceived
    })
  }

  const calculateStreak = (moods) => {
    const today = new Date()
    let streak = 0
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      if (moods[dateStr]) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const loadActivities = () => {
    const activities = [
      { type: 'mood', text: 'Logged mood ', time: '2 hours ago', icon: '' },
      { type: 'post', text: 'Posted in Anxiety Support', time: '5 hours ago', icon: '' },
      { type: 'badge', text: 'Earned "Week Warrior" badge ', time: '1 day ago', icon: '' },
      { type: 'circle', text: 'Joined Work & Career circle', time: '2 days ago', icon: '' },
      { type: 'mood', text: 'Logged mood ', time: '1 day ago', icon: '' },
      { type: 'exercise', text: 'Completed breathing exercise', time: '3 days ago', icon: '' },
      { type: 'post', text: 'Posted in Daily Check-in', time: '4 days ago', icon: '' },
      { type: 'mood', text: 'Logged mood ', time: '4 days ago', icon: '' }
    ]
    setActivities(activities)
  }

  const loadCircles = async () => {
    const { storage } = await import('../services/storage')
    const userCircles = await storage.get('space4u_user_circles') || []
    const allCircles = await storage.get('space4u_circles') || []
    
    const joinedCircles = allCircles.filter(circle => 
      userCircles.includes(circle.id)
    ).map(circle => ({
      ...circle,
      unreadCount: Math.floor(Math.random() * 5) // Mock unread count
    }))
    
    setCircles(joinedCircles)
  }

  const loadSavedPosts = async () => {
    const { storage } = await import('../services/storage')
    const heartedPosts = await storage.get('space4u_hearted_posts') || []
    const allPosts = await storage.get('space4u_posts') || []
    
    const saved = allPosts.filter(post => heartedPosts.includes(post.id)).slice(0, 3)
    setSavedPosts(saved)
  }

  const handleEditProfile = async () => {
    const { saveUserProfile } = await import('../utils/storageHelpers')
    const updatedUser = {
      ...user,
      ...editForm,
      updatedAt: new Date().toISOString()
    }
    
    await saveUserProfile(updatedUser)
    setUser(updatedUser)
    setShowEditModal(false)
    
    // Show success toast
    const toast = document.createElement('div')
    toast.textContent = 'Profile updated successfully!'
    toast.className = 'fixed top-4 right-4 bg-success text-white px-4 py-2 rounded-xl shadow-lg z-50'
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 2000)
  }

  const handleDeleteAccount = () => {
    if (deleteConfirm !== 'DELETE') return
    
    // Clear all user data
    const keysToRemove = [
      'space4u_user', 'space4u_moods', 'space4u_user_posts',
      'space4u_user_circles', 'space4u_badges', 'space4u_hearted_posts',
      'space4u_onboarding_completed'
    ]
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    // Redirect to onboarding
    window.location.href = '/'
  }

  const exportData = () => {
    const userData = {
      profile: JSON.parse(localStorage.getItem('space4u_user') || '{}'),
      moods: JSON.parse(localStorage.getItem('space4u_moods') || '{}'),
      posts: JSON.parse(localStorage.getItem('space4u_user_posts') || '[]'),
      circles: JSON.parse(localStorage.getItem('space4u_user_circles') || '[]'),
      badges: JSON.parse(localStorage.getItem('space4u_badges') || '{}'),
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `space4u-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const dismissPremiumBanner = () => {
    localStorage.setItem('space4u_premium_banner_dismissed', 'true')
    setShowPremiumBanner(false)
  }

  const getCurrentLevel = () => {
    if (!badgeData) return LEVELS.beginner
    return LEVELS[badgeData.level] || LEVELS.beginner
  }

  const currentLevel = getCurrentLevel()
  const nextLevelProgress = badgeData ? getProgressToNextLevel(badgeData.totalPoints) : { progress: 0 }
  const unlockedCount = badgeData?.badges.filter(b => b.unlocked).length || 0
  const totalBadges = Object.keys(BADGES).length

  if (!user || !stats) {
    return (
    <SafeComponent>
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="card p-6">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    
    </SafeComponent>
  )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <OnboardingTip page="profile" />
      
      {/* Premium Banner */}
      {showPremiumBanner && (
        <div className="bg-gradient-to-r from-primary to-primary-light text-white p-4 rounded-xl mb-6 relative">
          <button 
            onClick={dismissPremiumBanner}
            className="absolute top-2 right-2 text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Unlock Premium for advanced insights</h3>
              <p className="text-sm text-white/90">Full history • Priority support • Ad-free experience</p>
            </div>
            <button className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6 rounded-xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-30 h-30 bg-white/20 rounded-full flex items-center justify-center text-4xl border-4"
                 style={{ 
                   width: '120px', 
                   height: '120px',
                   borderColor: badgeData?.totalPoints >= 500 ? '#FFD700' : 'rgba(255,255,255,0.3)'
                 }}>
              {user.avatar || ''}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold">{user.username || 'Anonymous User'}</h1>
                {badgeData?.totalPoints >= 500 && <Crown className="text-yellow-300" size={24} />}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  Anonymous User
                </span>
                {badgeData?.totalPoints >= 500 && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                    Premium Member
                  </span>
                )}
              </div>
              <p className="text-white/80">Member since Oct 2025</p>
            </div>
          </div>
          <MicroInteraction type="scale">
            <button 
              onClick={() => setShowEditModal(true)}
              className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
            >
              <Edit size={20} />
            </button>
          </MicroInteraction>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        {/* Mood Journey */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-primary" size={24} />
            <h3 className="text-lg font-semibold">Mood Journey</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-secondary">Current streak</p>
              <p className="text-xl font-bold">{stats.currentStreak} days</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total mood logs</p>
              <p className="text-xl font-bold">{stats.totalMoodLogs}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Average mood this week</p>
              <p className="text-xl font-bold">{stats.avgMoodThisWeek.toFixed(1)}</p>
            </div>
          </div>
          <MicroInteraction type="press">
            <button 
              onClick={() => navigate('/insights')}
              className="text-primary font-medium text-sm mt-4 hover:underline"
            >
              View Insights
            </button>
          </MicroInteraction>
        </div>

        {/* Community */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-primary" size={24} />
            <h3 className="text-lg font-semibold">Community</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-secondary">Circles joined</p>
              <p className="text-xl font-bold">{stats.circlesJoined}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Posts created</p>
              <p className="text-xl font-bold">{stats.postsCreated}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Hearts received</p>
              <p className="text-xl font-bold">{stats.heartsReceived}</p>
            </div>
          </div>
          <MicroInteraction type="press">
            <button 
              onClick={() => navigate('/circles')}
              className="text-primary font-medium text-sm mt-4 hover:underline"
            >
              My Circles
            </button>
          </MicroInteraction>
        </div>

        {/* Achievements */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-primary" size={24} />
            <h3 className="text-lg font-semibold">Achievements</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-secondary">Current level</p>
              <p className="text-xl font-bold">{currentLevel.name} {currentLevel.emoji}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total points</p>
              <p className="text-xl font-bold">{badgeData?.totalPoints || 0}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Badges earned</p>
              <p className="text-xl font-bold">{unlockedCount}/{totalBadges}</p>
            </div>
          </div>
          <button className="text-primary font-medium text-sm mt-4 hover:underline">
            View Badges
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Your Recent Activity</h3>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity, index) => (
            <div key={index} className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-text-primary">{activity.text}</p>
                <p className="text-sm text-text-secondary">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        {activities.length > 10 && (
          <button className="text-primary font-medium text-sm mt-4 hover:underline">
            Load more
          </button>
        )}
      </div>

      {/* My Circles */}
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">My Circles</h3>
        {circles.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {circles.map((circle) => (
              <div key={circle.id} className="flex-shrink-0 bg-gray-50 p-4 rounded-xl min-w-48">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{circle.icon}</span>
                  <div>
                    <h4 className="font-medium">{circle.name}</h4>
                    {circle.unreadCount > 0 && (
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {circle.unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/circles/${circle.id}`)}
                  className="text-primary font-medium text-sm hover:underline"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto text-text-secondary mb-4" size={48} />
            <h4 className="text-lg font-semibold mb-2">Join your first circle</h4>
            <p className="text-text-secondary mb-4">Connect with others who understand your journey</p>
            <MicroInteraction type="scale">
              <button 
                onClick={() => navigate('/circles')}
                className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Explore Circles
              </button>
            </MicroInteraction>
          </div>
        )}
      </div>

      {/* Saved Posts */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Posts I've Hearted</h3>
          <button className="text-primary font-medium text-sm hover:underline">
            See All
          </button>
        </div>
        {savedPosts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {savedPosts.map((post) => (
              <div key={post.id} className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-text-primary mb-2 line-clamp-3">
                  {post.content.slice(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>{post.circle}</span>
                  <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="mx-auto text-text-secondary mb-4" size={48} />
            <p className="text-text-secondary">No saved posts yet</p>
          </div>
        )}
      </div>

      {/* Settings Quick Links */}
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Settings</h3>
        <div className="space-y-3">
          {[
            { icon: Bell, label: 'Notifications', onClick: () => {} },
            { icon: Shield, label: 'Privacy & Data', onClick: () => {} },
            { icon: Crown, label: badgeData?.totalPoints >= 500 ? 'Manage Premium' : 'Upgrade to Premium', onClick: () => navigate(badgeData?.totalPoints >= 500 ? '/premium/manage' : '/premium') },
            { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
            { icon: Globe, label: 'Language', onClick: () => {} },
            { icon: HelpCircle, label: 'Help & Support', onClick: () => {} },
            { icon: Book, label: 'Resource Library', onClick: () => navigate('/resources') },
            { icon: Info, label: 'About space4u', onClick: () => {} }
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="text-text-secondary" size={20} />
                <span className="text-text-primary">{item.label}</span>
              </div>
              <ChevronRight className="text-text-secondary" size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button
            onClick={exportData}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <Download className="text-primary" size={20} />
            <div className="text-left">
              <p className="font-medium text-text-primary">Export My Data</p>
              <p className="text-sm text-text-secondary">Download all your data as JSON</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-red-600"
          >
            <Trash2 size={20} />
            <div className="text-left">
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-red-500">Permanently delete your account and data</p>
            </div>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <button onClick={() => setShowEditModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Avatar Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Avatar</label>
                  <div className="grid grid-cols-6 gap-3">
                    {AVATARS.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setEditForm({...editForm, avatar})}
                        className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center border-2 ${
                          editForm.avatar === avatar ? 'border-primary bg-primary/10' : 'border-gray-200'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary outline-none"
                    placeholder="Enter username"
                    maxLength={20}
                  />
                  <p className="text-xs text-text-secondary mt-1">{editForm.username.length}/20 characters</p>
                </div>
                
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bio (Optional)</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary outline-none resize-none"
                    placeholder="Tell your story anonymously..."
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-text-secondary mt-1">{editForm.bio.length}/200 characters</p>
                </div>
                
                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium mb-2">Interests</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Anxiety', 'Depression', 'Stress', 'Work', 'Relationships', 'Self-care'].map((interest) => (
                      <button
                        key={interest}
                        onClick={() => {
                          const interests = editForm.interests.includes(interest)
                            ? editForm.interests.filter(i => i !== interest)
                            : [...editForm.interests, interest]
                          setEditForm({...editForm, interests})
                        }}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          editForm.interests.includes(interest)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProfile}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-red-600">Delete Account</h2>
                <button onClick={() => setShowDeleteModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-text-primary mb-4">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  All your data including moods, posts, and badges will be permanently deleted.
                </p>
                <p className="text-sm font-medium mb-2">Type "DELETE" to confirm:</p>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:border-red-500 outline-none"
                  placeholder="DELETE"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== 'DELETE'}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
