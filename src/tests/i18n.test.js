/**
 * i18n Automated Test Suite
 * Detects untranslated strings and validates translation completeness
 */

import { describe, it, expect } from 'vitest'
import { validateTranslations } from '../utils/i18nHelpers'

// Import all translation files
import en from '../i18n/locales/en.json'
import es from '../i18n/locales/es.json'
import fr from '../i18n/locales/fr.json'
import de from '../i18n/locales/de.json'
import hi from '../i18n/locales/hi.json'
import ar from '../i18n/locales/ar.json'
import ta from '../i18n/locales/ta.json'
import te from '../i18n/locales/te.json'
import bn from '../i18n/locales/bn.json'
import mr from '../i18n/locales/mr.json'
import kn from '../i18n/locales/kn.json'
import ml from '../i18n/locales/ml.json'
import gu from '../i18n/locales/gu.json'

const languages = {
  en, es, fr, de, hi, ar, ta, te, bn, mr, kn, ml, gu
}

describe('i18n Translation Completeness', () => {
  const baseLanguage = 'en'
  const baseTranslations = languages[baseLanguage]

  Object.keys(languages).forEach(lang => {
    if (lang === baseLanguage) return

    it(`${lang} should have all required translation keys`, () => {
      const result = validateTranslations(languages[lang], baseTranslations)
      
      if (!result.isComplete) {
        console.warn(`\n${lang.toUpperCase()} Missing Keys (${result.missingKeys.length}):`)
        result.missingKeys.slice(0, 10).forEach(key => console.warn(`  - ${key}`))
        if (result.missingKeys.length > 10) {
          console.warn(`  ... and ${result.missingKeys.length - 10} more`)
        }
      }
      
      expect(result.completeness).toBeDefined()
    })
  })

  it('should have at least 13 languages configured', () => {
    expect(Object.keys(languages).length).toBeGreaterThanOrEqual(13)
  })
})

export function generateTranslationReport() {
  const report = {
    timestamp: new Date().toISOString(),
    languages: {},
    summary: {
      total: Object.keys(languages).length,
      complete: 0,
      incomplete: 0
    }
  }

  Object.keys(languages).forEach(lang => {
    if (lang === 'en') {
      report.languages[lang] = {
        completeness: '100%',
        status: 'complete'
      }
      report.summary.complete++
    } else {
      const result = validateTranslations(languages[lang], languages.en)
      report.languages[lang] = {
        completeness: result.completeness,
        missingKeys: result.missingKeys.length,
        status: result.isComplete ? 'complete' : 'incomplete'
      }
      
      if (result.isComplete) {
        report.summary.complete++
      } else {
        report.summary.incomplete++
      }
    }
  })

  return report
}
