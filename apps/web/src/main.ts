import './assets/base.css'
import './assets/main.scss'
import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setGlobalOptions } from 'vue-request'

import App from './App.vue'
import router from './router'
import './router/guard'
import { initDirectives } from '@/directives'

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
