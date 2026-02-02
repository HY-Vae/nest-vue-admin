import type { Directive } from 'vue'

export type AuthDirective = Directive<HTMLElement, string>

declare module 'vue' {
  export interface ComponentCustomProperties {
    // 使用 v 作为前缀 (v-auth)
    auth: AuthDirective
  }
}
