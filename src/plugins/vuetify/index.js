import { deepMerge } from '@antfu/utils'
import { resolveVuetifyTheme } from '@core/utils/vuetify'
import { themeConfig } from '@themeConfig'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import defaults from './defaults'
import { icons } from './icons'
import { themes } from './theme'

// Styles
import { cookieRef } from '@/@layouts/stores/config'
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default function (app) {
  // Check if the current locale is RTL
  const currentLocale = localStorage.getItem('locale') || 'en'
  const isRTL = currentLocale === 'ar'
  
  const cookieThemeValues = {
    defaultTheme: resolveVuetifyTheme(themeConfig.app.theme),
    themes: {
      light: {
        colors: {
          primary: cookieRef('lightThemePrimaryColor', themes.light.colors.primary).value,
          'primary-darken-1': cookieRef('lightThemePrimaryDarkenColor', themes.light.colors['primary-darken-1']).value,
        },
      },
      dark: {
        colors: {
          primary: cookieRef('darkThemePrimaryColor', themes.dark.colors.primary).value,
          'primary-darken-1': cookieRef('darkThemePrimaryDarkenColor', themes.dark.colors['primary-darken-1']).value,
        },
      },
    },
  }

  const optionTheme = deepMerge({ themes }, cookieThemeValues)

  const vuetify = createVuetify({
    aliases: {
      IconBtn: VBtn,
    },
    defaults,
    icons,
    theme: optionTheme,
    rtl: isRTL, // Enable RTL support
  })

  app.use(vuetify)
  
  // Listen for language changes to update RTL
  window.addEventListener('languageChanged', (event) => {
    const { locale } = event.detail
    const shouldBeRTL = locale === 'ar'
    
    // Update Vuetify RTL setting
    if (vuetify.theme && vuetify.theme.global) {
      vuetify.theme.global.isRtl = shouldBeRTL
    }
  })
}
