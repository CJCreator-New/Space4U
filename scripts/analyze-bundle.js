#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes the production bundle and provides optimization recommendations
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🔍 Analyzing bundle...\n')

// Build with analysis
try {
  console.log('📦 Building production bundle...')
  execSync('npm run build', { stdio: 'inherit' })
  
  console.log('\n✅ Build complete!')
  console.log('\n📊 Bundle analysis saved to: dist/stats.html')
  console.log('   Open this file in your browser to visualize the bundle\n')
  
  // Read dist folder and show sizes
  const distPath = path.join(process.cwd(), 'dist', 'assets')
  
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath)
    const jsFiles = files.filter(f => f.endsWith('.js'))
    const cssFiles = files.filter(f => f.endsWith('.css'))
    
    console.log('📁 Bundle Contents:')
    console.log('   JavaScript files:', jsFiles.length)
    console.log('   CSS files:', cssFiles.length)
    
    let totalSize = 0
    jsFiles.forEach(file => {
      const stats = fs.statSync(path.join(distPath, file))
      totalSize += stats.size
    })
    
    console.log(`   Total JS size: ${(totalSize / 1024).toFixed(2)} KB`)
    console.log(`   Estimated gzipped: ${(totalSize / 1024 / 3).toFixed(2)} KB\n`)
    
    // Recommendations
    console.log('💡 Optimization Recommendations:')
    if (totalSize > 500 * 1024) {
      console.log('   ⚠️  Bundle size > 500KB - Consider more code splitting')
    } else {
      console.log('   ✅ Bundle size is optimal')
    }
    
    if (jsFiles.length > 20) {
      console.log('   ⚠️  Many JS chunks - Consider consolidating')
    } else {
      console.log('   ✅ Chunk count is reasonable')
    }
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}
