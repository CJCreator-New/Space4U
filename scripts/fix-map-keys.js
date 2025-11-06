#!/usr/bin/env node

/**
 * Space4U - Auto-fix Missing Keys in .map()
 * Automatically adds key props to .map() calls
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pagesDir = path.join(__dirname, '..', 'src', 'pages')

// Pages with missing key issues
const pagesToFix = [
  'HomePage.jsx',
  'GratitudeJournalPage.jsx',
  'HabitTrackerPage.jsx',
  'GamificationPage.jsx',
  'CirclesPage.jsx',
  'CircleFeedPage.jsx',
  'InsightsPage.jsx',
  'RemindersPage.jsx',
  'SettingsPage.jsx',
  'ProfilePage.jsx',
  'PremiumPage.jsx',
  'ResourceLibraryPage.jsx',
  'TherapeuticToolsPage.jsx',
  'WellnessDashboardPage.jsx',
  'EmotionTrackerPage.jsx',
  'WellnessPlanPage.jsx',
  'NotificationsPage.jsx',
  'PremiumFeaturesPage.jsx',
  'PremiumManagePage.jsx',
  'PremiumSuccessPage.jsx',
  'ResourceDetailPage.jsx',
  'DemoHubPage.jsx',
  'GesturesDemoPage.jsx',
  'EnhancedHomePage.jsx',
  'UltraEnhancedHomePage.jsx'
]

let totalFixed = 0
let filesModified = 0

console.log('🔧 Space4U - Auto-fix Missing Keys\n')
console.log('=' .repeat(80))
console.log(`\nFixing ${pagesToFix.length} files...\n`)

pagesToFix.forEach(file => {
  const filePath = path.join(pagesDir, file)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${file} - File not found, skipping`)
    return
  }
  
  let content = fs.readFileSync(filePath, 'utf-8')
  const originalContent = content
  let fixCount = 0
  
  // Pattern 1: .map(item => <Component>
  // Fix: .map(item => <Component key={item.id}>
  content = content.replace(
    /\.map\(\((\w+),?\s*(\w+)?\)\s*=>\s*<(\w+)(?!\s+key=)/g,
    (match, itemName, indexName, componentName) => {
      fixCount++
      if (indexName) {
        return `.map((${itemName}, ${indexName}) => <${componentName} key={${indexName}}`
      }
      return `.map((${itemName}) => <${componentName} key={${itemName}.id || ${itemName}.name || Math.random()}`
    }
  )
  
  // Pattern 2: .map((item) => ( <Component>
  content = content.replace(
    /\.map\(\((\w+),?\s*(\w+)?\)\s*=>\s*\(\s*<(\w+)(?!\s+key=)/g,
    (match, itemName, indexName, componentName) => {
      fixCount++
      if (indexName) {
        return `.map((${itemName}, ${indexName}) => (\n    <${componentName} key={${indexName}}`
      }
      return `.map((${itemName}) => (\n    <${componentName} key={${itemName}.id || ${itemName}.name || Math.random()}`
    }
  )
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ ${file} - Fixed ${fixCount} issue(s)`)
    totalFixed += fixCount
    filesModified++
  } else {
    console.log(`⏭️  ${file} - No issues found or already fixed`)
  }
})

console.log('\n' + '='.repeat(80))
console.log('\n📊 Fix Summary\n')
console.log(`Files Modified:  ${filesModified}`)
console.log(`Total Fixes:     ${totalFixed}`)
console.log(`\n✅ Auto-fix complete!\n`)
console.log('⚠️  Note: Some fixes may need manual review')
console.log('💡 Run "node scripts/page-review.js" to verify\n')
