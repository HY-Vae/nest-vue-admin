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
      <el-input
        v-model="filterText"
        placeholder="搜索部门"
        clearable
        style="margin-bottom: 12px"
      />
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
            <template v-if="selectedDept">
              - {{ selectedDept.deptName }}
            </template>
            <template v-else>
              - 全公司
            </template>
            <span class="user-total">({{ userTotal }}人)</span>
          </span>
          <el-button type="primary" v-auth="'sys:user:create'" @click="addUser">新增用户</el-button>
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
        <el-select
          v-model="searchForm.status"
          placeholder="状态"
          clearable
          style="width: 100px"
        >
          <el-option
            v-for="item in enableStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-checkbox v-model="searchForm.includeChildren" @change="handleIncludeChildrenChange">包含子部门</el-checkbox>
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
        <el-table-column label="部门" width="120">
          <template #default="{ row }">
            <span>{{ row.dept?.deptName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="岗位" width="150">
          <template #default="{ row }">
            <div class="post-cell">
              <span>{{ row.post?.name || '-' }}</span>
              <el-tag v-if="row.post?.isLeader" type="success" size="small">负责人</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" width="120" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'" size="small">
              {{ getDictLabel(enableStatusOptions, row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" v-auth="'sys:user:update'" @click="editUser(row)">编辑</el-button>
            <el-button type="danger" link size="small" v-auth="'sys:user:remove'" @click="deleteUser(row)">删除</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import { getSysDeptApi } from '@/views/sys/dept/service'
import { getSysPostApi } from '@/views/sys/post/service'
import { getUserApi, getUserOneApi, addUserApi, updateUserApi, deleteUserApi } from './service'
import { ActionEnum } from '@/enums/common'
import UserDialog from './UserDialog.vue'
import type { CreateUserType, UpdateUserType, UserDetailType } from './user.type'
import { useSearchParams } from '@/composables/useSearchParams'

const router = useRouter()
const { getDictLabel, getDictOptions } = useDict()

// 字典选项
const enableStatusOptions = ref<SelectOptionItem[]>([])

// 部门树
const treeRef = ref()
const filterText = ref('')
const deptTreeData = ref<any[]>([])
const selectedDept = ref<any | null>(null)
const currentNodeKey = ref<string>('')

// 岗位选项
const postOptions = ref<SelectOptionItem[]>([])

// 初始搜索条件
const initialSearchForm = {
  deptId: undefined as string | undefined,
  postId: undefined as string | undefined,
  userName: undefined as string | undefined,
  status: undefined as string | undefined,
  includeChildren: true,
  current: 1,
  pageSize: 10,
}

// 用户列表
const searchForm = ref({ ...initialSearchForm })
const userList = ref<any[]>([])
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

// 树配置
const treeProps = {
  label: 'deptName',
  children: 'children',
}

// 初始化
onMounted(async () => {
  enableStatusOptions.value = await getDictOptions('enableStatus')
  await loadDeptTree()

  // 如果有保存的部门ID，选中该部门
  if (searchForm.value.deptId) {
    currentNodeKey.value = searchForm.value.deptId
    await loadPostOptions()
    loadUsers()
    await nextTick()
    treeRef.value?.setCurrentKey(searchForm.value.deptId)
  } else if (deptTreeData.value.length > 0) {
    // 默认选中第一个部门
    const firstDept = deptTreeData.value[0]
    selectedDept.value = firstDept
    searchForm.value.deptId = firstDept.id
    searchForm.value.includeChildren = true
    currentNodeKey.value = firstDept.id
    await loadPostOptions()
    loadUsers()
    await nextTick()
    treeRef.value?.setCurrentKey(firstDept.id)
  }
})

// 加载部门树
const loadDeptTree = async () => {
  const res = await getSysDeptApi({})
  deptTreeData.value = res.data.list
}

// 加载岗位选项
const loadPostOptions = async () => {
  const params: any = { pageSize: 1000 }

  if (searchForm.value.deptId) {
    params.deptId = searchForm.value.deptId
    params.includeChildren = searchForm.value.includeChildren
  }

  const res = await getSysPostApi(params)
  postOptions.value = res.data.list.map((item: any) => ({
    value: item.id,
    label: item.name,
  }))
}

// 搜索过滤
watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.deptName?.includes(value)
}

// 点击树节点
const handleNodeClick = async (data: any) => {
  selectedDept.value = data
  currentNodeKey.value = data.id
  searchForm.value.deptId = data.id
  searchForm.value.postId = undefined
  // 默认包含子部门
  searchForm.value.includeChildren = true
  searchForm.value.current = 1
  // 加载岗位选项
  await loadPostOptions()
  loadUsers()
}

// 加载用户列表
const loadUsers = async () => {
  userLoading.value = true
  try {
    const params: any = {
      userName: searchForm.value.userName,
      status: searchForm.value.status,
      current: searchForm.value.current,
      pageSize: searchForm.value.pageSize,
    }

    if (searchForm.value.deptId) {
      params.deptId = searchForm.value.deptId
      params.includeChildren = searchForm.value.includeChildren
    }
    if (searchForm.value.postId) {
      params.postId = searchForm.value.postId
    }

    const res = await getUserApi(params)
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

const editUser = (row: any) => {
  dialogAction.value = ActionEnum.Edit
  runGetUserOne(row.id)
  dialogVisible.value = true
}

// 删除用户
const { runAsync: runDeleteUser } = useRequest(deleteUserApi, { manual: true })

const deleteUser = (row: any) => {
  ElMessageBox.confirm(`确定删除用户「${row.nickName}」吗？`, '提示', {
    type: 'warning',
  }).then(async () => {
    await runDeleteUser(row.id)
    ElMessage.success('删除成功')
    loadUsers()
    loadDeptTree()
  })
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
    loadUsers()
    loadDeptTree()
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
