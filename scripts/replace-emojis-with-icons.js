import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const emojiToIcon = {
  'ðŸ"Š': 'BarChart',
  'ðŸ†': 'Trophy',
  'ðŸ'¬': 'MessageCircle',
  'ðŸ"ˆ': 'TrendingUp',
  'ðŸŽ¯': 'Target',
  'ðŸ'ª': 'Zap',
  'ðŸ§˜': 'User',
  'ðŸ"š': 'Book',
  'ðŸ'§': 'Droplet',
  'ðŸƒ': 'Activity',
  'ðŸŽ¨': 'Palette',
  'ðŸŽµ': 'Music'
}

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
        let modified = false
        
        for (const [emoji, icon] of Object.entries(emojiToIcon)) {
          if (content.includes(emoji)) {
            content = content.replace(new RegExp(emoji, 'g'), icon)
            modified = true
          }
        }
        
        if (modified) {
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
console.log('\n✅ Emoji replacement complete!')
