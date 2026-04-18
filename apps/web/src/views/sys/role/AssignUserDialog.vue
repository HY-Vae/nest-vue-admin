<script setup lang="ts">
import { getDeptOptionsApi } from '@/views/sys/dept/service.ts'
import { getUserApi } from '@/views/sys/user/service.ts'
import type { UserListType } from '@/views/sys/user/user.type'
import { getRoleUsersApi, updateRoleUsersApi } from './service.ts'
import type { ElTree } from 'element-plus'
import { nextTick, ref, watch } from 'vue'
import { useRequest } from 'vue-request'

interface TreeNode {
  id: string
  label: string
  disabled?: boolean
  isUser?: boolean
  children?: TreeNode[]
}

const props = defineProps<{
  roleId: string
  roleName: string
}>()

const visible = defineModel<boolean>({ required: true })
const emit = defineEmits<{
  (e: 'success'): void
}>()

const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<TreeNode[]>([])
const assignedUserIds = ref<string[]>([])
const searchText = ref('')
const checkedCount = ref(0)

const filterNode = (value: string, data: TreeNode) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

watch(searchText, (val) => {
  treeRef.value?.filter(val)
})

/** 将部门树转为 TreeNode，同时构建 deptId → TreeNode 映射 */
const buildDeptNodes = (
  depts: { value: string; label: string; children?: any[] }[],
  deptMap: Map<string, TreeNode>,
): TreeNode[] => {
  return depts.map((dept) => {
    const node: TreeNode = {
      id: dept.value,
      label: dept.label,
      disabled: true,
      children: [],
    }
    deptMap.set(dept.value, node)
    if (dept.children?.length) {
      node.children = buildDeptNodes(dept.children, deptMap)
    }
    return node
  })
}

/** 将用户按 deptId 分组挂到部门节点下 */
const buildTree = (depts: any[], users: UserListType[]): TreeNode[] => {
  const deptMap = new Map<string, TreeNode>()
  const result = buildDeptNodes(depts, deptMap)

  const noDeptNode: TreeNode = {
    id: '__no_dept',
    label: '未分配部门',
    disabled: true,
    children: [],
  }

  for (const user of users) {
    const node: TreeNode = {
      id: user.id,
      label: `${user.nickName} (${user.userName})`,
      isUser: true,
    }
    if (user.deptId && deptMap.has(user.deptId)) {
      deptMap.get(user.deptId)!.children!.push(node)
    } else {
      noDeptNode.children!.push(node)
    }
  }

  if (noDeptNode.children!.length > 0) {
    result.push(noDeptNode)
  }
  return result
}

const updateCheckedCount = () => {
  const checked = treeRef.value?.getCheckedNodes(false, true) as TreeNode[]
  checkedCount.value = checked?.filter((n) => n.isUser).length || 0
}

const { loading: submitLoading, run: runSubmit } = useRequest(
  (roleId: string, userIds: string[]) => updateRoleUsersApi(roleId, { userIds }),
  {
    manual: true,
    loadingKeep: 500,
    onSuccess: () => {
      ElMessage.success('分配用户成功')
      visible.value = false
      emit('success')
    },
  },
)

const handleConfirm = () => {
  const checkedNodes = treeRef.value?.getCheckedNodes(false, true) as TreeNode[]
  const userIds = checkedNodes?.filter((n) => n.isUser).map((n) => n.id) || []
  runSubmit(props.roleId, userIds)
}

const initDialog = async () => {
  if (!props.roleId) return

  const [deptRes, userRes, roleUsersRes] = await Promise.all([
    getDeptOptionsApi(),
    getUserApi({ current: 1, pageSize: 9999 }),
    getRoleUsersApi(props.roleId),
  ])

  treeData.value = buildTree(deptRes.data || [], userRes.data?.list || [])
  assignedUserIds.value = roleUsersRes.data?.userIds || []

  await nextTick()
  for (const userId of assignedUserIds.value) {
    treeRef.value?.setChecked(userId, true, false)
  }
  updateCheckedCount()
}

const handleOpen = () => {
  searchText.value = ''
  initDialog()
}

const handleClose = () => {
  treeData.value = []
  assignedUserIds.value = []
  searchText.value = ''
  checkedCount.value = 0
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="`分配用户 - ${roleName}`"
    width="550"
    @open="handleOpen"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="handleClose"
  >
    <el-input
      v-model="searchText"
      placeholder="搜索用户名/昵称"
      clearable
      class="search-input"
    />
    <el-tree
      ref="treeRef"
      :data="treeData"
      show-checkbox
      check-strictly
      node-key="id"
      default-expand-all
      :filter-node-method="filterNode"
      highlight-current
      @check="updateCheckedCount"
      :props="{ label: 'label', children: 'children', disabled: 'disabled' }"
    >
      <template #default="{ data }">
        <span class="tree-node-label" :class="{ 'is-user': (data as TreeNode).isUser }">
          {{ data.label }}
        </span>
      </template>
    </el-tree>
    <div class="checked-info">已勾选 {{ checkedCount }} 个用户</div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.search-input {
  margin-bottom: 12px;
}

.checked-info {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.tree-node-label {
  font-size: 14px;
  &.is-user {
    padding-left: 4px;
  }
}
</style>
