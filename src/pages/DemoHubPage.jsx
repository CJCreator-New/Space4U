import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Smartphone, Zap, Palette, Fingerprint } from 'lucide-react'

function DemoHubPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const demos = [
    {
      id: 'gestures',
      title: t('demo.gestures'),
      description: t('demo.gesturesDesc'),
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-600',
      path: '/demo/gestures'
    },
    {
      id: 'visual',
      title: t('demo.visual'),
      description: t('demo.visualDesc'),
      icon: Palette,
      color: 'from-purple-500 to-pink-600',
      path: '/demo/visual'
    },
    {
      id: 'native',
      title: t('demo.native'),
      description: t('demo.nativeDesc'),
      icon: Fingerprint,
      color: 'from-indigo-500 to-purple-600',
      path: '/demo/native'
    },
    {
      id: 'performance',
      title: t('demo.performance'),
      description: t('demo.performanceDesc'),
      icon: Zap,
      color: 'from-green-500 to-teal-600',
      path: '/demo/performance'
    }
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="touch-target mb-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">{t('demo.title')}</h1>
        <p className="text-indigo-100 mt-1">{t('demo.subtitle')}</p>
      </div>

      <div className="p-6 space-y-4">
        {demos.map((demo) => {
          const Icon = demo.icon
          return (
            <button
              key={demo.id}
              onClick={() => navigate(demo.path)}
              className="w-full card p-6 text-left hover-lift"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${demo.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{demo.title}</h3>
                  <p className="text-sm text-text-secondary">{demo.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DemoHubPage
