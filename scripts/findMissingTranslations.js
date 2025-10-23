#!/usr/bin/env node

/**
 * Find Missing Translations Script
 * Scans codebase for hardcoded strings and missing translation keys
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcDir = path.join(__dirname, '..', 'src')
const localesDir = path.join(srcDir, 'i18n', 'locales')

// Load English translations as base
const enTranslations = JSON.parse(
  fs.readFileSync(path.join(localesDir, 'en.json'), 'utf-8')
)

// Patterns to detect hardcoded strings
const patterns = {
  jsxText: /<[^>]+>([A-Z][a-zA-Z\s]+)<\/[^>]+>/g,
  stringLiterals: /['"]([A-Z][a-zA-Z\s]{3,})['"]/ g,
  placeholder: /placeholder=['"]([^'"]+)['"]/g,
  title: /title=['"]([^'"]+)['"]/g,
  ariaLabel: /aria-label=['"]([^'"]+)['"]/g
}

const suspiciousStrings = new Set()
const fileResults = {}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const relativePath = path.relative(srcDir, filePath)
  const findings = []

  // Skip if file already uses translations extensively
  if (content.includes('useTranslation') || content.includes('import { t }')) {
    return null
  }

  // Check for hardcoded strings
  Object.entries(patterns).forEach(([type, pattern]) => {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      const text = match[1]
      
      // Filter out common false positives
      if (
        text.length > 3 &&
        !text.includes('{{') &&
        !text.startsWith('http') &&
        !text.includes('@') &&
        !/^\d+$/.test(text) &&
        !text.includes('console.') &&
        !text.includes('localStorage')
      ) {
        findings.push({ type, text, line: getLineNumber(content, match.index) })
        suspiciousStrings.add(text)
      }
    }
  })

  if (findings.length > 0) {
    fileResults[relativePath] = findings
  }

  return findings.length
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        scanDirectory(filePath)
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      scanFile(filePath)
    }
  })
}

function generateReport() {
  console.log('\n🔍 Scanning for hardcoded strings...\n')
  
  scanDirectory(srcDir)

  const totalFiles = Object.keys(fileResults).length
  const totalStrings = suspiciousStrings.size

  console.log(`📊 Scan Results:`)
  console.log(`   Files with hardcoded strings: ${totalFiles}`)
  console.log(`   Unique suspicious strings: ${totalStrings}\n`)

  if (totalFiles > 0) {
    console.log('📁 Files needing translation:\n')
    
    Object.entries(fileResults)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 20)
      .forEach(([file, findings]) => {
        console.log(`   ${file} (${findings.length} strings)`)
      })

    if (totalFiles > 20) {
      console.log(`   ... and ${totalFiles - 20} more files\n`)
    }

    console.log('\n💡 Top 20 strings to translate:\n')
    Array.from(suspiciousStrings)
      .slice(0, 20)
      .forEach((str, i) => {
        console.log(`   ${i + 1}. "${str}"`)
      })

    if (totalStrings > 20) {
      console.log(`   ... and ${totalStrings - 20} more\n`)
    }
  } else {
    console.log('✅ No hardcoded strings detected!\n')
  }

  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'missing-translations-report.json')
  fs.writeFileSync(
    reportPath,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        filesScanned: totalFiles,
        uniqueStrings: totalStrings
      },
      files: fileResults,
      strings: Array.from(suspiciousStrings)
    }, null, 2)
  )

  console.log(`📄 Detailed report saved to: missing-translations-report.json\n`)
}

generateReport()
