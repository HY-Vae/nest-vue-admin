<script setup lang="ts">
import { getRoleOptionsApi } from '@/views/sys/role/service.ts'
import { ActionEnum } from '@/enums/common.ts'
import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import type { CreateUserType, UserDetailType } from '@/views/sys/user/user.type'
import type { FormInstance } from 'element-plus'
import { computed, ref, watch, type PropType } from 'vue'
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
})

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
  visible.value = false
  emits('cancel')
}
const confirm = () => {
  userFormRef.value?.validate((valid) => {
    if (valid) {
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
  }
}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加用户' : '编辑用户'
})
const roleOptions = ref<SelectOptionItem[]>([])
const sexStatusOptions = ref<SelectOptionItem[]>([])
const openUser = () => {
  getRoleOptionsApi().then((res) => {
    roleOptions.value = res.data
  })
  getDictOptions('enableStatus').then((res) => {
    enableStatusOptions.value = res
  })

  getDictOptions('sexStatus').then((res) => {
    sexStatusOptions.value = res
  })
}

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      userForm.value = val as CreateUserType
    }
  },
)
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
            <el-select v-model="userForm.status" placeholder="请选择用户状态">
              <el-option
                v-for="item in enableStatusOptions"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="formSpan">
          <el-form-item label="用户角色" :label-width="formLabelWidth" prop="menus">
            <!--            <el-select-->
            <!--              multiple-->
            <!--              collapse-tags-->
            <!--              collapse-tags-tooltip-->
            <!--              show-checkbox-->
            <!--              v-model="userForm.roleIds"-->
            <!--            >-->
            <!--              <el-option v-for="item in roleOptions" :label="item.label" :value="item.value" />-->
            <!--            </el-select>-->
            <el-tree-select
              multiple
              collapse-tags
              check-strictly
              collapse-tags-tooltip
              show-checkbox
              v-model="userForm.roleIds"
              treeRef="menuRef"
              :data="roleOptions"
              highlight-current
              auto-expand-parent
              placeholder="请选择角色"
              :render-after-expand="false"
            />
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

<style scoped></style>
