#!/usr/bin/env node

/**
 * Bundle Size Monitor
 * Monitors bundle sizes and alerts on significant changes
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BUILD_DIR = path.join(__dirname, '..', 'dist')
const REPORT_FILE = path.join(__dirname, '..', 'bundle-report.json')
const THRESHOLDS = {
  total: 2.5 * 1024 * 1024, // 2.5MB
  vendor: 1.5 * 1024 * 1024, // 1.5MB
  singleChunk: 500 * 1024 // 500KB
}

function parseBundleSize(sizeStr) {
  const match = sizeStr.match(/([\d.]+)\s*(kB|MB|KB|B)/)
  if (!match) return 0

  const [, size, unit] = match
  const numSize = parseFloat(size)

  switch (unit) {
    case 'MB': return numSize * 1024 * 1024
    case 'kB':
    case 'KB': return numSize * 1024
    case 'B': return numSize
    default: return numSize
  }
}

function analyzeBundle() {
  try {
    const statsFile = path.join(BUILD_DIR, 'stats.html')
    if (!fs.existsSync(statsFile)) {
      console.log('⚠️  Bundle stats not found. Run build with --analyze first.')
      return null
    }

    // Read the build output from terminal (this would need to be captured)
    // For now, we'll create a basic monitoring structure
    const report = {
      timestamp: new Date().toISOString(),
      totalSize: 0,
      chunks: [],
      warnings: [],
      recommendations: []
    }

    // Read previous report for comparison
    let previousReport = null
    if (fs.existsSync(REPORT_FILE)) {
      try {
        previousReport = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'))
      } catch (e) {
        console.log('⚠️  Could not read previous bundle report')
      }
    }

    // This would be populated from actual build output parsing
    // For now, we'll create a placeholder structure

    return report
  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message)
    return null
  }
}

function generateReport() {
  const report = analyzeBundle()
  if (!report) return

  // Save report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2))

  console.log('📊 Bundle Analysis Report')
  console.log('========================')

  if (report.warnings.length > 0) {
    console.log('\n⚠️  Warnings:')
    report.warnings.forEach(warning => console.log(`   - ${warning}`))
  }

  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:')
    report.recommendations.forEach(rec => console.log(`   - ${rec}`))
  }

  console.log(`\n✅ Report saved to ${REPORT_FILE}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateReport()
}

export { analyzeBundle, generateReport }