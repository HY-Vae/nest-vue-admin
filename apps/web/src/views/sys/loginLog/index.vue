<template>
  <div class="page-container loginLog-container">
    <el-card class="search-bar">
      <el-form
        :model="searchForm"
        :label-width="searchLabelWidth"
        @keydown.enter="onSearch"
        @submit.prevent
      >
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model.trim="searchForm.userName"
                placeholder="请输入用户名"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="IP" prop="ip">
              <el-input
                v-model.trim="searchForm.ip"
                placeholder="请输入IP"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="登录地点" prop="location">
              <el-input
                v-model.trim="searchForm.location"
                placeholder="请输入登录地点"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <template v-if="!onlineMode">
            <el-col v-bind="searchSpan">
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="searchForm.status"
                  placeholder="请选择状态"
                  clearable
                  style="width: 200px"
                >
                  <el-option
                    v-for="dict in loginStatusOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col v-bind="searchSpan">
              <el-form-item label="登录时间" prop="timeRange">
                <el-date-picker
                  v-model="timeRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 360px"
                  @change="handleTimeChange"
                />
              </el-form-item>
            </el-col>
          </template>

          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onSearch">搜索</el-button>
              <el-button plain @click="onReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="table-container">
      <el-row class="table-bar">
        <el-switch
          v-model="onlineMode"
          active-text="仅看在线"
          @change="handleOnlineModeChange"
        />
        <template v-if="!onlineMode">
          <el-button type="danger" plain v-auth="'sys:login-log:remove'" @click="handleBatchDelete">
            批量删除
          </el-button>
          <el-button type="danger" plain v-auth="'sys:login-log:clear'" @click="handleClear">
            清空日志
          </el-button>
          <el-button v-auth="'sys:login-log:export'" @click="exportVisible = true">导出</el-button>
        </template>
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table
          :data="tableData"
          border
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="!onlineMode" type="selection" width="55" />

          <el-table-column label="用户名" align="center" prop="userName" width="120" />

          <el-table-column label="IP" align="center" prop="ip" width="140" />

          <el-table-column label="登录地点" align="center" prop="location" width="120">
            <template #default="{ row }">
              {{ row.location || '-' }}
            </template>
          </el-table-column>

          <el-table-column label="浏览器" align="center" prop="browser" width="150">
            <template #default="{ row }">
              {{ row.browser || '-' }}
            </template>
          </el-table-column>

          <el-table-column label="操作系统" align="center" prop="os" width="150">
            <template #default="{ row }">
              {{ row.os || '-' }}
            </template>
          </el-table-column>

          <el-table-column v-if="!onlineMode" label="状态" align="center" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === '0' ? 'success' : 'danger'" size="small">
                {{ getDictLabel(loginStatusOptions, row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column v-if="!onlineMode" label="失败原因" align="center" prop="message" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.message || '-' }}
            </template>
          </el-table-column>

          <el-table-column label="登录时间" align="center" width="180">
            <template #default="{ row }">
              {{ transTime(row.createdAt) }}
            </template>
          </el-table-column>

          <el-table-column v-if="onlineMode" label="过期时间" align="center" width="180">
            <template #default="{ row }">
              {{ transTime(row.expireTime) }}
            </template>
          </el-table-column>

          <el-table-column v-if="onlineMode" label="操作" align="center" width="100" fixed="right">
            <template #default="{ row }">
              <el-button
                type="danger"
                link
                v-auth="'sys:login-log:force-logout'"
                @click="handleForceLogout(row)"
              >
                强制下线
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
          v-model:current-page="searchForm.current"
          v-model:page-size="searchForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>

    <ExportDialog
      v-if="!onlineMode"
      v-model:visible="exportVisible"
      :columns="columns"
      export-url="/sys/login-log/export"
      :search-params="searchForm"
      filename="登录日志"
    />
  </div>
</template>

<script setup lang="ts">
import { transTime } from '@/utils/util.ts'
import { reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import ExportDialog from '@/components/export/ExportDialog.vue'
import type { ColumnConfig } from '@/types/global.ts'
import {
  getLoginLogApi,
  getOnlineUserApi,
  batchDeleteLoginLogApi,
  clearLoginLogApi,
  forceLogoutApi,
} from './service'
import type { SysLoginLogListType } from './loginLog.type'
import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import { useSearchParams } from '@/composables/useSearchParams'

const { getDictOptions, getDictLabel } = useDict()

const loginStatusOptions = ref<SelectOptionItem[]>([])
getDictOptions('loginStatus').then((res) => {
  loginStatusOptions.value = res
})

// 在线模式切换
const onlineMode = ref(false)

const handleOnlineModeChange = () => {
  onReset()
}

// 导出
const exportVisible = ref(false)
const columns: ColumnConfig[] = [
  { key: 'userName', label: '用户名' },
  { key: 'ip', label: 'IP' },
  { key: 'location', label: '登录地点' },
  { key: 'browser', label: '浏览器' },
  { key: 'os', label: '操作系统' },
  { key: 'status', label: '状态', format: { type: 'enum', dictCode: 'loginStatus' } },
  { key: 'message', label: '失败原因' },
  { key: 'createdAt', label: '登录时间', format: 'datetime' },
]

const searchLabelWidth = ref(80)

const searchSpan = ref({
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
})

// 初始搜索条件
const initialSearchForm = {
  userName: undefined,
  ip: undefined,
  location: undefined,
  status: undefined,
  startTime: undefined,
  endTime: undefined,
  current: 1,
  pageSize: 20,
}

const searchForm = reactive({ ...initialSearchForm })
const timeRange = ref<[string, string] | null>(null)

// 搜索条件保存恢复
const { reset: resetSearchParams } = useSearchParams(searchForm)

const onSearch = () => {
  searchForm.current = 1
  runQuery()
}

const onReset = () => {
  timeRange.value = null
  resetSearchParams(initialSearchForm)
  runQuery()
}

const handleTimeChange = (val: [string, string] | null) => {
  if (val) {
    searchForm.startTime = val[0]
    searchForm.endTime = val[1]
  } else {
    searchForm.startTime = undefined
    searchForm.endTime = undefined
  }
}

const tableData = ref<SysLoginLogListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runQuery } = useRequest(
  () => {
    const params = { ...searchForm }
    if (onlineMode.value) {
      return getOnlineUserApi({ current: params.current, pageSize: params.pageSize, userName: params.userName })
    }
    return getLoginLogApi(params)
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
  runQuery()
}

const handleCurrentChange = () => {
  runQuery()
}

// 批量删除
const selectedIds = ref<number[]>([])

const handleSelectionChange = (selection: SysLoginLogListType[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

const { runAsync: runBatchDelete } = useRequest(batchDeleteLoginLogApi, { manual: true })

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }

  ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
    type: 'warning',
  }).then(async () => {
    await runBatchDelete(selectedIds.value)
    ElMessage.success('删除成功')
    runQuery()
  })
}

// 清空日志
const { runAsync: runClear } = useRequest(clearLoginLogApi, { manual: true })

const handleClear = () => {
  ElMessageBox.confirm('确定清空所有登录日志吗？此操作不可恢复！', '警告', {
    type: 'warning',
  }).then(async () => {
    await runClear()
    ElMessage.success('清空成功')
    runQuery()
  })
}

// 强制下线
const { runAsync: runForceLogout } = useRequest(forceLogoutApi, { manual: true })

const handleForceLogout = (row: SysLoginLogListType) => {
  ElMessageBox.confirm(`确定强制用户「${row.userName}」下线吗？`, '提示', {
    type: 'warning',
  }).then(async () => {
    await runForceLogout(row.userId!)
    ElMessage.success('已强制下线')
    runQuery()
  })
}
</script>

<style scoped lang="scss">
.loginLog-container {
}
</style>
