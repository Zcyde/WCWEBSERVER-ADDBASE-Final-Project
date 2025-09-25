import { createApp } from 'vue'
import App from './App.vue'
import router from './routing/router.js'
import './assets/styles.css'
import VueTheMask from 'vue-the-mask'

const app = createApp(App)

app.use(router)
app.use(VueTheMask)

app.mount('#app')
