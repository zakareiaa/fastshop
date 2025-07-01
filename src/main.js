import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

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

// Mount vue app
app.mount('#app')
