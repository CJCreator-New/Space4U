import { readFileSync, writeFileSync } from 'fs'

const files = [
  'src/data/mockResources.js',
  'src/i18n/locales/en.json',
  'src/pages/ResourceDetailPage.jsx'
]

files.forEach(file => {
  try {
    let content = readFileSync(file, 'utf8')
    
    // Remove all problematic patterns
    content = content.replace(/Â/g, ' ')
    content = content.replace(/â€¢/g, '•')
    content = content.replace(/â€™/g, "'")
    content = content.replace(/â€"/g, '–')
    content = content.replace(/â€œ/g, '"')
    content = content.replace(/â€/g, '"')
    content = content.replace(/â€¦/g, '...')
    content = content.replace(/âœ"/g, '✓')
    content = content.replace(/ðŸ[^\s'"]+/g, '')
    
    writeFileSync(file, content, 'utf8')
    console.log(`✅ Fixed: ${file}`)
  } catch (err) {
    console.log(`❌ Error: ${file} - ${err.message}`)
  }
})

console.log('\n✅ All symbols fixed!')
