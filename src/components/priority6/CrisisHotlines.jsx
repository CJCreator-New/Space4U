import { Phone, MessageCircle, Globe } from 'lucide-react'

function CrisisHotlines() {
  const hotlines = [
    {
      country: 'US',
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      available: '24/7',
      languages: ['English', 'Spanish']
    },
    {
      country: 'US',
      name: 'Crisis Text Line',
      phone: '741741',
      type: 'text',
      available: '24/7',
      languages: ['English']
    },
    {
      country: 'UK',
      name: 'Samaritans',
      phone: '116 123',
      available: '24/7',
      languages: ['English']
    },
    {
      country: 'CA',
      name: 'Crisis Services Canada',
      phone: '1-833-456-4566',
      available: '24/7',
      languages: ['English', 'French']
    },
    {
      country: 'AU',
      name: 'Lifeline Australia',
      phone: '13 11 14',
      available: '24/7',
      languages: ['English']
    }
  ]

  const callHotline = (phone) => {
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${phone.replace(/\s/g, '')}`
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">⚠️ If you're in crisis</h3>
        <p className="text-sm text-red-800 mb-4">
          If you're experiencing a mental health emergency, please reach out immediately. 
          These services are free, confidential, and available 24/7.
        </p>
        <p className="text-xs text-red-700">
          In case of immediate danger, call emergency services (911 in US, 999 in UK, 000 in AU)
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary">Crisis Hotlines by Country</h3>
        {hotlines.map((hotline, i) => (
          <div key={i} className="bg-surface rounded-2xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                    {hotline.country}
                  </span>
                  <span className="text-xs text-text-secondary">{hotline.available}</span>
                </div>
                <h4 className="font-semibold text-text-primary mb-1">{hotline.name}</h4>
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                  <Globe size={14} />
                  <span>{hotline.languages.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => callHotline(hotline.phone)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
              >
                {hotline.type === 'text' ? <MessageCircle size={18} /> : <Phone size={18} />}
                {hotline.phone}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-semibold text-blue-900 mb-2">Additional Resources</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• SAMHSA National Helpline: 1-800-662-4357 (Substance abuse)</li>
          <li>• Veterans Crisis Line: 988 then press 1</li>
          <li>• Trevor Project (LGBTQ+): 1-866-488-7386</li>
          <li>• Trans Lifeline: 1-877-565-8860</li>
        </ul>
      </div>
    </div>
  )
}

export default CrisisHotlines
