import { Users, MessageCircle, Check } from 'lucide-react'
import { formatNumber } from '../utils/helpers'

function CircleCard({ circle, isJoined, onJoin, onLeave, onClick }) {
  const handleJoinClick = (e) => {
    e.stopPropagation()
    if (isJoined) {
      onLeave(circle.id)
    } else {
      onJoin(circle.id)
    }
  }

  return (
    <div
      onClick={() => onClick(circle.id)}
      className="card p-5 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4"
      style={{ borderLeftColor: circle.color }}
    >
      <div className="text-center mb-4">
        <div className="text-4xl mb-3">{circle.icon}</div>
        <h3 className="font-bold text-lg text-text-primary mb-2">{circle.name}</h3>
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
          {circle.description}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{formatNumber(circle.members)} members</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={14} />
          <span>{formatNumber(circle.posts)} posts</span>
        </div>
      </div>

      <button
        onClick={handleJoinClick}
        className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
          isJoined
            ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20'
            : 'bg-primary text-white hover:bg-primary/90'
        }`}
      >
        {isJoined ? (
          <div className="flex items-center justify-center gap-2">
            <Check size={16} />
            Joined
          </div>
        ) : (
          'Join Circle'
        )}
      </button>
    </div>
  )
}

export default CircleCard