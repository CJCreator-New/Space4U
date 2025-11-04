import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const problematicPatterns = [
  /â€¢/g,  // bullet
  /â€™/g,  // apostrophe
  /â€"/g,  // dash
  /â€œ/g,  // left quote
  /â€/g,   // right quote
  /â€¦/g,  // ellipsis
  /Â/g,    // non-breaking space
  /âœ"/g,  // checkmark
  /ðŸ/g,   // emoji prefix
]

function scanFiles(dir, results = []) {
  const items = readdirSync(dir)
  
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      scanFiles(fullPath, results)
    } else if (item.endsWith('.jsx') || item.endsWith('.js') || item.endsWith('.json')) {
      try {
        const content = readFileSync(fullPath, 'utf8')
        const issues = []
        
        for (const pattern of problematicPatterns) {
          const matches = content.match(pattern)
          if (matches) {
            issues.push(`${pattern.source}: ${matches.length} occurrences`)
          }
        }
        
        if (issues.length > 0) {
          results.push({ file: fullPath, issues })
        }
      } catch (err) {
        // Skip
      }
    }
  }
  
  return results
}

const results = scanFiles('./src')

if (results.length > 0) {
  console.log('🔍 Files with encoding symbols:\n')
  results.forEach(({ file, issues }) => {
    console.log(`📄 ${file}`)
    issues.forEach(issue => console.log(`   ${issue}`))
    console.log()
  })
} else {
  console.log('✅ No encoding symbols found')
}
