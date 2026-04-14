<script setup lang="ts">
import { getAllPermissionsApi } from '@/api/auth.ts'
import { ActionEnum } from '@/enums/common.ts'
import { useDict } from '@/hooks/dict.hook.ts'
import { useUserStore } from '@/stores/modules/user.ts'
import type { SelectOptionItem, SelectTreeItem } from '@/types/global.ts'
import type { CreateRoleType, RoleListType } from '@/views/sys/role/role.type'
import { getDeptOptionsApi } from '@/views/sys/dept/service.ts'
import type { FormInstance } from 'element-plus'
import { ElTreeSelect } from 'element-plus'
import { computed, nextTick, ref, watch, type PropType } from 'vue'
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
    type: Object as PropType<RoleListType>,
  },
})
const visible = defineModel<boolean>({ required: true })
const emits = defineEmits(['cancel', 'confirm'])
const roleFormRef = ref<FormInstance>()

const { getDictOptions, getDictLabel } = useDict()

const dataScopeOptions = ref<SelectOptionItem[]>([])

const menuRef = ref<InstanceType<typeof ElTreeSelect>>()

const formLabelWidth = '100px'
const roleForm = ref<CreateRoleType>({
  name: '',
  key: '',
  sort: 0,
  status: '0',
  isSuper: false,
  dataScope: 'SELF',
  remark: '',
  menus: [],
  menuBtns: [],
  deptIds: [],
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
  dataScope: [{ required: true, message: '请选择数据权限范围', trigger: 'change' }],
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
    dataScope: 'SELF',
    remark: '',
    menus: [],
    menuBtns: [],
    deptIds: [],
  }
}

const title = computed(() => {
  return props.action === ActionEnum.Add ? '添加角色' : '编辑角色'
})
const menuTree = ref<SelectTreeItem[]>([])
const apiTree = ref<SelectTreeItem[]>([])
const deptTree = ref<SelectTreeItem[]>([])

const openRole = () => {
  getAllPermissionsApi().then((res) => {
    nextTick(() => {
      menuTree.value = res.data.menuTree
      apiTree.value = res.data.apiTree
    })
  })
  getDictOptions('dataScope').then((res) => {
    dataScopeOptions.value = res
  })
  getDeptOptionsApi().then((res) => {
    deptTree.value = res.data || []
  })
}

const getAllChildrenIds = (nodeData: SelectTreeItem<number>, ids: number[] = []) => {
  if (nodeData.children && nodeData.children.length > 0) {
    nodeData.children.forEach((child) => {
      ids.push(child.value)
      getAllChildrenIds(child, ids)
    })
  }
  return ids
}

const handleCheck = (data: SelectTreeItem<number>, { checkedKeys }: { checkedKeys: number[] }) => {
  const currentId = data.value
  const isChecked = checkedKeys.includes(currentId)

  const finalIds = new Set(roleForm.value.menus)

  const childrenIds = getAllChildrenIds(data)
  if (isChecked) {
    childrenIds.forEach((cid) => finalIds.add(cid))
  } else {
    childrenIds.forEach((cid) => finalIds.delete(cid))
  }

  if (isChecked) {
    const treeInstance = menuRef.value

    if (treeInstance) {
      const node = treeInstance.getNode(currentId)

      let parent = node.parent
      while (parent && parent.level > 0) {
        finalIds.add(parent.key)
        parent = parent.parent
      }
    }
  }

  roleForm.value.menus = [...finalIds]
}

/** 切换数据权限范围时，如果不是 CUSTOM 就清空 deptIds */
const handleDataScopeChange = (val: string) => {
  if (val !== 'CUSTOM') {
    roleForm.value.deptIds = []
  }
}

/** 切换超管角色时，自动设置数据权限为 ALL */
const handleIsSuperChange = (val: boolean) => {
  if (val) {
    roleForm.value.dataScope = 'ALL'
    roleForm.value.deptIds = []
  }
}

watch(
  () => props.current,
  (val) => {
    if (val != undefined && !props.detailLoading) {
      roleForm.value = {
        ...val,
        isSuper: val.isSuper || false,
        dataScope: val.dataScope || 'SELF',
        menus: 'menus' in val ? (val.menus as number[]) : [],
        menuBtns: 'menuBtns' in val ? (val.menuBtns as number[]) : [],
        deptIds: 'deptIds' in val ? (val.deptIds as string[]) : [],
      }
    }
  },
)
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600"
    @open="openRole"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="closeDialog"
  >
    <el-form
      :model="roleForm"
      ref="roleFormRef"
      v-loading="detailLoading"
      :rules="rules"
      label-suffix=":"
    >
      <!-- 基本信息 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="roleForm.name" placeholder="请输入角色名称" autocomplete="off" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色值" :label-width="formLabelWidth" prop="key">
            <el-input v-model="roleForm.key" placeholder="请输入角色值" autocomplete="off" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="角色状态" :label-width="formLabelWidth" prop="status">
            <el-switch
              v-model="roleForm.status"
              active-value="0"
              inactive-value="1"
              active-text="启用"
              inactive-text="停用"
              inline-prompt
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
            <el-input-number
              v-model="roleForm.sort"
              :min="0"
              controls-position="right"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">数据权限</el-divider>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="超管角色" :label-width="formLabelWidth">
            <el-tooltip
              v-if="!currentUser?.isSuper"
              content="仅超级管理员可设置此选项"
              placement="top"
            >
              <el-switch
                v-model="roleForm.isSuper"
                active-text="是"
                inactive-text="否"
                inline-prompt
                disabled
                @change="handleIsSuperChange"
              />
            </el-tooltip>
            <el-switch
              v-else
              v-model="roleForm.isSuper"
              active-text="是"
              inactive-text="否"
              inline-prompt
              @change="handleIsSuperChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限范围" :label-width="formLabelWidth" prop="dataScope">
            <el-select
              v-model="roleForm.dataScope"
              placeholder="请选择数据权限范围"
              clearable
              filterable
              :disabled="roleForm.isSuper"
              @change="handleDataScopeChange"
            >
              <el-option
                v-for="item in dataScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="roleForm.dataScope === 'CUSTOM'"
            label="授权部门"
            :label-width="formLabelWidth"
          >
            <el-tree-select
              v-if="deptTree.length > 0"
              v-model="roleForm.deptIds"
              :data="deptTree"
              multiple
              collapse-tags
              collapse-tags-tooltip
              show-checkbox
              check-strictly
              highlight-current
              auto-expand-parent
              placeholder="请选择部门"
              :render-after-expand="false"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">功能权限</el-divider>

      <el-form-item label="菜单权限" :label-width="formLabelWidth" prop="menus">
        <el-tree-select
          v-if="menuTree.length > 0"
          multiple
          collapse-tags
          check-strictly
          collapse-tags-tooltip
          show-checkbox
          @check="handleCheck"
          v-model="roleForm.menus"
          ref="menuRef"
          :data="menuTree"
          highlight-current
          auto-expand-parent
          placeholder="请选择菜单权限"
          :render-after-expand="false"
          class="w-full"
        />
      </el-form-item>
      <el-form-item label="接口权限" :label-width="formLabelWidth" prop="menuBtns">
        <el-tree-select
          v-if="apiTree.length > 0"
          multiple
          collapse-tags
          collapse-tags-tooltip
          show-checkbox
          v-model="roleForm.menuBtns"
          :data="apiTree"
          highlight-current
          auto-expand-parent
          placeholder="请选择接口权限"
          :render-after-expand="false"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
        <el-input
          type="textarea"
          maxlength="255"
          show-word-limit
          :autosize="{ minRows: 2, maxRows: 4 }"
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

<style scoped>
.w-full {
  width: 100%;
}
</style>
