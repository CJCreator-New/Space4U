#!/usr/bin/env node

/**
 * Validate Translations Script
 * Checks translation completeness across all languages
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales')

const languages = ['en', 'es', 'fr', 'de', 'hi', 'ar', 'ta', 'te', 'bn', 'mr', 'kn', 'ml', 'gu']

function loadTranslations(lang) {
  const filePath = path.join(localesDir, `${lang}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function getAllKeys(obj, prefix = '') {
  let keys = []
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

function validateTranslations() {
  console.log('\n🌍 Validating translations across all languages...\n')

  const baseTranslations = loadTranslations('en')
  const baseKeys = getAllKeys(baseTranslations)

  console.log(`📚 Base language (English): ${baseKeys.length} keys\n`)

  const results = []

  languages.forEach(lang => {
    if (lang === 'en') return

    const translations = loadTranslations(lang)
    const langKeys = getAllKeys(translations)

    const missing = baseKeys.filter(key => !langKeys.includes(key))
    const extra = langKeys.filter(key => !baseKeys.includes(key))
    const completeness = ((baseKeys.length - missing.length) / baseKeys.length * 100).toFixed(2)

    results.push({
      lang,
      completeness: parseFloat(completeness),
      total: baseKeys.length,
      translated: baseKeys.length - missing.length,
      missing: missing.length,
      extra: extra.length,
      missingKeys: missing,
      extraKeys: extra
    })
  })

  // Sort by completeness
  results.sort((a, b) => b.completeness - a.completeness)

  console.log('📊 Translation Completeness:\n')
  console.log('Language  Completeness  Translated  Missing  Extra')
  console.log('--------  ------------  ----------  -------  -----')

  results.forEach(r => {
    const flag = {
      es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', hi: '🇮🇳', ar: '🇸🇦',
      ta: '🇮🇳', te: '🇮🇳', bn: '🇮🇳', mr: '🇮🇳', kn: '🇮🇳',
      ml: '🇮🇳', gu: '🇮🇳'
    }[r.lang] || '🌐'

    const status = r.completeness === 100 ? '✅' : r.completeness >= 80 ? '⚠️' : '❌'
    
    console.log(
      `${flag} ${r.lang.padEnd(6)}  ${status} ${r.completeness.toString().padStart(5)}%  ${r.translated.toString().padStart(10)}  ${r.missing.toString().padStart(7)}  ${r.extra.toString().padStart(5)}`
    )
  })

  console.log('\n')

  // Show details for incomplete translations
  const incomplete = results.filter(r => r.completeness < 100)
  
  if (incomplete.length > 0) {
    console.log('⚠️  Incomplete Translations:\n')
    
    incomplete.forEach(r => {
      console.log(`${r.lang.toUpperCase()} - Missing ${r.missing} keys:`)
      r.missingKeys.slice(0, 5).forEach(key => {
        console.log(`   - ${key}`)
      })
      if (r.missing > 5) {
        console.log(`   ... and ${r.missing - 5} more`)
      }
      console.log('')
    })
  } else {
    console.log('✅ All translations are complete!\n')
  }

  // Save report
  const reportPath = path.join(__dirname, '..', 'translation-validation-report.json')
  fs.writeFileSync(
    reportPath,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      baseLanguage: 'en',
      totalKeys: baseKeys.length,
      languages: results
    }, null, 2)
  )

  console.log(`📄 Detailed report saved to: translation-validation-report.json\n`)

  // Exit with error if any language is below 50%
  const critical = results.filter(r => r.completeness < 50)
  if (critical.length > 0) {
    console.error(`❌ Critical: ${critical.length} language(s) below 50% completeness\n`)
    process.exit(1)
  }
}

validateTranslations()
