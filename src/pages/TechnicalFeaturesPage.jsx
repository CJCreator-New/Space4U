import { useState } from 'react'
import { Mic, Wifi, Smartphone } from 'lucide-react'
import VoiceJournal from '../components/priority7/VoiceJournal'
import OfflineMode from '../components/priority7/OfflineMode'
import PWASettings from '../components/priority7/PWASettings'

function TechnicalFeaturesPage() {
  const [activeTab, setActiveTab] = useState('voice')

  const tabs = [
    { id: 'voice', label: 'Voice Journal', icon: Mic },
    { id: 'offline', label: 'Offline Mode', icon: Wifi },
    { id: 'pwa', label: 'PWA Settings', icon: Smartphone }
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Technical Features</h1>
        <p className="text-text-secondary">Voice journaling, offline mode, and PWA settings</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div>
        {activeTab === 'voice' && <VoiceJournal />}
        {activeTab === 'offline' && <OfflineMode />}
        {activeTab === 'pwa' && <PWASettings />}
      </div>
    </div>
  )
}

export default TechnicalFeaturesPage
