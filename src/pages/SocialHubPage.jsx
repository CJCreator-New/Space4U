import { useState } from 'react'
import { Users, MessageCircle, AlertCircle, Lightbulb } from 'lucide-react'
import AccountabilityPartner from '../components/priority4/AccountabilityPartner'
import PeerSupport from '../components/priority4/PeerSupport'
import SupportRequests from '../components/priority4/SupportRequests'
import MoodSuggestions from '../components/priority4/MoodSuggestions'
import SafeComponent from '../components/SafeComponent'

function SocialHubPage() {
  const [activeTab, setActiveTab] = useState('partner')

  const tabs = [
    { id: 'partner', label: 'Accountability', icon: Users },
    { id: 'peer', label: 'Peer Support', icon: MessageCircle },
    { id: 'support', label: 'Support Requests', icon: AlertCircle },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb }
  ]

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Social & Community</h1>
        <p className="text-text-secondary">Connect, support, and grow together</p>
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
        {activeTab === 'partner' && <AccountabilityPartner />}
        {activeTab === 'peer' && <PeerSupport />}
        {activeTab === 'support' && <SupportRequests />}
        {activeTab === 'suggestions' && <MoodSuggestions />}
      </div>
    </div>
  
    </SafeComponent>
  )
}

export default SocialHubPage
