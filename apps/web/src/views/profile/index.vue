<script setup lang="ts">
import { useDict } from '@/hooks/dict.hook'
import { useUserStore } from '@/stores/modules/user'
import type { SelectOptionItem } from '@/types/global'
import { updatePasswordApi, updateProfileApi } from '@/views/sys/user/service'
import { CircleCheckFilled, CircleClose, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'

const { getDictOptions } = useDict()
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

// 获取 token
const token = localStorage.getItem('token')
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${token}`,
}))

const profileLoading = ref(false)
const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const activeTab = ref('basic')
const showPasswordDialog = ref(false)
const uploadLoading = ref(false)

const sexOptions = ref<SelectOptionItem[]>([])
getDictOptions('sexStatus').then((res) => {
  sexOptions.value = res
})

// 个人信息表单
const profileForm = reactive({
  nickName: '',
  email: '',
  phone: '',
  sex: '',
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 表单验证规则
const profileRules: FormRules = {
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }],
}

const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'change' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
      message: '密码必须包含字母和数字',
      trigger: 'change',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 密码强度检测
const passwordChecks = computed(() => {
  const pwd = passwordForm.newPassword
  return [
    { label: '至少6个字符', passed: pwd.length >= 6 },
    { label: '包含字母', passed: /[A-Za-z]/.test(pwd) },
    { label: '包含数字', passed: /\d/.test(pwd) },
    { label: '包含特殊字符', passed: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd) },
  ]
})

const passwordStrength = computed(() => {
  const passedCount = passwordChecks.value.filter((c) => c.passed).length
  if (passedCount <= 1) return { level: 0, text: '弱', color: '#F56C6C' }
  if (passedCount === 2) return { level: 1, text: '较弱', color: '#E6A23C' }
  if (passedCount === 3) return { level: 2, text: '中等', color: '#409EFF' }
  return { level: 3, text: '强', color: '#67C23A' }
})

// 弹窗关闭时重置密码表单
watch(showPasswordDialog, (val) => {
  if (!val) {
    passwordFormRef.value?.resetFields()
  }
})

// 获取个人信息
const fetchProfile = async () => {
  profileLoading.value = true
  try {
    const user = currentUser.value
    if (user) {
      Object.assign(profileForm, {
        nickName: user.nickName || '',
        email: user.email || '',
        phone: user.phone || '',
        sex: user.sex || '',
      })
    }
  } catch (error) {
    console.error('获取个人信息失败:', error)
    ElMessage.error('获取个人信息失败')
  } finally {
    profileLoading.value = false
  }
}

// 保存个人信息
const profileSaving = ref(false)
const handleSaveProfile = async () => {
  const valid = await profileFormRef.value?.validate().catch(() => false)
  if (!valid) return

  profileSaving.value = true
  try {
    const data = { ...profileForm }
    await updateProfileApi(data)

    if (currentUser.value) {
      Object.assign(currentUser.value, data)
    }

    ElMessage.success('保存成功')
  } finally {
    profileSaving.value = false
  }
}

// 修改密码
const passwordSaving = ref(false)
const handleChangePassword = async () => {
  const valid = await passwordFormRef.value?.validate().catch(() => false)
  if (!valid) return

  passwordSaving.value = true
  try {
    await updatePasswordApi({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })

    ElMessage.success('密码修改成功')
    showPasswordDialog.value = false
  } finally {
    passwordSaving.value = false
  }
}

// 头像上传
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isImage = rawFile.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  const isLt2M = rawFile.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  uploadLoading.value = true
  return true
}

interface UploadResponse {
  code: number
  message: string
  data: {
    url: string
  }
}

const handleAvatarSuccess: UploadProps['onSuccess'] = async (response: UploadResponse) => {
  if (response.code === 200) {
    try {
      // 上传成功后直接保存到数据库
      await updateProfileApi({ avatar: response.data.url })
      // 更新 userStore
      if (currentUser.value) {
        currentUser.value.avatar = response.data.url
      }
      ElMessage.success('头像更新成功')
    } catch {
      ElMessage.error('头像保存失败')
    }
  } else {
    ElMessage.error(response.message || '上传失败')
  }
  uploadLoading.value = false
}

const handleAvatarError = () => {
  uploadLoading.value = false
  ElMessage.error('头像上传失败')
}

// 获取用户状态文本
const getStatusText = (status: string) => {
  return status === '0' ? '正常' : '禁用'
}

// 初始化
fetchProfile()
</script>

<template>
  <div class="page-container profile-container" v-loading="profileLoading">
    <el-row :gutter="20">
      <!-- 左侧：个人信息卡片 -->
      <el-col :span="8">
        <el-card shadow="never" class="profile-card">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>

          <div class="user-profile">
            <div class="avatar-section">
              <el-upload
                class="avatar-uploader"
                action="/api/upload/file"
                :headers="uploadHeaders"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
              >
                <div class="avatar-wrapper">
                  <img v-if="currentUser?.avatar" :src="currentUser.avatar" class="avatar" />
                  <el-icon
                    v-else
                    class="avatar-uploader-icon"
                    :class="{ 'is-loading': uploadLoading }"
                  >
                    <Plus v-if="!uploadLoading" />
                    <span v-else class="loading-spinner"></span>
                  </el-icon>
                  <div class="avatar-overlay">
                    <el-icon><Plus /></el-icon>
                    <span>更换头像</span>
                  </div>
                </div>
              </el-upload>
              <div class="avatar-tip">支持 jpg、png 格式，不超过 2MB</div>
            </div>

            <div class="user-info-list">
              <div class="info-item">
                <span class="label">用户名</span>
                <span class="value">
                  {{ currentUser?.userName || '-' }}
                  <el-tag v-if="currentUser?.isSuper" type="danger" size="small" class="ml-2"
                    >超级管理员</el-tag
                  >
                </span>
              </div>
              <div class="info-item">
                <span class="label">昵称</span>
                <span class="value">{{ currentUser?.nickName || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">部门</span>
                <span class="value">{{ currentUser?.dept?.deptName || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">岗位</span>
                <span class="value">
                  {{ currentUser?.post?.name || '-' }}
                  <el-tag
                    v-if="currentUser?.post?.isLeader"
                    type="warning"
                    size="small"
                    class="ml-2"
                    >负责人</el-tag
                  >
                </span>
              </div>
              <div class="info-item">
                <span class="label">邮箱</span>
                <span class="value">{{ currentUser?.email || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">手机号</span>
                <span class="value">{{ currentUser?.phone || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">状态</span>
                <span class="value">
                  <el-tag :type="currentUser?.status === '0' ? 'success' : 'danger'" size="small">
                    {{ getStatusText(currentUser?.status || '0') }}
                  </el-tag>
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：功能 Tab -->
      <el-col :span="16">
        <el-card shadow="never" class="profile-card">
          <el-tabs v-model="activeTab" class="profile-tabs">
            <el-tab-pane label="基本资料" name="basic">
              <el-form
                ref="profileFormRef"
                :model="profileForm"
                :rules="profileRules"
                label-width="80px"
                class="profile-form"
              >
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="profileForm.nickName" placeholder="请输入昵称" clearable />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="profileForm.sex">
                    <el-radio v-for="item in sexOptions" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="profileForm.email" placeholder="请输入邮箱" clearable />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="profileForm.phone" placeholder="请输入手机号" clearable />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="profileSaving" @click="handleSaveProfile">
                    保存修改
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="安全设置" name="security">
              <div class="security-section">
                <div class="security-item">
                  <div class="security-info">
                    <h4>账户密码</h4>
                    <p>定期更换密码可以提高账户安全性</p>
                  </div>
                  <el-button type="primary" plain @click="showPasswordDialog = true">
                    修改密码
                  </el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="80px"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入旧密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-popover
            :visible="!!passwordForm.newPassword"
            placement="right"
            :width="240"
            :show-arrow="true"
            :offset="8"
          >
            <template #reference>
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="6-20位，需包含字母和数字"
                show-password
              />
            </template>
            <div class="password-strength">
              <div class="strength-bar">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="strength-segment"
                  :style="{ backgroundColor: i <= passwordStrength.level + 1 ? passwordStrength.color : '' }"
                />
              </div>
              <span class="strength-text" :style="{ color: passwordStrength.color }">
                {{ passwordStrength.text }}
              </span>
            </div>
            <div class="password-checks">
              <div
                v-for="item in passwordChecks"
                :key="item.label"
                class="check-item"
                :class="{ passed: item.passed }"
              >
                <el-icon :size="14">
                  <component :is="item.passed ? 'CircleCheckFilled' : 'CircleClose'" />
                </el-icon>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" :loading="passwordSaving" @click="handleChangePassword">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.profile-container {
  .profile-card {
    :deep(.el-card__header) {
      padding: 16px 20px;
    }

    .card-header {
      font-weight: 500;
      font-size: 16px;
    }
  }

  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;

    .avatar-section {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .avatar-uploader {
      :deep(.el-upload) {
        border: 3px solid var(--el-border-color-lighter);
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        transition: var(--el-transition-duration-fast);
        background: var(--el-fill-color-light);

        &:hover {
          .avatar-overlay {
            opacity: 1;
          }
        }
      }
    }

    .avatar-wrapper {
      position: relative;
      width: 100px;
      height: 100px;
      overflow: hidden;

      .avatar {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        border-radius: 50%;
      }

      .avatar-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s;
        color: #fff;
        font-size: 12px;

        .el-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--el-fill-color-light);
      border-radius: 50%;
    }

    .avatar-tip {
      margin-top: 8px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid var(--el-color-primary);
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  }

  .user-info-list {
    width: 100%;

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }

      .label {
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }

      .value {
        color: var(--el-text-color-primary);
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
      }
    }
  }

  .ml-2 {
    margin-left: 8px;
  }

  .profile-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 16px;
    }

    :deep(.el-tabs__item) {
      font-size: 14px;
    }
  }

  .profile-form {
    padding: 16px 0;
    max-width: 400px;
  }

  .security-section {
    .security-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px;
      background: var(--el-fill-color-light);
      border-radius: 8px;

      .security-info {
        h4 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 500;
        }

        p {
          margin: 0;
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 8px;

  .strength-bar {
    display: flex;
    gap: 4px;
    flex: 1;

    .strength-segment {
      height: 4px;
      flex: 1;
      border-radius: 2px;
      background-color: var(--el-border-color-light);
      transition: background-color 0.3s;
    }
  }

  .strength-text {
    font-size: 12px;
    min-width: 28px;
    text-align: right;
  }
}

.password-checks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 16px;
  margin-top: 10px;

  .check-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    transition: color 0.3s;

    &.passed {
      color: var(--el-color-success);
    }
  }
}
</style>
