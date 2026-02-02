import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css'
import { initDebugLogging } from './debug'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Инициализируем отладку
initDebugLogging()
