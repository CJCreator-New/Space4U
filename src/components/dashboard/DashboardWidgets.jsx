import { memo } from 'react'
import { motion } from 'framer-motion'
import RecentMoodsWidget from './RecentMoodsWidget'
import MotivationalQuoteWidget from './MotivationalQuoteWidget'
import ProgressOverviewWidget from './ProgressOverviewWidget'
import QuickActionsWidget from './QuickActionsWidget'

// Memoize child widgets
const MemoizedRecentMoods = memo(RecentMoodsWidget)
const MemoizedMotivationalQuote = memo(MotivationalQuoteWidget)
const MemoizedProgressOverview = memo(ProgressOverviewWidget)
const MemoizedQuickActions = memo(QuickActionsWidget)

export default function DashboardWidgets() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Row - Motivational Quote (Full Width) */}
      <motion.div
        variants={itemVariants}
        className="animate__animated animate__fadeInUp"
      >
        <MemoizedMotivationalQuote />
      </motion.div>

      {/* Second Row - Quick Actions & Progress (Side by Side on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="animate__animated animate__fadeInLeft"
        >
          <MemoizedQuickActions />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="animate__animated animate__fadeInRight"
        >
          <MemoizedProgressOverview />
        </motion.div>
      </div>

      {/* Third Row - Recent Moods (Full Width) */}
      <motion.div
        variants={itemVariants}
        className="animate__animated animate__fadeInUp"
      >
        <MemoizedRecentMoods />
      </motion.div>
    </motion.div>
  )
}
