import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

// AOS - Animate On Scroll
import AOS from 'aos'
import 'aos/dist/aos.css'

// Styles
// import '@/assets/styles/rtl.css'
import '@core/scss/template/index.scss'
import '@styles/components.css'
import '@styles/header.css'
import '@styles/styles.css'

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-out-quart',
  once: true,
  offset: 50,
  delay: 100,
})

// Mount vue app
app.mount('#app')
