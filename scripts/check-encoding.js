import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const checkEncoding = (dir, extensions = ['.js', '.jsx', '.json', '.html', '.css']) => {
  const issues = []
  
  const scan = (path) => {
    const items = readdirSync(path)
    
    for (const item of items) {
      const fullPath = join(path, item)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath)
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        try {
          const content = readFileSync(fullPath, 'utf8')
          // Check for common encoding issues
          if (content.includes('â€¢') || content.includes('â€™') || content.includes('â€"')) {
            issues.push({ file: fullPath, issue: 'Contains mojibake characters' })
          }
        } catch (err) {
          issues.push({ file: fullPath, issue: `Read error: ${err.message}` })
        }
      }
    }
  }
  
  scan(dir)
  return issues
}

const issues = checkEncoding('./src')
if (issues.length > 0) {
  console.log('⚠️  Encoding issues found:')
  issues.forEach(({ file, issue }) => console.log(`  ${file}: ${issue}`))
  process.exit(1)
} else {
  console.log('✅ No encoding issues detected')
}
