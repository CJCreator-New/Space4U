import { Smile, Heart, Book, Users, TrendingUp, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    { icon: Smile, label: 'Log Mood', action: () => navigate('/'), color: 'bg-blue-500' },
    { icon: Heart, label: 'Gratitude', action: () => navigate('/gratitude'), color: 'bg-pink-500' },
    { icon: Book, label: 'Resources', action: () => navigate('/resources'), color: 'bg-purple-500' },
    { icon: Users, label: 'Circles', action: () => navigate('/circles'), color: 'bg-green-500' },
    { icon: TrendingUp, label: 'Insights', action: () => navigate('/insights'), color: 'bg-orange-500' }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      {/* Quick Action Button */}
      <button
        className="w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group-hover:rotate-45"
        aria-label="Quick actions"
      >
        <Plus size={24} />
      </button>

      {/* Action Menu */}
      <div className="absolute bottom-16 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 space-y-2">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.action}
            className={`flex items-center gap-3 ${action.color} text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-all whitespace-nowrap`}
            style={{ transitionDelay: `${idx * 50}ms` }}
          >
            <action.icon size={18} />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
