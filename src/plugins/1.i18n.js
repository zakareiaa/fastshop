import { createI18n } from 'vue-i18n'

// Import translation files
import ar from '@/locales/ar.json'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

// Get saved locale from localStorage or default to 'en'
const savedLocale = localStorage.getItem('locale') || 'en'

// Create i18n instance
export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLocale, // Set locale from localStorage
  fallbackLocale: 'en', // Fallback to English if translation missing
  messages: {
    en,
    ar,
    fr
  },
  // Enable runtime compilation for better development experience
  runtimeOnly: false
})

// Function to set language attributes
const setDirection = (locale) => {
  // Set document direction to LTR for all languages
  document.documentElement.setAttribute('dir', 'ltr')
  document.documentElement.setAttribute('lang', locale)
  document.documentElement.classList.add('ltr')
  document.documentElement.classList.remove('rtl')
  document.body.classList.add('ltr')
  document.body.classList.remove('rtl')
}

// Function to change locale and save to localStorage
export const setLocale = (locale) => {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  
  setDirection(locale)
  
  // Dispatch a custom event to notify components of language change
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { locale } }))
}

// Initialize direction immediately
setDirection(savedLocale)

// Also set direction when DOM is ready (for page refresh scenarios)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setDirection(savedLocale)
  })
} else {
  // DOM is already ready
  setDirection(savedLocale)
}

// Export default function for plugin registration
export default function (app) {
  app.use(i18n)
}
