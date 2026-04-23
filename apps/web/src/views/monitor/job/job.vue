<template>
  <div class="page-container job-container">
    <el-card class="search-bar">
      <el-form
        :model="searchForm"
        :label-width="searchLabelWidth"
        @keydown.enter="onSearch"
        @submit.prevent
      >
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="任务名称" prop="jobName">
              <el-input
                v-model.trim="searchForm.jobName"
                placeholder="请输入任务名称"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="任务组名" prop="jobGroup">
              <el-input
                v-model.trim="searchForm.jobGroup"
                placeholder="请输入任务组名"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="searchForm.status"
                placeholder="请选择状态"
                clearable
                filterable
                style="width: 200px"
              >
                <el-option
                  v-for="dict in jobStatusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

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
        <el-button type="primary" plain v-auth="'monitor:job:create'" @click="handleAdd">新增</el-button>
        <el-button type="danger" plain v-auth="'monitor:job:remove'" @click="handleBatchDelete">批量删除</el-button>
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table
          :data="tableData"
          border
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column label="任务名称" align="center" prop="jobName" min-width="120" show-overflow-tooltip />

          <el-table-column label="任务组名" align="center" prop="jobGroup" min-width="100" show-overflow-tooltip />

          <el-table-column label="调用目标" align="center" prop="invokeTarget" min-width="180" show-overflow-tooltip />

          <el-table-column label="cron表达式" align="center" prop="cronExpression" min-width="120" />

          <el-table-column label="状态" align="center" width="100">
            <template #default="{ row }">
              <el-switch
                v-auth="'monitor:job:status'"
                :model-value="row.status === '0'"
                @change="(val: boolean) => handleStatusChange(row, val)"
              />
            </template>
          </el-table-column>

          <el-table-column label="创建时间" align="center" width="180">
            <template #default="{ row }">
              {{ transTime(row.createdAt) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link v-auth="'monitor:job:update'" @click="handleEdit(row)">编辑</el-button>
              <el-button type="warning" link v-auth="'monitor:job:run'" @click="handleRun(row)">执行一次</el-button>
              <el-button type="danger" link v-auth="'monitor:job:remove'" @click="handleDelete(row)">删除</el-button>
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

    <JobDialog
      v-model="dialogVisible"
      :edit-data="currentEditData"
      @success="runQuery"
    />
  </div>
</template>

<script setup lang="ts">
import { transTime } from '@/utils/util.ts'
import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import { useSearchParams } from '@/composables/useSearchParams'
import { reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import {
  getJobListApi,
  batchDeleteJobApi,
  changeJobStatusApi,
  runJobOnceApi,
} from './service'
import type { JobListType } from './job.type'
import JobDialog from './JobDialog.vue'

const { getDictOptions } = useDict()

const jobStatusOptions = ref<SelectOptionItem[]>([])
getDictOptions('jobStatus').then((res) => { jobStatusOptions.value = res })

const searchLabelWidth = ref(80)

const searchSpan = ref({
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
})

const initialSearchForm = {
  jobName: undefined,
  jobGroup: undefined,
  status: undefined,
  current: 1,
  pageSize: 20,
}

const searchForm = reactive({ ...initialSearchForm })

const { reset: resetSearchParams } = useSearchParams(searchForm)

const onSearch = () => {
  searchForm.current = 1
  runQuery()
}

const onReset = () => {
  resetSearchParams(initialSearchForm)
  runQuery()
}

const tableData = ref<JobListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runQuery } = useRequest(
  () => getJobListApi(searchForm as any),
  {
    manual: false,
    loadingKeep: 500,
    onSuccess: (res) => {
      tableData.value = res.data.list
      total.value = res.data.total
    },
  },
)

const handleSizeChange = () => runQuery()
const handleCurrentChange = () => runQuery()

// 新增/编辑
const dialogVisible = ref(false)
const currentEditData = ref<JobListType | null>(null)

const handleAdd = () => {
  currentEditData.value = null
  dialogVisible.value = true
}

const handleEdit = (row: JobListType) => {
  currentEditData.value = { ...row }
  dialogVisible.value = true
}

// 状态切换
const handleStatusChange = async (row: JobListType, val: boolean) => {
  const newStatus = val ? '0' : '1'
  await changeJobStatusApi({ id: row.id, status: newStatus })
  ElMessage.success('状态修改成功')
  runQuery()
}

// 执行一次
const { runAsync: runRunOnce } = useRequest(runJobOnceApi, { manual: true })

const handleRun = (row: JobListType) => {
  ElMessageBox.confirm(`确定执行任务「${row.jobName}」一次吗？`, '提示', {
    type: 'warning',
  }).then(async () => {
    await runRunOnce(row.id)
    ElMessage.success('已触发执行')
  })
}

// 批量删除
const selectedIds = ref<string[]>([])

const handleSelectionChange = (selection: JobListType[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

const { runAsync: runBatchDelete } = useRequest(batchDeleteJobApi, { manual: true })

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

// 单个删除
const handleDelete = (row: JobListType) => {
  ElMessageBox.confirm(`确定删除任务「${row.jobName}」吗？`, '提示', {
    type: 'warning',
  }).then(async () => {
    await runBatchDelete([row.id])
    ElMessage.success('删除成功')
    runQuery()
  })
}
</script>

<style scoped lang="scss">
.job-container {
}
</style>
