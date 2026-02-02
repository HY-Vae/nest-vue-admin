import './assets/base.css'
import './assets/main.scss'
import './assets/tailwind.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { setGlobalOptions } from 'vue-request'

import { initDirectives } from '@/directives'
import App from './App.vue'
import router from './router'
import './router/guard'

setGlobalOptions({
  manual: true,
})
const app = createApp(App)

initDirectives(app)

app.config.errorHandler = (err) => {
  console.log(err)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
