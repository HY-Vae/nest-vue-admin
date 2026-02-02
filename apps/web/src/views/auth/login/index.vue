<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { debounce } from 'lodash-es'
import { getCaptchaApi, loginApi } from '@/api/auth.ts'
import router from '@/router'
import { useRoute } from 'vue-router'

const ruleFormRef = ref<FormInstance>()

const route = useRoute()

const loginForm = reactive({
  userName: '',
  password: '',
  captcha: '',
})

const rules = reactive<FormRules<typeof loginForm>>({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        const res = await loginApi({
          ...loginForm,
          captchaId: captchaInfo.value.id,
        })
        localStorage.setItem('token', res.data.token)
        ElMessage.success('登录成功')
        if (!res.data.home) {
          ElMessage.error('当前用户没有配置菜单权限，请联系管理员')
        }
        debugger
        const redirect = route.query.redirect
        if (redirect) {
          router.push(redirect as string)
          return
        }
        router.push(res.data.home)
      } catch (e) {
        refreshCaptcha()
      }
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const captchaInfo = ref({
  id: '',
  img: '',
})

const getCaptcha = async () => {
  const res = await getCaptchaApi(captchaInfo.value.id)
  captchaInfo.value = res.data
}

const refreshCaptcha = debounce(() => {
  captchaInfo.value.id = ''
  captchaInfo.value.img = ''
  getCaptcha()
}, 300)
getCaptcha()
</script>

<template>
  <div class="flex flex-col h-full items-center justify-center">
    <h2
      class="text-3xl font-bold text-gray-700 mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-l"
    >
      Nest-Vue-Admin(NVA)
    </h2>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="loginForm"
      :rules="rules"
      size="large"
      label-width="auto"
      class="login-form"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="loginForm.userName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <div class="captcha-container">
          <el-input v-model="loginForm.captcha" />
          <div class="captcha" @click="refreshCaptcha">
            <div v-html="captchaInfo.img"></div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="w-full" @click="submitForm(ruleFormRef)"> 登录 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.captcha-container {
  display: flex;
  align-items: center;
}
.captcha {
  width: 200px;
  height: 40px;
  margin-left: 6px;
}
</style>
