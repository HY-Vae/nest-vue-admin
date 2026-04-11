import './assets/base.css'
import './assets/main.scss'
import './assets/tailwind.css'
import './assets/theme.scss'
// import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
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

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.mount('#app')
