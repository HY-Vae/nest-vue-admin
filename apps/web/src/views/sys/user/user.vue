<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form
        :model="searchUserForm"
        class="demo-form-inline"
        @keydown.enter="onUserSearch"
        @submit.prevent
      >
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="用户名称">
              <el-input v-model="searchUserForm.name" placeholder="请输入用户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item label="用户状态">
              <el-select v-model="searchUserForm.status" placeholder="请选择用户状态" clearable>
                <el-option
                  v-for="item in enableStatusOptions"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onUserSearch">搜索</el-button>
              <el-button plain @click="onUserReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button type="primary" :icon="Plus" v-auth="'sys:user:create'" @click="addUser"
          >新增</el-button
        >
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table :data="tableData" border row-key="id">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="userName" label="用户名" />
          <el-table-column prop="nickName" label="昵称" />
          <el-table-column label="头像" width="70" align="center">
            <template #default="scope">
              <el-avatar
                v-if="scope.row.avatar"
                :src="scope.row.avatar"
                :size="36"
              />
              <el-avatar v-else :size="36" class="avatar-placeholder">
                {{ scope.row.nickName?.charAt(0)?.toUpperCase() || 'U' }}
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="用户状态">
            <template #default="scope">
              {{ getDictLabel(enableStatusOptions, scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180" align="center">
            <template #default="scope">
              {{ transTime(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110">
            <template #default="scope">
              <el-button
                type="primary"
                v-auth="'sys:user:update'"
                link
                @click="updateUser(scope.row)"
                >修改</el-button
              >
              <el-button type="danger" v-auth="'sys:user:remove'" link @click="delUsers(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty :image-size="200" />
          </template>
        </el-table>
      </div>
      <el-row justify="end">
        <el-pagination
          class="table-pagination"
          v-model:current-page="searchUserForm.current"
          v-model:page-size="searchUserForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <user-dialog
      :action="action"
      :loading="actionLoading"
      :detailLoading="detailLoading"
      :current="currentUser"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="runActionUser"
    />
  </div>
</template>
<script setup lang="ts">
import { ActionEnum } from '@/enums/common.ts'
import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import { transTime } from '@/utils/util.ts'
import type {
  CreateUserType,
  UpdateUserType,
  UserDetailType,
  UserListType,
} from '@/views/sys/user/user.type'
import UserDialog from '@/views/sys/user/UserDialog.vue'
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import { addUserApi, deleteUserApi, getUserApi, getUserOneApi, updateUserApi } from './service.ts'

const { getDictOptions, getDictLabel } = useDict()

const enableStatusOptions = ref<SelectOptionItem[]>([])
getDictOptions('enableStatus').then((res) => {
  enableStatusOptions.value = res
})

const searchSpan = ref({
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
})

const searchUserForm = ref({
  name: '',
  status: '',
  current: 1,
  pageSize: 20,
})

const onUserSearch = () => {
  searchUserForm.value.current = 1
  runGetUser()
}

const onUserReset = () => {
  searchUserForm.value = {
    name: '',
    status: '',
    current: 1,
    pageSize: 20,
  }
  runGetUser()
}

const tableData = ref<UserListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetUser } = useRequest(
  () => {
    return getUserApi({
      ...searchUserForm.value,
    })
  },
  {
    manual: false,
    loadingKeep: 500,
    onSuccess: (res) => {
      tableData.value = res.data.list
      total.value = res.data.total
    },
  },
)

const handleSizeChange = () => {
  runGetUser()
}

const handleCurrentChange = () => {
  runGetUser()
}

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)

const addUser = () => {
  action.value = ActionEnum.Add
  currentUser.value = undefined
  visible.value = true
}

const cancelDialog = () => {}

const { loading: actionLoading, run: runActionUser } = useRequest(
  (values: CreateUserType | UpdateUserType) => {
    if (action.value === ActionEnum.Add) {
      return addUserApi(values as CreateUserType)
    }
    return updateUserApi(values as UpdateUserType)
  },
  {
    loadingKeep: 500,
    onSuccess: (res) => {
      visible.value = false
      const message = action.value === ActionEnum.Add ? '新增用户成功' : '修改用户成功'
      ElMessage.success(message)
      runGetUser()
    },
  },
)
const currentUser = ref<UserDetailType | undefined>(undefined)
const { loading: detailLoading, run: runGetUserOne } = useRequest(getUserOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentUser.value = res.data
  },
})

const updateUser = (row: UserListType) => {
  action.value = ActionEnum.Edit
  visible.value = true
  runGetUserOne(row.id)
}

const { runAsync: runDeleteUser } = useRequest(deleteUserApi, {
  loadingKeep: 500,
})

const delUsers = (row: UserListType) => {
  let message = '此操作将永久删除该用户, 是否继续?'
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteUser(row.id)
          .then(() => {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            done()
          })
          .catch(() => {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
          })
      } else {
        done()
      }
    },
  }).then(() => {
    ElMessage.success('删除成功')
    runGetUser()
  })
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
