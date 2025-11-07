#!/usr/bin/env node

/**
 * Performance Testing Script
 * Measures key performance metrics and validates optimization targets
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Running Performance Tests...\n')

const results = {
  timestamp: new Date().toISOString(),
  metrics: {},
  passed: [],
  failed: []
}

// Test 1: Bundle Size
console.log('📦 Test 1: Bundle Size Analysis')
try {
  execSync('npm run build', { stdio: 'pipe' })
  
  const distPath = path.join(process.cwd(), 'dist', 'assets')
  const files = fs.readdirSync(distPath)
  const jsFiles = files.filter(f => f.endsWith('.js'))
  
  let totalSize = 0
  jsFiles.forEach(file => {
    totalSize += fs.statSync(path.join(distPath, file)).size
  })
  
  const sizeKB = totalSize / 1024
  const gzippedEstimate = sizeKB / 3
  
  results.metrics.bundleSize = sizeKB.toFixed(2)
  results.metrics.gzippedSize = gzippedEstimate.toFixed(2)
  
  if (gzippedEstimate < 120) {
    results.passed.push('Bundle size < 120KB gzipped ✅')
    console.log(`   ✅ PASS: ${gzippedEstimate.toFixed(2)}KB (target: <120KB)`)
  } else {
    results.failed.push(`Bundle size ${gzippedEstimate.toFixed(2)}KB (target: <120KB)`)
    console.log(`   ❌ FAIL: ${gzippedEstimate.toFixed(2)}KB (target: <120KB)`)
  }
} catch (error) {
  console.log('   ❌ Build failed')
  results.failed.push('Build failed')
}

// Test 2: Chunk Count
console.log('\n📊 Test 2: Chunk Count')
try {
  const distPath = path.join(process.cwd(), 'dist', 'assets')
  const files = fs.readdirSync(distPath)
  const jsFiles = files.filter(f => f.endsWith('.js'))
  
  results.metrics.chunkCount = jsFiles.length
  
  if (jsFiles.length >= 8 && jsFiles.length <= 25) {
    results.passed.push(`Chunk count ${jsFiles.length} (optimal range) ✅`)
    console.log(`   ✅ PASS: ${jsFiles.length} chunks (optimal: 8-25)`)
  } else {
    results.failed.push(`Chunk count ${jsFiles.length} (optimal: 8-25)`)
    console.log(`   ⚠️  WARNING: ${jsFiles.length} chunks (optimal: 8-25)`)
  }
} catch (error) {
  console.log('   ❌ Failed to count chunks')
}

// Test 3: Code Quality
console.log('\n🔍 Test 3: Code Quality Checks')
const qualityChecks = [
  { name: 'No console.logs in production', pattern: /console\.log/, invert: true },
  { name: 'No debugger statements', pattern: /debugger/, invert: true },
  { name: 'Lazy loading implemented', pattern: /lazy\(\(\) => import/, invert: false },
  { name: 'Memoization used', pattern: /memo\(|useMemo|useCallback/, invert: false }
]

qualityChecks.forEach(check => {
  try {
    const srcPath = path.join(process.cwd(), 'src')
    const files = getAllFiles(srcPath, '.jsx')
    let found = false
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8')
      if (check.pattern.test(content)) {
        found = true
      }
    })
    
    const passed = check.invert ? !found : found
    if (passed) {
      results.passed.push(`${check.name} ✅`)
      console.log(`   ✅ ${check.name}`)
    } else {
      results.failed.push(check.name)
      console.log(`   ❌ ${check.name}`)
    }
  } catch (error) {
    console.log(`   ⚠️  Could not check: ${check.name}`)
  }
})

// Test 4: Dependencies
console.log('\n📚 Test 4: Dependency Analysis')
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const depCount = Object.keys(packageJson.dependencies || {}).length
  const devDepCount = Object.keys(packageJson.devDependencies || {}).length
  
  results.metrics.dependencies = depCount
  results.metrics.devDependencies = devDepCount
  
  console.log(`   Dependencies: ${depCount}`)
  console.log(`   Dev Dependencies: ${devDepCount}`)
  
  if (depCount < 50) {
    results.passed.push('Dependency count reasonable ✅')
    console.log(`   ✅ Dependency count is reasonable`)
  }
} catch (error) {
  console.log('   ⚠️  Could not analyze dependencies')
}

// Summary
console.log('\n' + '='.repeat(50))
console.log('📊 PERFORMANCE TEST SUMMARY')
console.log('='.repeat(50))
console.log(`\n✅ Passed: ${results.passed.length}`)
results.passed.forEach(p => console.log(`   ${p}`))
console.log(`\n❌ Failed: ${results.failed.length}`)
results.failed.forEach(f => console.log(`   ${f}`))

console.log('\n📈 Metrics:')
Object.entries(results.metrics).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`)
})

// Save results
const resultsPath = path.join(process.cwd(), 'performance-test-results.json')
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2))
console.log(`\n💾 Results saved to: performance-test-results.json`)

// Exit code
const exitCode = results.failed.length > 0 ? 1 : 0
process.exit(exitCode)

// Helper function
function getAllFiles(dir, ext) {
  const files = []
  const items = fs.readdirSync(dir)
  
  items.forEach(item => {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory() && !item.includes('node_modules')) {
      files.push(...getAllFiles(fullPath, ext))
    } else if (item.endsWith(ext)) {
      files.push(fullPath)
    }
  })
  
  return files
}
