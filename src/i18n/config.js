import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import hi from './locales/hi.json'
import ar from './locales/ar.json'
import ta from './locales/ta.json'
import te from './locales/te.json'
import bn from './locales/bn.json'
import mr from './locales/mr.json'
import kn from './locales/kn.json'
import ml from './locales/ml.json'
import gu from './locales/gu.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      hi: { translation: hi },
      ar: { translation: ar },
      ta: { translation: ta },
      te: { translation: te },
      bn: { translation: bn },
      mr: { translation: mr },
      kn: { translation: kn },
      ml: { translation: ml },
      gu: { translation: gu }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'safespace_language'
    }
  })

export default i18n
