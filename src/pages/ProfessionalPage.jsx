import { useState } from 'react'
import { UserCheck, Phone, Download, Crown } from 'lucide-react'
import { getPremiumStatus } from '../utils/premiumUtils'
import PremiumPaywall from '../components/PremiumPaywall'
import TherapistPortal from '../components/priority6/TherapistPortal'
import CrisisHotlines from '../components/priority6/CrisisHotlines'
import DataExport from '../components/priority6/DataExport'
import SafeComponent from '../components/SafeComponent'

function ProfessionalPage() {
  const { isPremium } = getPremiumStatus()
  const [activeTab, setActiveTab] = useState('therapist')

  const tabs = [
    { id: 'therapist', label: 'Therapist Portal', icon: UserCheck, premium: true },
    { id: 'crisis', label: 'Crisis Support', icon: Phone },
    { id: 'export', label: 'Data Export', icon: Download }
  ]

  return (
    <SafeComponent>
    <div className="max-w-6xl mx-auto p-4 pb-24">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-text-primary">Professional Integration</h1>
          {isPremium && <Crown className="w-6 h-6 text-yellow-500" />}
        </div>
        <p className="text-text-secondary">Connect with professionals and manage your data</p>
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
              {tab.premium && <span className="text-xs">💎</span>}
            </button>
          )
        })}
      </div>

      <div>
        {activeTab === 'therapist' && (
          <PremiumPaywall
            feature="Therapist Portal"
            description="Share your mental health data securely with your therapist. Premium members can generate shareable reports and track therapy progress."
          >
            <TherapistPortal />
          </PremiumPaywall>
        )}
        {activeTab === 'crisis' && <CrisisHotlines />}
        {activeTab === 'export' && <DataExport />}
      </div>
    </div>
  
    </SafeComponent>
  )
}

export default ProfessionalPage
