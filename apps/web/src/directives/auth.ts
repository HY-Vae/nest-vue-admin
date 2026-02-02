import { useUserStore } from '@/stores/modules/user.ts'
import type { AuthDirective } from '@/types/vue'

export default {
  // 帮我搞个自定义的指令
  mounted: (el, binding, vnode) => {
    const user = useUserStore()
    const auth = binding.value
    if (!auth) {
      throw new Error('请设置标签权限值')
    }
    if (!user.currentUser?.isSuper) {
      if (!user.currentUser?.permissions.includes(auth)) {
        el.parentNode?.removeChild(el)
      }
    }
  },
} satisfies AuthDirective
