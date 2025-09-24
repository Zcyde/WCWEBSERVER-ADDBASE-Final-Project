import { createApp } from 'vue'
import App from './App.vue'
import router from './routing/router.js' // Corrected path
import './assets/styles.css'

createApp(App).use(router).mount('#app')
