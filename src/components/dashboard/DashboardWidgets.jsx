import { motion } from 'framer-motion'
import RecentMoodsWidget from './RecentMoodsWidget'
import MotivationalQuoteWidget from './MotivationalQuoteWidget'
import ProgressOverviewWidget from './ProgressOverviewWidget'
import QuickActionsWidget from './QuickActionsWidget'

export default function DashboardWidgets() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
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
        <MotivationalQuoteWidget />
      </motion.div>

      {/* Second Row - Quick Actions & Progress (Side by Side on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="animate__animated animate__fadeInLeft"
        >
          <QuickActionsWidget />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="animate__animated animate__fadeInRight"
        >
          <ProgressOverviewWidget />
        </motion.div>
      </div>

      {/* Third Row - Recent Moods (Full Width) */}
      <motion.div
        variants={itemVariants}
        className="animate__animated animate__fadeInUp"
      >
        <RecentMoodsWidget />
      </motion.div>
    </motion.div>
  )
}
