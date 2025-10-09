import { useState, useEffect } from 'react'
import { 
  Bell, Shield, Palette, Globe, Eye, User, HelpCircle, Info,
  Search, ChevronDown, ChevronRight, Download, Trash2, X, Check,
  Sun, Moon, Monitor, Type, Zap, Volume2, Mail, Smartphone,
  ExternalLink, RotateCcw, Crown, Dot, Keyboard, Upload
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import ExportImportModal from '../components/ExportImportModal'

const DEFAULT_SETTINGS = {
  notifications: {
    dailyReminder: true,
    reminderTime: "09:00",
    reminderDays: "daily",
    circleActivity: true,
    newPosts: true,
    replies: true,
    hearts: false,
    wellnessNudges: true,
    crisisAlerts: true
  },
  privacy: {
    anonymous: true,
    analytics: false,
    autoDelete: "never"
  },
  appearance: {
    theme: "auto",
    textSize: "medium",
    reduceMotion: false
  },
  language: "en",
  accessibility: {
    screenReader: false,
    highContrast: false,
    font: "default",
    haptics: true
  },
  account: {
    email: "",
    phone: ""
  }
}

function SettingsPage() {
  const { theme, setLightTheme, setDarkTheme, setAutoTheme } = useTheme()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    notifications: true,
    privacy: false,
    appearance: false,
    language: false,
    accessibility: false,
    account: false,
    help: false,
    about: false
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showAutoDeleteModal, setShowAutoDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [resetConfirm, setResetConfirm] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  useEffect(() => {
    loadSettings()
    const premiumData = JSON.parse(localStorage.getItem('safespace_premium') || '{}')
    setIsPremium(premiumData.isPremium || false)
  }, [])

  const loadSettings = () => {
    const saved = localStorage.getItem('safespace_settings')
    if (saved) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
    }
  }

  const saveSettings = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('safespace_settings', JSON.stringify(newSettings))
    showToast('Setting saved')
  }

  const updateSetting = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    }
    saveSettings(newSettings)
  }

  const togglePremium = () => {
    const newStatus = !isPremium
    setIsPremium(newStatus)
    if (newStatus) {
      localStorage.setItem('safespace_premium', JSON.stringify({
        isPremium: true,
        plan: 'annual',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }))
      showToast('Premium enabled')
    } else {
      localStorage.removeItem('safespace_premium')
      showToast('Premium disabled')
    }
  }

  const showToast = (message) => {
    const toast = document.createElement('div')
    toast.textContent = message
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-xl shadow-lg z-50'
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 2000)
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const exportData = () => {
    const userData = {
      profile: JSON.parse(localStorage.getItem('safespace_user') || '{}'),
      moods: JSON.parse(localStorage.getItem('safespace_moods') || '{}'),
      posts: JSON.parse(localStorage.getItem('safespace_user_posts') || '[]'),
      circles: JSON.parse(localStorage.getItem('safespace_user_circles') || '[]'),
      badges: JSON.parse(localStorage.getItem('safespace_badges') || '{}'),
      settings: settings,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `safespace-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully')
  }

  const handleDeleteAccount = () => {
    if (deleteConfirm !== 'DELETE') return
    
    const keysToRemove = [
      'safespace_user', 'safespace_moods', 'safespace_user_posts',
      'safespace_user_circles', 'safespace_badges', 'safespace_hearted_posts',
      'safespace_onboarding_completed', 'safespace_settings'
    ]
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    window.location.href = '/'
  }

  const handleResetSettings = () => {
    if (!resetConfirm) return
    
    saveSettings(DEFAULT_SETTINGS)
    setShowResetModal(false)
    setResetConfirm(false)
    showToast('Settings reset to defaults')
  }

  const handleAutoDelete = () => {
    setShowAutoDeleteModal(false)
    showToast('Auto-delete setting updated')
  }

  const isSettingModified = (category, key) => {
    return settings[category][key] !== DEFAULT_SETTINGS[category][key]
  }

  const filteredSections = searchQuery ? 
    Object.keys(expandedSections).filter(section => 
      section.toLowerCase().includes(searchQuery.toLowerCase())
    ) : Object.keys(expandedSections)

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  const SettingRow = ({ icon: Icon, label, description, children, modified = false, premium = false, isNew = false }) => (
    <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Icon className="text-text-secondary" size={20} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-primary">{label}</span>
            {modified && <Dot className="text-primary" size={16} />}
            {premium && <Crown className="text-yellow-500" size={16} />}
            {isNew && <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">New</span>}
          </div>
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  )

  const SectionHeader = ({ icon: Icon, title, expanded, onToggle }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="text-primary" size={24} />
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>
      {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
    </button>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary">Customize your Safespace experience</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
        <input
          type="text"
          placeholder="Search settings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary outline-none"
        />
      </div>

      {/* Developer Tools */}
      <div className="card mb-4 bg-yellow-50 border-2 border-yellow-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="text-yellow-600" size={24} />
              <div>
                <h3 className="font-semibold text-yellow-900">Developer Mode</h3>
                <p className="text-sm text-yellow-700">Toggle premium status for testing</p>
              </div>
            </div>
            <ToggleSwitch checked={isPremium} onChange={togglePremium} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Notifications */}
        <div className="card">
          <SectionHeader
            icon={Bell}
            title="Notifications"
            expanded={expandedSections.notifications}
            onToggle={() => toggleSection('notifications')}
          />
          {expandedSections.notifications && (
            <div className="border-t border-gray-100">
              <SettingRow
                icon={Bell}
                label="Daily mood reminders"
                description="Get reminded to log your daily mood"
                modified={isSettingModified('notifications', 'dailyReminder')}
              >
                <ToggleSwitch
                  checked={settings.notifications.dailyReminder}
                  onChange={(value) => updateSetting('notifications', 'dailyReminder', value)}
                />
              </SettingRow>
              
              {settings.notifications.dailyReminder && (
                <>
                  <SettingRow icon={Bell} label="Reminder time">
                    <input
                      type="time"
                      value={settings.notifications.reminderTime}
                      onChange={(e) => updateSetting('notifications', 'reminderTime', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                    />
                  </SettingRow>
                  
                  <SettingRow icon={Bell} label="Reminder days">
                    <select
                      value={settings.notifications.reminderDays}
                      onChange={(e) => updateSetting('notifications', 'reminderDays', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekdays">Weekdays only</option>
                      <option value="custom">Custom</option>
                    </select>
                  </SettingRow>
                </>
              )}
              
              <SettingRow
                icon={Bell}
                label="Circle activity"
                description="Notifications from your circles"
                modified={isSettingModified('notifications', 'circleActivity')}
              >
                <ToggleSwitch
                  checked={settings.notifications.circleActivity}
                  onChange={(value) => updateSetting('notifications', 'circleActivity', value)}
                />
              </SettingRow>
              
              {settings.notifications.circleActivity && (
                <>
                  <SettingRow icon={Bell} label="New posts in my circles">
                    <ToggleSwitch
                      checked={settings.notifications.newPosts}
                      onChange={(value) => updateSetting('notifications', 'newPosts', value)}
                    />
                  </SettingRow>
                  
                  <SettingRow icon={Bell} label="Replies to my posts">
                    <ToggleSwitch
                      checked={settings.notifications.replies}
                      onChange={(value) => updateSetting('notifications', 'replies', value)}
                    />
                  </SettingRow>
                  
                  <SettingRow icon={Bell} label="Hearts on my content">
                    <ToggleSwitch
                      checked={settings.notifications.hearts}
                      onChange={(value) => updateSetting('notifications', 'hearts', value)}
                    />
                  </SettingRow>
                </>
              )}
              
              <SettingRow
                icon={Zap}
                label="Wellness nudges"
                description="Motivational reminders and streak alerts"
                modified={isSettingModified('notifications', 'wellnessNudges')}
              >
                <ToggleSwitch
                  checked={settings.notifications.wellnessNudges}
                  onChange={(value) => updateSetting('notifications', 'wellnessNudges', value)}
                />
              </SettingRow>
              
              <SettingRow
                icon={Bell}
                label="Crisis alerts"
                description="Important safety alerts (always on)"
              >
                <ToggleSwitch checked={true} onChange={() => {}} disabled={true} />
              </SettingRow>
            </div>
          )}
        </div>

        {/* Privacy & Data */}
        <div className="card">
          <SectionHeader
            icon={Shield}
            title="Privacy & Data"
            expanded={expandedSections.privacy}
            onToggle={() => toggleSection('privacy')}
          />
          {expandedSections.privacy && (
            <div className="border-t border-gray-100">
              <SettingRow
                icon={Eye}
                label="Always post anonymously"
                description="Your identity is hidden in all interactions"
                modified={isSettingModified('privacy', 'anonymous')}
              >
                <ToggleSwitch
                  checked={settings.privacy.anonymous}
                  onChange={(value) => updateSetting('privacy', 'anonymous', value)}
                />
              </SettingRow>
              
              <SettingRow
                icon={Shield}
                label="Allow analytics"
                description="Helps us improve the app. Never includes personal data."
                modified={isSettingModified('privacy', 'analytics')}
              >
                <ToggleSwitch
                  checked={settings.privacy.analytics}
                  onChange={(value) => updateSetting('privacy', 'analytics', value)}
                />
              </SettingRow>
              
              <SettingRow
                icon={Trash2}
                label="Auto-delete old data"
                description={`Automatically delete moods older than ${settings.privacy.autoDelete === 'never' ? 'never' : settings.privacy.autoDelete}`}
                modified={isSettingModified('privacy', 'autoDelete')}
              >
                <select
                  value={settings.privacy.autoDelete}
                  onChange={(e) => {
                    if (e.target.value !== 'never') {
                      setShowAutoDeleteModal(true)
                    }
                    updateSetting('privacy', 'autoDelete', e.target.value)
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                >
                  <option value="never">Never</option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="1 year">1 year</option>
                </select>
              </SettingRow>
              
              <SettingRow icon={Download} label="Export & Import" description="Backup or restore your data" isNew={true}>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Upload size={16} />
                  Manage Data
                </button>
              </SettingRow>
              
              <SettingRow icon={Trash2} label="Delete account" description="Permanently delete your account and data">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete My Account
                </button>
              </SettingRow>
            </div>
          )}
        </div>

        {/* Appearance */}
        <div className="card">
          <SectionHeader
            icon={Palette}
            title="Appearance"
            expanded={expandedSections.appearance}
            onToggle={() => toggleSection('appearance')}
          />
          {expandedSections.appearance && (
            <div className="border-t border-gray-100">
              <SettingRow
                icon={Sun}
                label="Theme"
                description="Choose your preferred theme"
                modified={theme !== 'auto'}
              >
                <div className="flex gap-2">
                  {[
                    { value: 'light', icon: Sun, label: 'Light', action: setLightTheme },
                    { value: 'dark', icon: Moon, label: 'Dark', action: setDarkTheme },
                    { value: 'auto', icon: Monitor, label: 'Auto', action: setAutoTheme }
                  ].map(({ value, icon: Icon, label, action }) => (
                    <button
                      key={value}
                      onClick={action}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        (value === 'auto' && !localStorage.getItem('safespace_theme')) || theme === value
                          ? 'border-primary bg-primary/10 text-primary dark:border-primary-light dark:bg-primary-light/10'
                          : 'border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </SettingRow>
              
              <SettingRow
                icon={Type}
                label="Text size"
                description="Adjust text size for better readability"
                modified={isSettingModified('appearance', 'textSize')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary">A</span>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    value={['small', 'medium', 'large', 'extra-large'].indexOf(settings.appearance.textSize)}
                    onChange={(e) => {
                      const sizes = ['small', 'medium', 'large', 'extra-large']
                      updateSetting('appearance', 'textSize', sizes[e.target.value])
                    }}
                    className="flex-1"
                  />
                  <span className="text-lg text-text-secondary">A</span>
                </div>
              </SettingRow>
              
              <SettingRow
                icon={Zap}
                label="Reduce motion"
                description="Minimize animations for accessibility"
                modified={isSettingModified('appearance', 'reduceMotion')}
              >
                <ToggleSwitch
                  checked={settings.appearance.reduceMotion}
                  onChange={(value) => updateSetting('appearance', 'reduceMotion', value)}
                />
              </SettingRow>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="card">
          <SectionHeader
            icon={Globe}
            title="Language"
            expanded={expandedSections.language}
            onToggle={() => toggleSection('language')}
          />
          {expandedSections.language && (
            <div className="border-t border-gray-100">
              <SettingRow
                icon={Globe}
                label="App language"
                description="More languages coming soon"
                modified={isSettingModified('language', 'language')}
              >
                <select
                  value={settings.language}
                  onChange={(e) => saveSettings({ ...settings, language: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </SettingRow>
            </div>
          )}
        </div>

        {/* Accessibility */}
        <div className="card">
          <SectionHeader
            icon={Eye}
            title="Accessibility"
            expanded={expandedSections.accessibility}
            onToggle={() => toggleSection('accessibility')}
          />
          {expandedSections.accessibility && (
            <div className="border-t border-gray-100">
              <SettingRow
                icon={Eye}
                label="Screen reader optimizations"
                description="Enhanced labels for screen readers"
                modified={isSettingModified('accessibility', 'screenReader')}
              >
                <ToggleSwitch
                  checked={settings.accessibility.screenReader}
                  onChange={(value) => updateSetting('accessibility', 'screenReader', value)}
                />
              </SettingRow>
              
              <SettingRow
                icon={Eye}
                label="High contrast mode"
                description="Increase contrast for better visibility"
                modified={isSettingModified('accessibility', 'highContrast')}
              >
                <ToggleSwitch
                  checked={settings.accessibility.highContrast}
                  onChange={(value) => updateSetting('accessibility', 'highContrast', value)}
                />
              </SettingRow>
              
              <SettingRow
                icon={Type}
                label="Font choice"
                description="Choose a font that works best for you"
                modified={isSettingModified('accessibility', 'font')}
              >
                <select
                  value={settings.accessibility.font}
                  onChange={(e) => updateSetting('accessibility', 'font', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                >
                  <option value="default">Default</option>
                  <option value="dyslexia">Dyslexia-friendly</option>
                  <option value="serif">Serif</option>
                </select>
              </SettingRow>
              
              <SettingRow
                icon={Volume2}
                label="Haptic feedback"
                description="Vibrations for interactions (mobile only)"
                modified={isSettingModified('accessibility', 'haptics')}
              >
                <ToggleSwitch
                  checked={settings.accessibility.haptics}
                  onChange={(value) => updateSetting('accessibility', 'haptics', value)}
                />
              </SettingRow>
            </div>
          )}
        </div>

        {/* Account */}
        <div className="card">
          <SectionHeader
            icon={User}
            title="Account"
            expanded={expandedSections.account}
            onToggle={() => toggleSection('account')}
          />
          {expandedSections.account && (
            <div className="border-t border-gray-100">
              <SettingRow
                icon={Mail}
                label="Email (optional)"
                description="For account recovery only"
              >
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={settings.account.email}
                    onChange={(e) => updateSetting('account', 'email', e.target.value)}
                    placeholder="your@email.com"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                  />
                  <button 
                    disabled
                    title="Coming soon"
                    className="px-3 py-2 text-gray-400 font-medium cursor-not-allowed"
                  >
                    Verify
                  </button>
                </div>
              </SettingRow>
              
              <SettingRow
                icon={Smartphone}
                label="Phone number (optional)"
                description="For OTP login (future feature)"
                premium={true}
              >
                <input
                  type="tel"
                  value={settings.account.phone}
                  onChange={(e) => updateSetting('account', 'phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none"
                  disabled
                />
              </SettingRow>
              
              <SettingRow icon={User} label="Session management" description="Current device logged in">
                <button 
                  disabled
                  title="Coming soon"
                  className="text-gray-400 font-medium cursor-not-allowed"
                >
                  Manage Sessions
                </button>
              </SettingRow>
            </div>
          )}
        </div>

        {/* Help & Support */}
        <div className="card">
          <SectionHeader
            icon={HelpCircle}
            title="Help & Support"
            expanded={expandedSections.help}
            onToggle={() => toggleSection('help')}
          />
          {expandedSections.help && (
            <div className="border-t border-gray-100">
              <SettingRow icon={Keyboard} label="Keyboard shortcuts" description="View all keyboard shortcuts">
                <button 
                  onClick={() => window.dispatchEvent(new Event('showKeyboardHelp'))}
                  className="text-primary dark:text-primary-light font-medium hover:underline"
                >
                  View Shortcuts
                </button>
              </SettingRow>
              
              {[
                { icon: HelpCircle, label: 'FAQ', action: 'View FAQ' },
                { icon: Mail, label: 'Contact support', action: 'Get Help' },
                { icon: ExternalLink, label: 'Report a bug', action: 'Report' },
                { icon: ExternalLink, label: 'Feature requests', action: 'Suggest' },
                { icon: ExternalLink, label: 'Community guidelines', action: 'Read' }
              ].map((item, index) => (
                <SettingRow key={index} icon={item.icon} label={item.label}>
                  <button 
                    disabled
                    title="Coming soon"
                    className="text-gray-400 font-medium cursor-not-allowed"
                  >
                    {item.action}
                  </button>
                </SettingRow>
              ))}
            </div>
          )}
        </div>

        {/* About */}
        <div className="card">
          <SectionHeader
            icon={Info}
            title="About"
            expanded={expandedSections.about}
            onToggle={() => toggleSection('about')}
          />
          {expandedSections.about && (
            <div className="border-t border-gray-100">
              <SettingRow icon={Info} label="App version" description="v1.0.0 (MVP)">
                <span className="text-text-secondary">Current</span>
              </SettingRow>
              
              {[
                { label: 'Terms of Service', action: 'Read' },
                { label: 'Privacy Policy', action: 'Read' },
                { label: 'Open source licenses', action: 'View' }
              ].map((item, index) => (
                <SettingRow key={index} icon={ExternalLink} label={item.label}>
                  <button 
                    disabled
                    title="Coming soon"
                    className="text-gray-400 font-medium cursor-not-allowed"
                  >
                    {item.action}
                  </button>
                </SettingRow>
              ))}
              
              <div className="p-4 text-center">
                <p className="text-text-secondary">Made with ❤️ for mental health</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Settings */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-2 mx-auto px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <RotateCcw size={16} />
          Reset All Settings
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-red-600">Delete Account?</h2>
                <button onClick={() => setShowDeleteModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-text-primary mb-4">
                  This will permanently delete your account and all associated data. This action cannot be undone.
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
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Settings Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Reset All Settings?</h2>
                <button onClick={() => setShowResetModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-text-primary mb-4">
                  This will restore all settings to their default values.
                </p>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={resetConfirm}
                    onChange={(e) => setResetConfirm(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">I understand this cannot be undone</span>
                </label>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetSettings}
                  disabled={!resetConfirm}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export/Import Modal */}
      <ExportImportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />

      {/* Auto Delete Confirmation Modal */}
      {showAutoDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-orange-600">Auto-Delete Data?</h2>
                <button onClick={() => setShowAutoDeleteModal(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-text-primary mb-4">
                  This will permanently delete data older than the selected duration. Continue?
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAutoDeleteModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAutoDelete}
                  className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage