import { formatNumber } from '../utils/helpers'
import { motion } from 'framer-motion'
import { Users, MessageCircle, Sparkles, Clock, Star, ArrowRight } from 'lucide-react'

function CircleCard({ circle, isJoined, onJoin, onLeave, onClick, onReport }) {
  const {
    tags = [],
    unreadCount = 0,
    featuredPost,
    lastActive,
    highlight
  } = circle

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
      className="card relative p-5 cursor-pointer transition-all duration-200 border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
      style={{ borderLeftColor: circle.color }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: '0 10px 36px rgba(15, 23, 42, 0.08)' }}
      role="button"
      tabIndex={0}
      aria-label={`${circle.name} circle card`}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(circle.id) }}
    >
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {unreadCount > 0 && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
            aria-label={`${unreadCount} new posts`}
          >
            <Sparkles size={14} aria-hidden />
            +{unreadCount} new
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); if (onReport) onReport(circle) }}
          aria-label={`Report ${circle.name}`}
          className="text-xs font-medium text-text-secondary hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-danger/70 rounded-lg px-2 py-1"
        >
          Report
        </button>
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="text-4xl" aria-hidden>{circle.icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-text-primary mb-1">{circle.name}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {circle.description}
          </p>
        </div>
      </div>

      {highlight && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-primary/5 px-3 py-2 text-xs text-primary-800">
          <Star size={16} className="text-primary" aria-hidden />
          <p className="text-[13px] text-primary font-medium leading-relaxed">{highlight}</p>
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Circle topics">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <Users size={16} className="opacity-80" aria-hidden />
          <span>{formatNumber(circle.members)} members</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="opacity-80" aria-hidden />
          <span>{formatNumber(circle.posts)} posts</span>
        </div>
        {lastActive && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="opacity-80" aria-hidden />
            <span>{lastActive}</span>
          </div>
        )}
      </div>

      {featuredPost && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Sparkles size={14} aria-hidden />
            Featured insight
          </div>
          <p className="mt-2 text-sm font-medium text-text-primary line-clamp-2">{featuredPost.title}</p>
          <p className="mt-1 text-xs text-text-secondary">
            Shared by <span className="font-medium text-text-primary">{featuredPost.author}</span> • {featuredPost.timeAgo}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleJoinClick}
          aria-pressed={isJoined}
          aria-label={isJoined ? `Leave ${circle.name}` : `Join ${circle.name}`}
          className={`inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            isJoined
              ? 'border-success/40 bg-success/10 text-success hover:bg-success/15'
              : 'border-transparent bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {isJoined ? 'Joined' : 'Join Circle'}
        </button>

  <div className="pointer-events-none flex items-center gap-2 text-sm text-primary">
          <span className="font-medium">Visit circle</span>
          <ArrowRight size={16} aria-hidden />
        </div>
      </div>
    </motion.div>
  )
}

export default CircleCard
