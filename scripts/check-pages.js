#!/usr/bin/env node

/**
 * Page Health Check Script
 * Automatically scans all pages for common issues
 * 
 * Usage: node scripts/check-pages.js
 */

const fs = require('fs')
const path = require('path')

const PAGES_DIR = path.join(__dirname, '../src/pages')
const COMPONENTS_DIR = path.join(__dirname, '../src/components')

const issues = {
  critical: [],
  warnings: [],
  suggestions: []
}

// Patterns to check
const PATTERNS = {
  // Critical issues
  consoleLogs: /console\.(log|debug|info)/g,
  windowObject: /window\./g,
  documentObject: /document\./g,
  todoComments: /TODO|FIXME|HACK/g,
  
  // Warnings
  missingKeys: /\.map\([^)]*\)[^}]*(?!key=)/g,
  inlineStyles: /style=\{\{/g,
  hardcodedText: /(["'])[A-Z][a-z]+\s[a-z]+\1/g,
  
  // Suggestions
  longFunctions: /function\s+\w+\s*\([^)]*\)\s*\{[\s\S]{500,}/g,
  deepNesting: /\{[\s\S]*\{[\s\S]*\{[\s\S]*\{/g
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath)
  const fileIssues = {
    critical: [],
    warnings: [],
    suggestions: []
  }
  
  // Check for console.logs
  const consoleLogs = content.match(PATTERNS.consoleLogs)
  if (consoleLogs && consoleLogs.length > 0) {
    fileIssues.warnings.push({
      type: 'Console logs found',
      count: consoleLogs.length,
      severity: 'warning',
      fix: 'Remove console.logs before production'
    })
  }
  
  // Check for TODOs
  const todos = content.match(PATTERNS.todoComments)
  if (todos && todos.length > 0) {
    fileIssues.warnings.push({
      type: 'TODO comments found',
      count: todos.length,
      severity: 'warning',
      fix: 'Complete or remove TODOs'
    })
  }
  
  // Check for window/document usage (SSR issues)
  const windowUsage = content.match(PATTERNS.windowObject)
  if (windowUsage && windowUsage.length > 0) {
    fileIssues.critical.push({
      type: 'Direct window object usage',
      count: windowUsage.length,
      severity: 'critical',
      fix: 'Add typeof window !== "undefined" check'
    })
  }
  
  // Check for missing React keys
  const mapCalls = content.match(/\.map\(/g)
  const keysFound = content.match(/key=/g)
  if (mapCalls && (!keysFound || keysFound.length < mapCalls.length)) {
    fileIssues.critical.push({
      type: 'Possible missing React keys in .map()',
      severity: 'critical',
      fix: 'Add unique key prop to mapped elements'
    })
  }
  
  // Check for inline styles
  const inlineStyles = content.match(PATTERNS.inlineStyles)
  if (inlineStyles && inlineStyles.length > 0) {
    fileIssues.suggestions.push({
      type: 'Inline styles found',
      count: inlineStyles.length,
      severity: 'suggestion',
      fix: 'Consider using Tailwind classes'
    })
  }
  
  // Check for useEffect without cleanup
  const useEffects = content.match(/useEffect\s*\(/g)
  const cleanups = content.match(/return\s*\(\s*\)\s*=>/g)
  if (useEffects && useEffects.length > 0) {
    if (!cleanups || cleanups.length < useEffects.length) {
      fileIssues.warnings.push({
        type: 'useEffect without cleanup function',
        severity: 'warning',
        fix: 'Add cleanup function if needed (intervals, listeners, etc.)'
      })
    }
  }
  
  // Check for long functions (>500 chars)
  const longFunctions = content.match(PATTERNS.longFunctions)
  if (longFunctions && longFunctions.length > 0) {
    fileIssues.suggestions.push({
      type: 'Long functions found',
      count: longFunctions.length,
      severity: 'suggestion',
      fix: 'Consider breaking into smaller functions'
    })
  }
  
  return {
    file: fileName,
    path: filePath,
    issues: fileIssues,
    lineCount: content.split('\n').length
  }
}

function scanDirectory(dir, results = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      scanDirectory(filePath, results)
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const fileResults = scanFile(filePath)
      results.push(fileResults)
    }
  })
  
  return results
}

function generateReport(results) {
  console.log('\n' + '='.repeat(80))
  console.log('📊 PAGE HEALTH CHECK REPORT')
  console.log('='.repeat(80) + '\n')
  
  let totalCritical = 0
  let totalWarnings = 0
  let totalSuggestions = 0
  
  // Sort by issues count
  results.sort((a, b) => {
    const aTotal = a.issues.critical.length + a.issues.warnings.length + a.issues.suggestions.length
    const bTotal = b.issues.critical.length + b.issues.warnings.length + b.issues.suggestions.length
    return bTotal - aTotal
  })
  
  results.forEach(result => {
    const critical = result.issues.critical.length
    const warnings = result.issues.warnings.length
    const suggestions = result.issues.suggestions.length
    const total = critical + warnings + suggestions
    
    totalCritical += critical
    totalWarnings += warnings
    totalSuggestions += suggestions
    
    if (total > 0) {
      console.log(`\n📄 ${result.file}`)
      console.log(`   Path: ${result.path}`)
      console.log(`   Lines: ${result.lineCount}`)
      
      if (critical > 0) {
        console.log(`   🔴 CRITICAL: ${critical}`)
        result.issues.critical.forEach(issue => {
          console.log(`      - ${issue.type} ${issue.count ? `(${issue.count})` : ''}`)
          console.log(`        Fix: ${issue.fix}`)
        })
      }
      
      if (warnings > 0) {
        console.log(`   ⚠️  WARNINGS: ${warnings}`)
        result.issues.warnings.forEach(issue => {
          console.log(`      - ${issue.type} ${issue.count ? `(${issue.count})` : ''}`)
          console.log(`        Fix: ${issue.fix}`)
        })
      }
      
      if (suggestions > 0) {
        console.log(`   💡 SUGGESTIONS: ${suggestions}`)
        result.issues.suggestions.forEach(issue => {
          console.log(`      - ${issue.type} ${issue.count ? `(${issue.count})` : ''}`)
        })
      }
    }
  })
  
  console.log('\n' + '='.repeat(80))
  console.log('📈 SUMMARY')
  console.log('='.repeat(80))
  console.log(`Files scanned: ${results.length}`)
  console.log(`🔴 Critical issues: ${totalCritical}`)
  console.log(`⚠️  Warnings: ${totalWarnings}`)
  console.log(`💡 Suggestions: ${totalSuggestions}`)
  console.log(`Total issues: ${totalCritical + totalWarnings + totalSuggestions}`)
  
  // Priority fixes
  console.log('\n' + '='.repeat(80))
  console.log('🎯 RECOMMENDED ACTIONS')
  console.log('='.repeat(80))
  
  if (totalCritical > 0) {
    console.log('\n1. Fix CRITICAL issues first:')
    console.log('   - Missing React keys → Add unique key prop')
    console.log('   - Window/document usage → Add SSR checks')
  }
  
  if (totalWarnings > 0) {
    console.log('\n2. Address WARNINGS:')
    console.log('   - Console logs → Remove before production')
    console.log('   - TODOs → Complete or document')
    console.log('   - useEffect cleanup → Add if needed')
  }
  
  if (totalSuggestions > 0) {
    console.log('\n3. Consider SUGGESTIONS:')
    console.log('   - Long functions → Refactor into smaller pieces')
    console.log('   - Inline styles → Use Tailwind classes')
  }
  
  console.log('\n' + '='.repeat(80) + '\n')
  
  // Health score
  const totalIssues = totalCritical + totalWarnings + totalSuggestions
  const maxIssues = results.length * 10 // Assume max 10 issues per file
  const healthScore = Math.max(0, Math.min(100, 100 - (totalIssues / maxIssues * 100)))
  
  console.log(`\n🏥 Overall Health Score: ${healthScore.toFixed(1)}%`)
  
  if (healthScore >= 90) {
    console.log('   ✅ Excellent! Your codebase is in great shape.')
  } else if (healthScore >= 70) {
    console.log('   👍 Good! A few issues to address.')
  } else if (healthScore >= 50) {
    console.log('   ⚠️  Fair. Several issues need attention.')
  } else {
    console.log('   🔴 Poor. Significant cleanup required.')
  }
  
  console.log('\n')
}

// Main execution
console.log('🔍 Scanning pages and components...\n')

const pageResults = scanDirectory(PAGES_DIR)
console.log(`✅ Scanned ${pageResults.length} page files`)

const componentResults = scanDirectory(COMPONENTS_DIR)
console.log(`✅ Scanned ${componentResults.length} component files`)

const allResults = [...pageResults, ...componentResults]
generateReport(allResults)

// Save to file
const reportPath = path.join(__dirname, '../health-report.json')
fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2))
console.log(`📝 Detailed report saved to: ${reportPath}\n`)
