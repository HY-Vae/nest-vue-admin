<template>
  <div class="org-user-page">
    <!-- 左侧：部门树 -->
    <el-card class="dept-panel">
      <template #header>
        <div class="panel-header">
          <span>组织架构</span>
          <el-button type="primary" link size="small" v-auth="'sys:dept:create'" @click="goToDept">
            管理部门
          </el-button>
        </div>
      </template>
      <el-input v-model="filterText" placeholder="搜索部门" clearable style="margin-bottom: 12px" />
      <!-- 部门树 -->
      <el-tree
        ref="treeRef"
        :data="deptTreeData"
        :props="treeProps"
        :current-node-key="currentNodeKey"
        node-key="id"
        highlight-current
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        default-expand-all
        @node-click="handleNodeClick"
      >
        <template #default="{ data }">
          <div class="tree-node">
            <span class="node-name">{{ data.deptName }}</span>
            <span class="node-count">{{ data.totalUserCount || 0 }}</span>
          </div>
        </template>
      </el-tree>
    </el-card>

    <!-- 右侧：用户列表 -->
    <el-card class="user-panel">
      <template #header>
        <div class="panel-header">
          <span>
            用户列表
            <template v-if="selectedDept"> - {{ selectedDept.deptName }} </template>
            <template v-else> - 全公司 </template>
            <span class="user-total">({{ userTotal }}人)</span>
          </span>
          <el-button type="primary" v-auth="'sys:user:create'" @click="addUser">新增用户</el-button>
          <el-button v-auth="'sys:user:export'" @click="exportVisible = true">导出</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchForm.userName"
          placeholder="搜索用户名/昵称"
          clearable
          style="width: 180px"
          @keydown.enter="searchUsers"
        />
        <el-select
          v-model="searchForm.postId"
          placeholder="岗位"
          clearable
          filterable
          style="width: 140px"
        >
          <el-option
            v-for="item in postOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="状态" clearable style="width: 100px">
          <el-option
            v-for="item in enableStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-checkbox v-model="searchForm.includeChildren" @change="handleIncludeChildrenChange"
          >包含子部门</el-checkbox
        >
        <el-button type="primary" @click="searchUsers">搜索</el-button>
      </div>

      <!-- 用户表格 -->
      <el-table :data="userList" v-loading="userLoading" border size="small">
        <el-table-column label="用户" min-width="150">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="32" :src="row.avatar">
                {{ row.nickName?.charAt(0) || row.userName?.charAt(0) }}
              </el-avatar>
              <div class="user-info">
                <span class="nick-name">{{ row.nickName }}</span>
                <span class="user-name">@{{ row.userName }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="colLabel('dept.deptName')" width="120">
          <template #default="{ row }">
            <span>{{ row.dept?.deptName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="colLabel('post.name')" width="150">
          <template #default="{ row }">
            <div class="post-cell">
              <span>{{ row.post?.name || '-' }}</span>
              <el-tag v-if="row.post?.isLeader" type="success" size="small">负责人</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="colLabel('phone')" prop="phone" width="120" />
        <el-table-column :label="colLabel('status')" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'" size="small">
              {{ getDictLabel(enableStatusOptions, row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              v-auth="'sys:user:update'"
              @click="editUser(row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              link
              size="small"
              v-auth="'sys:user:remove'"
              @click="deleteUser(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="searchForm.current"
          v-model:page-size="searchForm.pageSize"
          :total="userTotal"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          small
          background
          @size-change="loadUsers"
          @current-change="loadUsers"
        />
      </div>
    </el-card>

    <!-- 用户编辑弹窗 -->
    <UserDialog
      v-model="dialogVisible"
      :action="dialogAction"
      :loading="dialogLoading"
      :detailLoading="detailLoading"
      :current="currentUser"
      @cancel="dialogVisible = false"
      @confirm="handleSubmit"
    />

    <ExportDialog
      v-model:visible="exportVisible"
      :columns="columns"
      export-url="/sys/user/export"
      :search-params="searchForm"
      filename="用户列表"
    />
  </div>
</template>

<script setup lang="ts">
import { useSearchParams } from '@/composables/useSearchParams'
import { ActionEnum } from '@/enums/common'
import { useDict } from '@/hooks/dict.hook.ts'
import type { ColumnConfig, SelectOptionItem } from '@/types/global.ts'
import { getSysDeptApi } from '@/views/sys/dept/service'
import type { SysDeptListType } from '@/views/sys/dept/sysDept.type'
import type { SysPostListType } from '@/views/sys/post/post.type'
import { getSysPostApi } from '@/views/sys/post/service'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import ExportDialog from '@/components/export/ExportDialog.vue'
import UserDialog from './UserDialog.vue'
import { addUserApi, deleteUserApi, getUserApi, getUserOneApi, updateUserApi } from './service'
import type {
  CreateUserType,
  QueryUserType,
  UpdateUserType,
  UserDetailType,
  UserListType,
} from './user.type'

const router = useRouter()
const { getDictLabel, getDictOptions } = useDict()

// 字典选项
const enableStatusOptions = ref<SelectOptionItem[]>([])

// 部门树
const treeRef = ref()
const filterText = ref('')
const deptTreeData = ref<SysDeptListType[]>([])
const selectedDept = ref<SysDeptListType | null>(null)
const currentNodeKey = ref<string>('')

// 岗位选项
const postOptions = ref<SelectOptionItem[]>([])

// 初始搜索条件
const initialSearchForm: QueryUserType = {
  deptId: undefined,
  postId: undefined,
  userName: undefined,
  status: undefined,
  includeChildren: true,
  current: 1,
  pageSize: 10,
}

// 用户列表
const searchForm = ref<QueryUserType>({ ...initialSearchForm })
const userList = ref<UserListType[]>([])
const userTotal = ref(0)
const userLoading = ref(false)

// 搜索条件保存恢复
const { reset: resetSearchParams } = useSearchParams(searchForm.value)

// 弹窗
const dialogVisible = ref(false)
const dialogAction = ref<ActionEnum>(ActionEnum.Add)
const dialogLoading = ref(false)
const detailLoading = ref(false)
const currentUser = ref<UserDetailType | undefined>()

// 导出
const exportVisible = ref(false)

// 统一列配置（表格标签 + 导出字段）
const columns: ColumnConfig[] = [
  { key: 'userName', label: '用户名' },
  { key: 'nickName', label: '昵称' },
  { key: 'dept.deptName', label: '部门' },
  { key: 'post.name', label: '岗位' },
  { key: 'phone', label: '手机号' },
  { key: 'email', label: '邮箱' },
  { key: 'status', label: '状态', format: { type: 'enum', dictCode: 'enableStatus' } },
  { key: 'createdAt', label: '创建时间', format: 'datetime', tableVisible: false },
]

// 根据 key 获取列标签
const colLabel = (key: string) => columns.find((c) => c.key === key)?.label || ''

// 树配置
const treeProps = {
  label: 'deptName',
  children: 'children',
}

// 选中部门并加载数据
const selectDept = async (dept: SysDeptListType) => {
  selectedDept.value = dept
  searchForm.value.deptId = dept.id
  searchForm.value.includeChildren = true
  currentNodeKey.value = dept.id
  await loadPostOptions()
  loadUsers()
  await nextTick()
  treeRef.value?.setCurrentKey(dept.id)
}

// 初始化
onMounted(async () => {
  enableStatusOptions.value = await getDictOptions('enableStatus')
  await loadDeptTree()

  const deptId = searchForm.value.deptId
  if (deptId) {
    // 恢复之前选中的部门
    const dept = findDeptById(deptTreeData.value, deptId)
    if (dept) {
      await selectDept(dept)
    }
  } else if (deptTreeData.value[0]) {
    // 默认选中第一个部门
    await selectDept(deptTreeData.value[0])
  }
})

// 递归查找部门
const findDeptById = (list: SysDeptListType[], id: string): SysDeptListType | undefined => {
  for (const dept of list) {
    if (dept.id === id) return dept
    if (dept.children) {
      const found = findDeptById(dept.children, id)
      if (found) return found
    }
  }
}

// 加载部门树
const loadDeptTree = async () => {
  const res = await getSysDeptApi({})
  deptTreeData.value = res.data.list
}

// 加载岗位选项
const loadPostOptions = async () => {
  const { deptId, includeChildren } = searchForm.value
  const res = await getSysPostApi({
    pageSize: 1000,
    ...(deptId && { deptId, includeChildren }),
  })
  postOptions.value = res.data.list.map((item: SysPostListType) => ({
    value: item.id,
    label: item.name,
  }))
}

// 搜索过滤
watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

const filterNode = (value: string, data: unknown) => {
  if (!value) return true
  const node = data as SysDeptListType
  return node.deptName?.includes(value)
}

// 点击树节点
const handleNodeClick = async (data: SysDeptListType) => {
  searchForm.value.postId = undefined
  searchForm.value.current = 1
  await selectDept(data)
}

// 加载用户列表
const loadUsers = async () => {
  userLoading.value = true
  try {
    const res = await getUserApi(searchForm.value)
    userList.value = res.data.list
    userTotal.value = res.data.total
  } finally {
    userLoading.value = false
  }
}

// 搜索用户
const searchUsers = () => {
  searchForm.value.current = 1
  loadUsers()
}

// 切换"包含子部门"
const handleIncludeChildrenChange = async () => {
  searchForm.value.postId = undefined
  // 重新加载岗位选项
  await loadPostOptions()
  searchUsers()
}

// 新增用户
const addUser = () => {
  dialogAction.value = ActionEnum.Add
  currentUser.value = undefined
  dialogVisible.value = true
}

// 编辑用户
const { run: runGetUserOne } = useRequest(getUserOneApi, {
  manual: true,
  onSuccess: (res) => {
    currentUser.value = res.data
  },
})

const editUser = (row: UserListType) => {
  dialogAction.value = ActionEnum.Edit
  runGetUserOne(row.id)
  dialogVisible.value = true
}

// 删除用户
const { runAsync: runDeleteUser } = useRequest(deleteUserApi, { manual: true })

const deleteUser = (row: UserListType) => {
  ElMessageBox.confirm(`确定删除用户「${row.nickName}」吗？`, '提示', {
    type: 'warning',
  }).then(async () => {
    await runDeleteUser(row.id)
    ElMessage.success('删除成功')
    refreshData()
  })
}

// 刷新数据（用户列表和部门树）
const refreshData = () => {
  loadUsers()
  loadDeptTree()
}

// 提交用户表单
const { runAsync: runAddUser } = useRequest(addUserApi, { manual: true })
const { runAsync: runUpdateUser } = useRequest(updateUserApi, { manual: true })

const handleSubmit = async (values: CreateUserType | UpdateUserType) => {
  dialogLoading.value = true
  try {
    if (dialogAction.value === ActionEnum.Add) {
      await runAddUser(values as CreateUserType)
      ElMessage.success('新增成功')
    } else {
      await runUpdateUser(values as UpdateUserType)
      ElMessage.success('修改成功')
    }
    dialogVisible.value = false
    refreshData()
  } finally {
    dialogLoading.value = false
  }
}

// 跳转到部门管理
const goToDept = () => {
  router.push('/sys/dept')
}
</script>

<style scoped lang="scss">
.org-user-page {
  display: flex;
  gap: 16px;
  height: 100%;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;

  .user-total {
    font-weight: normal;
    color: var(--el-text-color-secondary);
    margin-left: 4px;
  }
}

.dept-panel {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.el-card__header) {
    padding: 12px 16px;
    flex-shrink: 0;
  }

  :deep(.el-card__body) {
    padding: 12px;
    flex: 1;
    overflow: auto;
    min-height: 0;
  }
}

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 8px;

  .node-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .node-count {
    font-size: 12px;
    color: #fff;
    background-color: var(--el-color-primary);
    padding: 0 6px;
    border-radius: 10px;
    line-height: 18px;
    height: 18px;
    min-width: 18px;
    text-align: center;
  }
}

.user-panel {
  flex: 1;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.el-card__header) {
    padding: 12px 16px;
    flex-shrink: 0;
  }

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }
}

.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-shrink: 0;
  align-items: center;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;

  .user-info {
    display: flex;
    flex-direction: column;

    .nick-name {
      font-weight: 500;
    }

    .user-name {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

.post-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pagination-wrapper {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}
</style>
