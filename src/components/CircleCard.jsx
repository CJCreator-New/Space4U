import { memo, useCallback } from 'react'
import { formatNumber } from '../utils/helpers'
import { motion } from 'framer-motion'
import { Users, MessageCircle, Sparkles, Clock, Star, ArrowRight } from 'lucide-react'

const CircleCard = memo(function CircleCard({ circle, isJoined, onJoin, onLeave, onClick, onReport }) {
  const {
    tags = [],
    unreadCount = 0,
    featuredPost,
    lastActive,
    highlight
  } = circle

  const handleJoinClick = useCallback((e) => {
    e.stopPropagation()
    if (isJoined) {
      onLeave(circle.id)
    } else {
      onJoin(circle.id)
    }
  }, [isJoined, onLeave, onJoin, circle.id])

  const handleClick = useCallback(() => {
    onClick(circle.id)
  }, [onClick, circle.id])

  const handleReport = useCallback((e) => {
    e.stopPropagation()
    if (onReport) onReport(circle)
  }, [onReport, circle])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') onClick(circle.id)
  }, [onClick, circle.id])

  return (
    <motion.div
      onClick={handleClick}
      className="card relative p-5 cursor-pointer transition-all duration-200 border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
      style={{ borderLeftColor: circle.color }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: '0 10px 36px rgba(15, 23, 42, 0.08)' }}
      role="button"
      tabIndex={0}
      aria-label={`${circle.name} circle card`}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-shrink-0">
        {unreadCount > 0 && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary whitespace-nowrap"
            aria-label={`${unreadCount} new posts`}
          >
            <Sparkles size={12} className="flex-shrink-0" aria-hidden />
            +{unreadCount}
          </span>
        )}
        <button
          onClick={handleReport}
          aria-label={`Report ${circle.name}`}
          className="text-xs font-medium text-text-secondary hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-danger/70 rounded-lg px-2 py-1 whitespace-nowrap"
        >
          Report
        </button>
      </div>

      <div className="flex items-start gap-3 mb-4 pr-28">
        <div className="text-3xl flex-shrink-0 leading-none" aria-hidden>{circle.icon}</div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="font-bold text-base text-text-primary mb-1.5 break-words line-clamp-2">{circle.name}</h3>
          <p className="text-text-secondary text-xs leading-relaxed break-words line-clamp-3">
            {circle.description}
          </p>
        </div>
      </div>

      {highlight && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-primary/5 px-3 py-2">
          <Star size={14} className="text-primary flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-xs text-primary font-medium leading-relaxed break-words line-clamp-2 min-w-0">{highlight}</p>
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Circle topics">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 whitespace-nowrap"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 whitespace-nowrap">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Users size={14} className="opacity-80 flex-shrink-0" aria-hidden />
          <span>{formatNumber(circle.members)}</span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <MessageCircle size={14} className="opacity-80 flex-shrink-0" aria-hidden />
          <span>{formatNumber(circle.posts)}</span>
        </div>
        {lastActive && (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Clock size={14} className="opacity-80 flex-shrink-0" aria-hidden />
            <span className="text-[11px] truncate max-w-[120px]">{lastActive}</span>
          </div>
        )}
      </div>

      {featuredPost && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
            <Sparkles size={12} className="flex-shrink-0" aria-hidden />
            <span>Featured</span>
          </div>
          <p className="text-xs font-medium text-text-primary line-clamp-2 break-words min-w-0">{featuredPost.title}</p>
          <p className="mt-1 text-[11px] text-text-secondary truncate">
            <span className="font-medium text-text-primary">{featuredPost.author}</span> • {featuredPost.timeAgo}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleJoinClick}
          aria-pressed={isJoined}
          aria-label={isJoined ? `Leave ${circle.name}` : `Join ${circle.name}`}
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            isJoined
              ? 'border-success/40 bg-success/10 text-success hover:bg-success/15'
              : 'border-transparent bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {isJoined ? 'Joined' : 'Join'}
        </button>

        <div className="pointer-events-none flex items-center gap-1.5 text-xs text-primary whitespace-nowrap flex-shrink-0">
          <span className="font-medium">Visit</span>
          <ArrowRight size={14} className="flex-shrink-0" aria-hidden />
        </div>
      </div>
    </motion.div>
  )
})

export default CircleCard
