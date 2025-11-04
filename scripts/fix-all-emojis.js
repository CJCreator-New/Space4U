import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function scanAndReplace(dir) {
  const items = readdirSync(dir)
  
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      scanAndReplace(fullPath)
    } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
      try {
        let content = readFileSync(fullPath, 'utf8')
        const original = content
        
        // Replace all broken emoji patterns
        content = content.replace(/ðŸ[^\s'"]+/g, '')
        
        if (content !== original) {
          writeFileSync(fullPath, content, 'utf8')
          console.log(`✅ Fixed: ${fullPath}`)
        }
      } catch (err) {
        // Skip
      }
    }
  }
}

scanAndReplace('./src')
console.log('\n✅ All broken emojis removed!')
