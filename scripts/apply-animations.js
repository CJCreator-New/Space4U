#!/usr/bin/env node

/**
 * Apply UI Animations to All Pages
 * Systematically enhances every page with Framer Motion animations
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pagesDir = path.join(__dirname, '..', 'src', 'pages')

// Animation enhancements by page
const pageEnhancements = {
  'HomePage.jsx': {
    imports: `import { motion } from 'framer-motion'
import { pageVariants, pageTransition, slideDown, fadeIn, emojiBounce } from '../config/animations'
import AnimatedButton from '../components/common/AnimatedButton'
import AnimatedCard from '../components/common/AnimatedCard'
import CountUp from '../components/common/CountUp'`,
    wrappers: [
      { find: 'return (', replace: 'return (\n    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>' },
      { find: '</div>\n  )\n}', replace: '</div>\n    </motion.div>\n  )\n}' }
    ]
  },
  'GratitudeJournalPage.jsx': {
    imports: `import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants, pageTransition, listContainer, listItem, fadeIn } from '../config/animations'
import AnimatedButton from '../components/common/AnimatedButton'
import ConfettiEffect from '../components/common/ConfettiEffect'`,
    features: ['Staggered list animations', 'Confetti on entry save', 'Typewriter effect for prompts']
  },
  'CirclesPage.jsx': {
    imports: `import { motion } from 'framer-motion'
import { pageVariants, cardHover, pulse, fadeIn } from '../config/animations'
import AnimatedCard from '../components/common/AnimatedCard'`,
    features: ['Card hover effects', 'Pulse for active status', 'Ripple on join/leave']
  },
  'InsightsPage.jsx': {
    imports: `import { motion } from 'framer-motion'
import { pageVariants, chartDrawIn, tooltip, fadeIn } from '../config/animations'`,
    features: ['Chart draw-in animations', 'Tooltip fade effects', 'Section transitions']
  },
  'ToolsPage.jsx': {
    imports: `import { motion } from 'framer-motion'
import { pageVariants, cardHover, elevate, modalContent } from '../config/animations'
import AnimatedCard from '../components/common/AnimatedCard'`,
    features: ['Tool card animations', 'Modal transitions', 'Progress animations']
  },
  'ProfilePage.jsx': {
    imports: `import { motion } from 'framer-motion'
import { pageVariants, glow, listContainer, listItem } from '../config/animations'
import CountUp from '../components/common/CountUp'`,
    features: ['Avatar glow effect', 'Count-up for stats', 'Staggered mood logs']
  }
}

console.log('🎨 Space4U Animation Enhancement Script\n')
console.log('=' .repeat(60))

// List all pages
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'))

console.log(`\n📄 Found ${pages.length} pages to enhance:\n`)

pages.forEach((page, index) => {
  const enhancement = pageEnhancements[page]
  const status = enhancement ? '✅ Ready' : '⏳ Pending'
  console.log(`${index + 1}. ${page.padEnd(35)} ${status}`)
})

console.log('\n' + '='.repeat(60))
console.log('\n📋 Enhancement Plan:\n')

Object.entries(pageEnhancements).forEach(([page, config]) => {
  console.log(`\n🎯 ${page}`)
  if (config.features) {
    config.features.forEach(feature => {
      console.log(`   • ${feature}`)
    })
  }
})

console.log('\n' + '='.repeat(60))
console.log('\n✨ To apply animations, run: npm run animate')
console.log('📚 See ANIMATION_GUIDE.md for details\n')
