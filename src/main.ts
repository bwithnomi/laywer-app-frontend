import { createApp } from 'vue'
import pinia from '@/pinia'
import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Quasar, {
  plugins: {
    Notify,
  }, // import Quasar plugins and add here
})
app.mount('#app')
