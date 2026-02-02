<script setup lang="ts">
import { ref, type PropType, computed, watch } from 'vue'
import { ActionEnum } from '@/enums/common.ts'
import type { FormInstance } from 'element-plus'
import type { CreateRoleType, RoleListType } from '@/views/system/role/role.type'
import { getAllPermissionsApi } from '@/api/auth.ts'
import type { SelectOptionItem, SelectTreeItem } from '@/types/global.ts'
import { useDict } from '@/hooks/dict.hook.ts'
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
    type: Object as PropType<RoleListType>,
  },
})
const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const roleFormRef = ref<FormInstance>()

const { getDictOptions } = useDict()

const enableStatusOptions = ref<SelectOptionItem[]>([])

const formLabelWidth = '100px'
const roleForm = ref<CreateRoleType>({
  name: '',
  key: '',
  sort: 0,
  status: '0',
  remark: '',
  menus: [],
  menuBtns: [],
})

const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  key: [
    { required: true, message: '请输入角色值', trigger: 'blur' },
    { max: 30, message: '长度不能超过30个字符', trigger: 'change' },
  ],
  status: [{ required: true, message: '请选择角色状态', trigger: 'blur' }],
  remark: [{ max: 255, message: '长度不能超过255个字符', trigger: 'change' }],
}
const cancel = () => {
  visible.value = false
  emits('cancel')
}
const confirm = () => {
  roleFormRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', roleForm.value)
    }
  })
}

const closeDialog = () => {
  roleFormRef.value?.resetFields()
  roleForm.value = {
    name: '',
    key: '',
    sort: 0,
    status: '0',
    remark: '',
    menus: [],
    menuBtns: [],
  }
}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加角色' : '编辑角色'
})
const menuTree = ref<SelectTreeItem[]>([])
const apiTree = ref<SelectTreeItem[]>([])
const openRole = () => {
  getAllPermissionsApi().then((res) => {
    menuTree.value = res.data.menuTree
    apiTree.value = res.data.apiTree
  })
  getDictOptions('enableStatus').then((res) => {
    enableStatusOptions.value = res
  })
}

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      roleForm.value = val
    }
  },
)
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="500"
    @open="openRole"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="closeDialog"
  >
    <el-form :model="roleForm" ref="roleFormRef" v-loading="detailLoading" :rules="rules">
      <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="roleForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色值" :label-width="formLabelWidth" prop="key">
        <el-input v-model="roleForm.key" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色状态" :label-width="formLabelWidth" prop="status">
        <el-select v-model="roleForm.status" placeholder="请选择角色状态">
          <el-option v-for="item in enableStatusOptions" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单权限" :label-width="formLabelWidth" prop="menus">
        <el-tree-select
          multiple
          collapse-tags
          check-strictly
          collapse-tags-tooltip
          show-checkbox
          v-model="roleForm.menus"
          treeRef="menuRef"
          :data="menuTree"
          highlight-current
          auto-expand-parent
          placeholder="请选择菜单权限"
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="接口权限" :label-width="formLabelWidth" prop="menus">
        <el-tree-select
          multiple
          collapse-tags
          collapse-tags-tooltip
          show-checkbox
          v-model="roleForm.menuBtns"
          treeRef="menuRef"
          :data="apiTree"
          highlight-current
          auto-expand-parent
          placeholder="请选择接口权限"
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
        <el-input-number
          v-model="roleForm.sort"
          :min="0"
          controls-position="right"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
        <el-input
          type="textarea"
          maxlength="255"
          show-word-limit
          :autosize="{ minRows: 3, maxRows: 5 }"
          v-model="roleForm.remark"
          autocomplete="off"
          word-limit-position="outside"
        />
      </el-form-item>
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
