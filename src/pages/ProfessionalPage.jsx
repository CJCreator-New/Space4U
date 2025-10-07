import { useState } from 'react'
import { UserCheck, Phone, Download } from 'lucide-react'
import TherapistPortal from '../components/priority6/TherapistPortal'
import CrisisHotlines from '../components/priority6/CrisisHotlines'
import DataExport from '../components/priority6/DataExport'
import SafeComponent from '../components/SafeComponent'

function ProfessionalPage() {
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
        <h1 className="text-2xl font-bold text-text-primary mb-2">Professional Integration</h1>
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
        {activeTab === 'therapist' && <TherapistPortal />}
        {activeTab === 'crisis' && <CrisisHotlines />}
        {activeTab === 'export' && <DataExport />}
      </div>
    </div>
  
    </SafeComponent>
  )
}

export default ProfessionalPage
