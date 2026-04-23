<template>
  <div class="page-container job-log-container">
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
                  v-for="dict in jobLogStatusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="执行时间" prop="timeRange">
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
        <el-button type="danger" plain v-auth="'monitor:job-log:remove'" @click="handleBatchDelete">批量删除</el-button>
        <el-button type="danger" plain v-auth="'monitor:job-log:clear'" @click="handleClean">清空日志</el-button>
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

          <el-table-column label="状态" align="center" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === '0' ? 'success' : 'danger'" size="small">
                {{ getDictLabel(jobLogStatusOptions, row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="执行信息" align="center" prop="jobMessage" min-width="120" show-overflow-tooltip />

          <el-table-column label="异常信息" align="center" type="expand" width="100">
            <template #default="{ row }">
              <div class="exception-info" v-if="row.exceptionInfo">
                <pre>{{ row.exceptionInfo }}</pre>
              </div>
              <div v-else style="text-align: center; padding: 10px; color: #999;">无异常信息</div>
            </template>
          </el-table-column>

          <el-table-column label="开始时间" align="center" width="180">
            <template #default="{ row }">
              {{ transTime(row.startTime) }}
            </template>
          </el-table-column>

          <el-table-column label="结束时间" align="center" width="180">
            <template #default="{ row }">
              {{ transTime(row.endTime) }}
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
  </div>
</template>

<script setup lang="ts">
import { transTime } from '@/utils/util.ts'
import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import { useSearchParams } from '@/composables/useSearchParams'
import { reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import { getJobLogListApi, batchDeleteJobLogApi, cleanJobLogApi } from './service'
import type { JobLogListType } from './job.type'

const { getDictOptions, getDictLabel } = useDict()

const jobLogStatusOptions = ref<SelectOptionItem[]>([])
getDictOptions('jobLogStatus').then((res) => { jobLogStatusOptions.value = res })

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
  startTime: undefined,
  endTime: undefined,
  current: 1,
  pageSize: 20,
}

const searchForm = reactive({ ...initialSearchForm })
const timeRange = ref<[string, string] | null>(null)

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

const tableData = ref<JobLogListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runQuery } = useRequest(
  () => getJobLogListApi(searchForm as any),
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

// 批量删除
const selectedIds = ref<number[]>([])

const handleSelectionChange = (selection: JobLogListType[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

const { runAsync: runBatchDelete } = useRequest(batchDeleteJobLogApi, { manual: true })

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
const { runAsync: runClean } = useRequest(cleanJobLogApi, { manual: true })

const handleClean = () => {
  ElMessageBox.confirm('确定清空所有任务日志吗？此操作不可恢复！', '警告', {
    type: 'warning',
  }).then(async () => {
    await runClean()
    ElMessage.success('清空成功')
    runQuery()
  })
}
</script>

<style scoped lang="scss">
.job-log-container {
}

.exception-info {
  padding: 10px 20px;

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    color: #f56c6c;
    font-size: 13px;
  }
}
</style>
