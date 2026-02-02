import auth from '@/directives/auth.ts'
import type { App } from 'vue'

export function initDirectives(app: App<Element>) {
  app.directive('auth', auth)
}
