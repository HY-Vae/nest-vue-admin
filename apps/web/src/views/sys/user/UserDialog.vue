<script setup lang="ts">
import { getRoleOptionsApi } from '@/views/sys/role/service.ts'
import { getDeptOptionsApi } from '@/views/sys/dept/service.ts'
import { getSysPostOptionsApi } from '@/views/sys/post/service.ts'
import { ActionEnum } from '@/enums/common.ts'
import { useDict } from '@/hooks/dict.hook.ts'
import { useUserStore } from '@/stores/modules/user.ts'
import type { SelectOptionItem, SelectTreeItem } from '@/types/global.ts'
import type { CreateUserType, UserDetailType } from '@/views/sys/user/user.type'
import type { FormInstance, UploadInstance, UploadProps } from 'element-plus'
import { UPLOAD_API } from '@/constants/constant.ts'
import { Plus, CircleClose } from '@element-plus/icons-vue'
import { computed, ref, watch, type PropType } from 'vue'
import { deleteFileUploadByUrlApi } from '@/views/upload/file/service'
import { useRequest } from 'vue-request'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

const props = defineProps({
  action: {
    type: String as PropType<ActionEnum>,
    default: ActionEnum.Add,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  detailLoading: {
    type: Boolean,
    default: false,
  },
  current: {
    required: false,
    type: Object as PropType<UserDetailType>,
  },
})
const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const userFormRef = ref<FormInstance>()

const { getDictOptions } = useDict()

const enableStatusOptions = ref<SelectOptionItem[]>([])

const formLabelWidth = '100px'
const formSpan = ref({
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
})
const userForm = ref<CreateUserType>({
  avatar: '',
  email: '',
  nickName: '',
  phone: '',
  remark: '',
  roleIds: [],
  sex: '',
  status: '0',
  userName: '',
  userType: '',
  deptId: null,
  postId: null,
})

// 待删除的头像URL列表
const pendingDeleteAvatars = ref<string[]>([])

const rules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  email: { message: '请输入正确的邮箱地址', trigger: 'change' },
  status: [{ required: true, message: '请选择用户状态', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择用户性别', trigger: 'blur' }],
  remark: [{ max: 255, message: '长度不能超过255个字符', trigger: 'change' }],
}
const cancel = () => {
  // 取消时清空待删除列表
  pendingDeleteAvatars.value = []
  visible.value = false
  emits('cancel')
}

// 删除文件的请求
const { runAsync: runDeleteFile } = useRequest(
  (url: string) => deleteFileUploadByUrlApi(url),
  { manual: true }
)

const confirm = () => {
  userFormRef.value?.validate(async (valid) => {
    if (valid) {
      // 处理待删除的头像
      if (pendingDeleteAvatars.value.length > 0) {
        for (const url of pendingDeleteAvatars.value) {
          try {
            await runDeleteFile(url)
          } catch (e) {
            console.error('删除头像失败:', e)
          }
        }
        pendingDeleteAvatars.value = []
      }
      emits('confirm', userForm.value)
    }
  })
}

const closeDialog = () => {
  userFormRef.value?.resetFields()
  userForm.value = {
    avatar: '',
    email: '',
    nickName: '',
    phone: '',
    remark: '',
    roleIds: [],
    sex: '',
    status: '0',
    userName: '',
    userType: '',
    deptId: null,
    postId: null,
  }
  pendingDeleteAvatars.value = []
}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加用户' : '编辑用户'
})
const roleOptions = ref<SelectOptionItem[]>([])
const deptOptions = ref<SelectTreeItem[]>([])
const postOptions = ref<SelectOptionItem[]>([])
const sexStatusOptions = ref<SelectOptionItem[]>([])

// 非超管用户需要过滤超管角色
const roleOptionsVisible = computed(() => {
  if (currentUser.value?.isSuper) return roleOptions.value
  return roleOptions.value.map((item: any) => ({
    ...item,
    disabled: item.isSuper === true,
  }))
})

// 加载岗位选项（根据部门ID过滤）
const loadPostOptions = (deptId?: string | null) => {
  getSysPostOptionsApi(deptId || undefined).then((res) => {
    postOptions.value = res.data
  })
}

const openUser = () => {
  getRoleOptionsApi().then((res) => {
    roleOptions.value = res.data
  })
  getDeptOptionsApi().then((res) => {
    deptOptions.value = res.data
  })
  getDictOptions('enableStatus').then((res) => {
    enableStatusOptions.value = res
  })

  getDictOptions('sexStatus').then((res) => {
    sexStatusOptions.value = res
  })
  // 加载岗位选项
  loadPostOptions(userForm.value.deptId)
}

// 部门切换时清空岗位并重新加载
const handleDeptChange = (deptId: string | null) => {
  userForm.value.postId = null
  loadPostOptions(deptId)
}

// 岗位切换时自动合并该岗位的默认角色
const handlePostChange = (postId: string | null) => {
  if (!postId) return
  const selectedPost = (postOptions.value as any[]).find((item) => item.value === postId)
  if (selectedPost?.roleIds?.length) {
    // 合并岗位默认角色到已有角色（去重）
    const existingRoleIds = new Set(userForm.value.roleIds || [])
    for (const rid of selectedPost.roleIds) {
      existingRoleIds.add(rid)
    }
    userForm.value.roleIds = [...existingRoleIds]
  }
}

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      userForm.value = val as CreateUserType
      // 编辑模式下，加载对应部门的岗位选项
      loadPostOptions(val.deptId)
    }
  },
)

// 头像上传相关
const uploadRef = ref<UploadInstance>()
const uploadLoading = ref(false)

const headers = computed(() => {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
})

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

const handleAvatarSuccess: UploadProps['onSuccess'] = (response: UploadResponse) => {
  uploadLoading.value = false
  if (response.code === 200) {
    // 如果有旧头像，加入待删除列表
    if (userForm.value.avatar) {
      pendingDeleteAvatars.value.push(userForm.value.avatar)
    }
    // 保存新的头像URL
    userForm.value.avatar = response.data.url
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const handleAvatarError = () => {
  uploadLoading.value = false
  ElMessage.error('头像上传失败')
}

// 删除头像
const handleRemoveAvatar = () => {
  // 如果有头像，加入待删除列表
  if (userForm.value.avatar) {
    pendingDeleteAvatars.value.push(userForm.value.avatar)
  }
  userForm.value.avatar = ''
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    @open="openUser"
    class="rsp-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="closeDialog"
  >
    <el-form
      :model="userForm"
      ref="userFormRef"
      label-position="top"
      v-loading="detailLoading"
      :rules="rules"
    >
      <el-row :gutter="12">
        <!-- 头像上传 -->
        <el-col :span="24">
          <el-form-item label="头像" :label-width="formLabelWidth">
            <div class="avatar-upload-container">
              <el-upload
                ref="uploadRef"
                class="avatar-uploader"
                :action="UPLOAD_API"
                :headers="headers"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
              >
                <div class="avatar-wrapper">
                  <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon" :class="{ 'is-loading': uploadLoading }">
                    <Plus v-if="!uploadLoading" />
                    <span v-else class="loading-spinner"></span>
                  </el-icon>
                  <!-- 删除按钮 - 悬浮在右上角 -->
                  <div
                    v-if="userForm.avatar"
                    class="avatar-delete-btn"
                    @click.stop.prevent="handleRemoveAvatar"
                  >
                    <el-icon :size="14"><CircleClose /></el-icon>
                  </div>
                </div>
              </el-upload>
            </div>
            <div class="el-upload__tip">只能上传图片，且不超过 2MB</div>
          </el-form-item>
        </el-col>

        <el-col v-bind="formSpan">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="userForm.userName" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col v-bind="formSpan">
          <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickName">
            <el-input v-model="userForm.nickName" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col v-bind="formSpan">
          <el-form-item label="所属部门" :label-width="formLabelWidth" prop="deptId">
            <el-tree-select
              v-model="userForm.deptId"
              :data="deptOptions"
              placeholder="请选择所属部门"
              check-strictly
              clearable
              style="width: 100%"
              @change="handleDeptChange"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="formSpan">
          <el-form-item label="岗位" :label-width="formLabelWidth" prop="postId">
            <el-select
              v-model="userForm.postId"
              placeholder="请选择岗位"
              clearable
              filterable
              style="width: 100%"
              @change="handlePostChange"
            >
              <el-option
                v-for="item in postOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="formSpan">
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="userForm.email" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col v-bind="formSpan">
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="userForm.phone" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col v-bind="formSpan">
          <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
            <el-select v-model="userForm.sex" placeholder="请选择性别">
              <el-option v-for="item in sexStatusOptions" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="formSpan">
          <el-form-item label="用户状态" :label-width="formLabelWidth" prop="status">
            <el-switch
              v-model="userForm.status"
              active-value="0"
              inactive-value="1"
              active-text="启用"
              inactive-text="停用"
              inline-prompt
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="formSpan">
          <el-form-item label="用户角色" :label-width="formLabelWidth" prop="menus">
            <el-select
              v-model="userForm.roleIds"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择角色"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in roleOptionsVisible"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="(item as any).disabled"
              >
                <span>{{ item.label }}</span>
                <el-tag
                  v-if="(item as any).isSuper"
                  type="danger"
                  size="small"
                  style="margin-left: 8px"
                >
                  超管
                </el-tag>
              </el-option>
            </el-select>
            <div v-if="!currentUser?.isSuper" class="el-upload__tip">
              超管角色仅超级管理员可分配
            </div>
            <div v-else class="el-upload__tip">
              已根据岗位自动关联角色，您仍可手动调整
            </div>
          </el-form-item>
        </el-col>
        <el-col v-bind="formSpan">
          <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
            <el-input
              type="textarea"
              maxlength="255"
              show-word-limit
              :autosize="{ minRows: 3, maxRows: 5 }"
              v-model="userForm.remark"
              autocomplete="off"
              word-limit-position="outside"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm" :loading="loading"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.avatar-upload-container {
  display: inline-block;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  overflow: visible;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
  border-radius: 6px;
}

.avatar-delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 22px;
  height: 22px;
  background-color: #f56c6c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.avatar-wrapper:hover .avatar-delete-btn {
  opacity: 1;
}

.avatar-delete-btn:hover {
  transform: scale(1.1);
  background-color: #f78989;
}

.el-upload__tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 7px;
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
</style>
