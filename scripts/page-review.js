#!/usr/bin/env node

/**
 * Space4U - Automated Page Review System
 * Systematically checks all 37 pages for issues
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pagesDir = path.join(__dirname, '..', 'src', 'pages')

// All pages to review
const pages = [
  { name: 'HomePage', path: '/', file: 'HomePage.jsx', priority: 'P0' },
  { name: 'AuthPage', path: '/auth', file: 'AuthPage.jsx', priority: 'P0' },
  { name: 'GratitudeJournalPage', path: '/gratitude', file: 'GratitudeJournalPage.jsx', priority: 'P0' },
  { name: 'HabitTrackerPage', path: '/habits', file: 'HabitTrackerPage.jsx', priority: 'P0' },
  { name: 'GamificationPage', path: '/gamification', file: 'GamificationPage.jsx', priority: 'P1' },
  { name: 'CirclesPage', path: '/circles', file: 'CirclesPage.jsx', priority: 'P0' },
  { name: 'CircleFeedPage', path: '/circles/:id', file: 'CircleFeedPage.jsx', priority: 'P1' },
  { name: 'InsightsPage', path: '/insights', file: 'InsightsPage.jsx', priority: 'P0' },
  { name: 'RemindersPage', path: '/reminders', file: 'RemindersPage.jsx', priority: 'P1' },
  { name: 'SettingsPage', path: '/settings', file: 'SettingsPage.jsx', priority: 'P0' },
  { name: 'ProfilePage', path: '/profile', file: 'ProfilePage.jsx', priority: 'P0' },
  { name: 'PremiumPage', path: '/premium', file: 'PremiumPage.jsx', priority: 'P1' },
  { name: 'ResourceLibraryPage', path: '/resources', file: 'ResourceLibraryPage.jsx', priority: 'P1' },
  { name: 'TherapeuticToolsPage', path: '/tools', file: 'TherapeuticToolsPage.jsx', priority: 'P0' },
  { name: 'WellnessDashboardPage', path: '/wellness', file: 'WellnessDashboardPage.jsx', priority: 'P1' },
  { name: 'CopingSkillsPage', path: '/coping-skills', file: 'CopingSkillsPage.jsx', priority: 'P1' },
  { name: 'EmotionTrackerPage', path: '/emotions', file: 'EmotionTrackerPage.jsx', priority: 'P1' },
  { name: 'MoodTrackingPage', path: '/mood-tracking', file: 'MoodTrackingPage.jsx', priority: 'P1' },
  { name: 'SocialHubPage', path: '/social', file: 'SocialHubPage.jsx', priority: 'P1' },
  { name: 'AdvancedAnalyticsPage', path: '/analytics', file: 'AdvancedAnalyticsPage.jsx', priority: 'P2' },
  { name: 'WellnessPlanPage', path: '/wellness-plan', file: 'WellnessPlanPage.jsx', priority: 'P1' },
  { name: 'BookmarksPage', path: '/bookmarks', file: 'BookmarksPage.jsx', priority: 'P2' },
  { name: 'NotificationsPage', path: '/notifications', file: 'NotificationsPage.jsx', priority: 'P2' },
  { name: 'ProfessionalPage', path: '/professional', file: 'ProfessionalPage.jsx', priority: 'P2' },
  { name: 'TechnicalFeaturesPage', path: '/technical', file: 'TechnicalFeaturesPage.jsx', priority: 'P2' },
  { name: 'PersonalizationPage', path: '/personalization', file: 'PersonalizationPage.jsx', priority: 'P2' },
  { name: 'Priority2FeaturesPage', path: '/features', file: 'Priority2FeaturesPage.jsx', priority: 'P2' },
  { name: 'PremiumFeaturesPage', path: '/premium/features', file: 'PremiumFeaturesPage.jsx', priority: 'P2' },
  { name: 'PremiumManagePage', path: '/premium/manage', file: 'PremiumManagePage.jsx', priority: 'P2' },
  { name: 'PremiumSuccessPage', path: '/premium/success', file: 'PremiumSuccessPage.jsx', priority: 'P2' },
  { name: 'ResourceDetailPage', path: '/resources/:id', file: 'ResourceDetailPage.jsx', priority: 'P2' },
  { name: 'DemoHubPage', path: '/demo', file: 'DemoHubPage.jsx', priority: 'P3' },
  { name: 'VisualDemoPage', path: '/demo/visual', file: 'VisualDemoPage.jsx', priority: 'P3' },
  { name: 'GesturesDemoPage', path: '/demo/gestures', file: 'GesturesDemoPage.jsx', priority: 'P3' },
  { name: 'PerformanceDemoPage', path: '/demo/performance', file: 'PerformanceDemoPage.jsx', priority: 'P3' },
  { name: 'NativeDemoPage', path: '/demo/native', file: 'NativeDemoPage.jsx', priority: 'P3' },
  { name: 'EnhancedHomePage', path: '/enhanced', file: 'EnhancedHomePage.jsx', priority: 'P3' },
  { name: 'UltraEnhancedHomePage', path: '/ultra-enhanced', file: 'UltraEnhancedHomePage.jsx', priority: 'P3' }
]

const results = {
  timestamp: new Date().toISOString(),
  totalPages: pages.length,
  reviewed: 0,
  passed: 0,
  hasIssues: 0,
  critical: 0,
  notFound: 0,
  pages: []
}

// Check if file exists and analyze
function reviewPage(page) {
  const filePath = path.join(pagesDir, page.file)
  const review = {
    name: page.name,
    path: page.path,
    file: page.file,
    priority: page.priority,
    status: '⏳',
    exists: false,
    issues: [],
    checks: {
      fileExists: false,
      hasImports: false,
      hasExport: false,
      hasUseState: false,
      hasUseEffect: false,
      hasConsoleLog: false,
      hasTODO: false,
      hasMapWithoutKey: false,
      hasMissingCleanup: false,
      hasErrorHandling: false
    }
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    review.status = '❌'
    review.issues.push('File does not exist')
    results.notFound++
    return review
  }

  review.exists = true
  review.checks.fileExists = true

  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8')

  // Check for imports
  if (content.includes('import')) {
    review.checks.hasImports = true
  } else {
    review.issues.push('No imports found')
  }

  // Check for export
  if (content.includes('export default')) {
    review.checks.hasExport = true
  } else {
    review.issues.push('No default export found')
  }

  // Check for useState
  if (content.includes('useState')) {
    review.checks.hasUseState = true
  }

  // Check for useEffect
  if (content.includes('useEffect')) {
    review.checks.hasUseEffect = true
  }

  // Check for console.log (should be removed)
  if (content.includes('console.log')) {
    review.checks.hasConsoleLog = true
    review.issues.push('Contains console.log statements')
  }

  // Check for TODO/FIXME
  if (content.match(/TODO|FIXME|HACK/)) {
    review.checks.hasTODO = true
    review.issues.push('Contains TODO/FIXME comments')
  }

  // Check for .map without key
  const mapMatches = content.match(/\.map\([^)]+\)/g)
  if (mapMatches) {
    mapMatches.forEach(match => {
      if (!match.includes('key=')) {
        review.checks.hasMapWithoutKey = true
        review.issues.push('Found .map() without key prop')
      }
    })
  }

  // Check for useEffect cleanup
  const useEffectMatches = content.match(/useEffect\([^}]+\}/gs)
  if (useEffectMatches) {
    useEffectMatches.forEach(match => {
      if (match.includes('setInterval') || match.includes('setTimeout')) {
        if (!match.includes('return () =>')) {
          review.checks.hasMissingCleanup = true
          review.issues.push('useEffect with timer missing cleanup')
        }
      }
    })
  }

  // Check for error handling
  if (content.includes('try') && content.includes('catch')) {
    review.checks.hasErrorHandling = true
  }

  // Determine status
  if (review.issues.length === 0) {
    review.status = '✅'
    results.passed++
  } else if (review.issues.some(i => i.includes('does not exist') || i.includes('export'))) {
    review.status = '❌'
    results.critical++
  } else {
    review.status = '⚠️'
    results.hasIssues++
  }

  results.reviewed++
  return review
}

// Run review
console.log('🔍 Space4U - Automated Page Review\n')
console.log('=' .repeat(80))
console.log(`\nReviewing ${pages.length} pages...\n`)

pages.forEach(page => {
  const review = reviewPage(page)
  results.pages.push(review)
  
  const statusIcon = review.status
  const issueCount = review.issues.length
  const issueText = issueCount > 0 ? `(${issueCount} issues)` : ''
  
  console.log(`${statusIcon} ${page.name.padEnd(30)} ${page.priority} ${issueText}`)
})

// Generate summary
console.log('\n' + '='.repeat(80))
console.log('\n📊 Review Summary\n')
console.log(`Total Pages:     ${results.totalPages}`)
console.log(`Reviewed:        ${results.reviewed}`)
console.log(`✅ Passed:       ${results.passed}`)
console.log(`⚠️  Has Issues:   ${results.hasIssues}`)
console.log(`❌ Critical:     ${results.critical}`)
console.log(`📁 Not Found:    ${results.notFound}`)

const passRate = ((results.passed / results.totalPages) * 100).toFixed(1)
console.log(`\nPass Rate:       ${passRate}%`)

// Save results
const resultsPath = path.join(__dirname, '..', 'page-review-results.json')
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2))
console.log(`\n💾 Results saved to: page-review-results.json`)

// Generate detailed report
generateDetailedReport(results)

function generateDetailedReport(results) {
  const reportPath = path.join(__dirname, '..', 'PAGE_REVIEW_REPORT.md')
  
  let report = `# Space4U - Page Review Report

**Generated:** ${new Date(results.timestamp).toLocaleString()}  
**Total Pages:** ${results.totalPages}  
**Pass Rate:** ${((results.passed / results.totalPages) * 100).toFixed(1)}%

---

## 📊 Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Passed | ${results.passed} | ${((results.passed / results.totalPages) * 100).toFixed(1)}% |
| ⚠️ Has Issues | ${results.hasIssues} | ${((results.hasIssues / results.totalPages) * 100).toFixed(1)}% |
| ❌ Critical | ${results.critical} | ${((results.critical / results.totalPages) * 100).toFixed(1)}% |
| 📁 Not Found | ${results.notFound} | ${((results.notFound / results.totalPages) * 100).toFixed(1)}% |

---

## 📋 Detailed Results

### ✅ Passed (${results.passed} pages)

${results.pages.filter(p => p.status === '✅').map(p => 
  `- **${p.name}** (\`${p.path}\`) - ${p.priority}`
).join('\n') || 'None'}

---

### ⚠️ Has Issues (${results.hasIssues} pages)

${results.pages.filter(p => p.status === '⚠️').map(p => 
  `#### ${p.name} (\`${p.path}\`) - ${p.priority}
**Issues:**
${p.issues.map(i => `- ${i}`).join('\n')}
`
).join('\n') || 'None'}

---

### ❌ Critical Issues (${results.critical} pages)

${results.pages.filter(p => p.status === '❌').map(p => 
  `#### ${p.name} (\`${p.path}\`) - ${p.priority}
**Issues:**
${p.issues.map(i => `- ${i}`).join('\n')}
`
).join('\n') || 'None'}

---

### 📁 Not Found (${results.notFound} pages)

${results.pages.filter(p => !p.exists).map(p => 
  `- **${p.name}** (\`${p.path}\`) - Expected file: \`${p.file}\``
).join('\n') || 'None'}

---

## 🔍 Common Issues Found

${generateCommonIssues(results)}

---

## 🎯 Priority Breakdown

### P0 (Critical) - ${results.pages.filter(p => p.priority === 'P0').length} pages
${generatePrioritySection(results, 'P0')}

### P1 (High) - ${results.pages.filter(p => p.priority === 'P1').length} pages
${generatePrioritySection(results, 'P1')}

### P2 (Medium) - ${results.pages.filter(p => p.priority === 'P2').length} pages
${generatePrioritySection(results, 'P2')}

### P3 (Low) - ${results.pages.filter(p => p.priority === 'P3').length} pages
${generatePrioritySection(results, 'P3')}

---

## 📝 Next Steps

${generateNextSteps(results)}

---

**Generated by:** Space4U Page Review System  
**Report saved to:** PAGE_REVIEW_REPORT.md
`

  fs.writeFileSync(reportPath, report)
  console.log(`📄 Detailed report saved to: PAGE_REVIEW_REPORT.md\n`)
}

function generateCommonIssues(results) {
  const issueTypes = {}
  
  results.pages.forEach(page => {
    page.issues.forEach(issue => {
      issueTypes[issue] = (issueTypes[issue] || 0) + 1
    })
  })
  
  const sorted = Object.entries(issueTypes).sort((a, b) => b[1] - a[1])
  
  if (sorted.length === 0) return 'No common issues found! 🎉'
  
  return sorted.map(([issue, count]) => 
    `- **${issue}** - Found in ${count} page(s)`
  ).join('\n')
}

function generatePrioritySection(results, priority) {
  const pages = results.pages.filter(p => p.priority === priority)
  const passed = pages.filter(p => p.status === '✅').length
  const total = pages.length
  const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0
  
  return `- Total: ${total} pages
- Passed: ${passed} (${rate}%)
- Issues: ${pages.filter(p => p.status === '⚠️').length}
- Critical: ${pages.filter(p => p.status === '❌').length}`
}

function generateNextSteps(results) {
  const steps = []
  
  if (results.critical > 0) {
    steps.push(`1. **Fix Critical Issues** - ${results.critical} page(s) with critical bugs`)
  }
  
  if (results.notFound > 0) {
    steps.push(`${steps.length + 1}. **Create Missing Pages** - ${results.notFound} page(s) not found`)
  }
  
  if (results.hasIssues > 0) {
    steps.push(`${steps.length + 1}. **Address Warnings** - ${results.hasIssues} page(s) with minor issues`)
  }
  
  steps.push(`${steps.length + 1}. **Test All Pages** - Manual testing in browser`)
  steps.push(`${steps.length + 1}. **Performance Audit** - Check console for errors`)
  steps.push(`${steps.length + 1}. **Accessibility Check** - Verify keyboard navigation`)
  
  return steps.join('\n')
}
