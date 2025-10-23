/**
 * i18n Helper Utilities
 * Provides fallback logic, missing key detection, and translation helpers
 */

// Track missing translations for reporting
const missingTranslations = new Set()

/**
 * Safe translation with fallback
 * @param {Function} t - i18next translation function
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text if translation missing
 * @param {object} options - i18next options
 * @returns {string} Translated text or fallback
 */
export function safeTranslate(t, key, fallback = '', options = {}) {
  try {
    const translated = t(key, { ...options, defaultValue: fallback })
    
    // Detect if translation is missing (returns key itself)
    if (translated === key && !fallback) {
      missingTranslations.add(key)
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${key}`)
      }
    }
    
    return translated || fallback
  } catch (error) {
    console.error(`Translation error for key: ${key}`, error)
    return fallback
  }
}

/**
 * Get all missing translations
 * @returns {Array} Array of missing translation keys
 */
export function getMissingTranslations() {
  return Array.from(missingTranslations)
}

/**
 * Clear missing translations tracker
 */
export function clearMissingTranslations() {
  missingTranslations.clear()
}

/**
 * Export missing translations report
 * @returns {string} JSON string of missing translations
 */
export function exportMissingTranslationsReport() {
  const report = {
    timestamp: new Date().toISOString(),
    count: missingTranslations.size,
    keys: Array.from(missingTranslations).sort()
  }
  return JSON.stringify(report, null, 2)
}

/**
 * Download missing translations report
 */
export function downloadMissingTranslationsReport() {
  const report = exportMissingTranslationsReport()
  const blob = new Blob([report], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `missing-translations-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Pluralization helper
 * @param {Function} t - i18next translation function
 * @param {string} key - Translation key
 * @param {number} count - Count for pluralization
 * @returns {string} Pluralized translation
 */
export function pluralize(t, key, count) {
  return t(key, { count })
}

/**
 * Date formatting with locale
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale code
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export function formatDate(date, locale = 'en', options = {}) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj)
}

/**
 * Number formatting with locale
 * @param {number} number - Number to format
 * @param {string} locale - Locale code
 * @param {object} options - Intl.NumberFormat options
 * @returns {string} Formatted number
 */
export function formatNumber(number, locale = 'en', options = {}) {
  return new Intl.NumberFormat(locale, options).format(number)
}

/**
 * Currency formatting with locale
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (USD, EUR, INR, etc.)
 * @param {string} locale - Locale code
 * @returns {string} Formatted currency
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * RTL language detection
 * @param {string} locale - Locale code
 * @returns {boolean} True if RTL language
 */
export function isRTL(locale) {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  return rtlLanguages.includes(locale.split('-')[0])
}

/**
 * Set document direction based on locale
 * @param {string} locale - Locale code
 */
export function setDocumentDirection(locale) {
  document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr'
  document.documentElement.lang = locale
}

/**
 * Get browser language
 * @returns {string} Browser language code
 */
export function getBrowserLanguage() {
  return navigator.language || navigator.userLanguage || 'en'
}

/**
 * Get supported language from browser language
 * @param {Array} supportedLanguages - Array of supported language codes
 * @returns {string} Matched language code or 'en'
 */
export function getMatchedLanguage(supportedLanguages = []) {
  const browserLang = getBrowserLanguage().split('-')[0]
  return supportedLanguages.includes(browserLang) ? browserLang : 'en'
}

/**
 * Interpolate variables in translation
 * @param {string} text - Text with {{variable}} placeholders
 * @param {object} variables - Variables to interpolate
 * @returns {string} Interpolated text
 */
export function interpolate(text, variables = {}) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match
  })
}

/**
 * Create translation namespace helper
 * @param {Function} t - i18next translation function
 * @param {string} namespace - Namespace prefix
 * @returns {Function} Namespaced translation function
 */
export function createNamespacedT(t, namespace) {
  return (key, options) => t(`${namespace}.${key}`, options)
}

/**
 * Validate translation completeness
 * @param {object} translations - Translation object
 * @param {object} baseTranslations - Base translation object (usually English)
 * @returns {object} Validation result with missing keys
 */
export function validateTranslations(translations, baseTranslations) {
  const missing = []
  const extra = []
  
  function checkKeys(base, trans, path = '') {
    for (const key in base) {
      const currentPath = path ? `${path}.${key}` : key
      
      if (!(key in trans)) {
        missing.push(currentPath)
      } else if (typeof base[key] === 'object' && base[key] !== null) {
        checkKeys(base[key], trans[key] || {}, currentPath)
      }
    }
    
    for (const key in trans) {
      const currentPath = path ? `${path}.${key}` : key
      if (!(key in base)) {
        extra.push(currentPath)
      }
    }
  }
  
  checkKeys(baseTranslations, translations)
  
  return {
    isComplete: missing.length === 0,
    missingKeys: missing,
    extraKeys: extra,
    completeness: ((Object.keys(baseTranslations).length - missing.length) / Object.keys(baseTranslations).length * 100).toFixed(2) + '%'
  }
}

export default {
  safeTranslate,
  getMissingTranslations,
  clearMissingTranslations,
  exportMissingTranslationsReport,
  downloadMissingTranslationsReport,
  pluralize,
  formatDate,
  formatNumber,
  formatCurrency,
  isRTL,
  setDocumentDirection,
  getBrowserLanguage,
  getMatchedLanguage,
  interpolate,
  createNamespacedT,
  validateTranslations
}
