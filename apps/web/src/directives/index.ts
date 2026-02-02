import type { App } from 'vue'
import auth from '@/directives/auth.ts'

export function initDirectives(app: App<Element>) {
  app.directive('auth', auth)
}
