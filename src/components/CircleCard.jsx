import { Users, MessageCircle, Check } from 'lucide-react'
import { formatNumber } from '../utils/helpers'
import { motion } from 'framer-motion'

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
    <motion.div
      onClick={() => onClick(circle.id)}
      className="card p-5 cursor-pointer transition-all duration-200 border-l-4"
      style={{ borderLeftColor: circle.color }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(circle.id) }}
    >
      <div className="text-center mb-4">
        <div className="text-4xl mb-3" aria-hidden>
          {circle.icon}
        </div>
        <h3 className="font-bold text-lg text-text-primary mb-2">{circle.name}</h3>
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
          {circle.description}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
        <div className="flex items-center gap-1">
          <Users size={14} aria-hidden />
          <span>{formatNumber(circle.members)} members</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={14} aria-hidden />
          <span>{formatNumber(circle.posts)} posts</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleJoinClick}
        aria-pressed={isJoined}
        aria-label={isJoined ? `Leave ${circle.name}` : `Join ${circle.name}`}
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
    </motion.div>
  )
}

export default CircleCard