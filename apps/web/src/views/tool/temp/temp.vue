<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form :model="searchTempForm" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="模板名称">
              <el-input
                v-model="searchTempForm.name"
                placeholder="请输入模板名称"
                clearable
                @keyup.enter="onTempSearch"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item label="模板Code">
              <el-input
                v-model="searchTempForm.code"
                placeholder="请输入模板Code"
                clearable
                @keyup.enter="onTempSearch"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onTempSearch">搜索</el-button>
              <el-button plain @click="onTempReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button type="primary" :icon="Plus" @click="addTemp">新增</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="!selectedTempIds.length"
          @click="delTemps(DeleteEnum.Multiple)"
        >
          批量删除
        </el-button>
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table :data="tableData" border row-key="id" @selection-change="tempSelectionChange">
          <el-table-column type="selection" width="55" align="center" />

          <el-table-column label="模板名称" align="center" prop="name" />

          <el-table-column label="模板Code" align="center" prop="code" />

          <el-table-column label="模板路径" align="center" prop="tempPath" />

          <el-table-column label="创建人" align="center" prop="createBy" />
          <el-table-column prop="createAt" label="创建时间">
            <template #default="scope">
              {{ transTime(scope.row.createAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110">
            <template #default="scope">
              <el-button type="primary" link @click="updateTemp(scope.row)">修改</el-button>
              <el-button type="danger" link @click="delTemps(DeleteEnum.Single, scope.row)"
                >删除</el-button
              >
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
          v-model:current-page="searchTempForm.current"
          v-model:page-size="searchTempForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <temp-dialog
      :action="action"
      :loading="actionLoading"
      :detailLoading="detailLoading"
      :current="currentTemp"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="runActionTemp"
    />
  </div>
</template>
<script setup lang="ts">
import { ActionEnum, DeleteEnum } from '@/enums/common.ts'
import { transTime } from '@/utils/util.ts'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import {
  addTempApi,
  deleteTempApi,
  deleteTempApis,
  getTempApi,
  getTempOneApi,
  updateTempApi,
} from './service'
import type { CreateTempType, TempListType, UpdateTempType } from './temp.type'
import TempDialog from './TempDialog.vue'

const searchSpan = ref({
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
})

const searchTempForm = ref({
  name: '',
  code: '',
  current: 1,
  pageSize: 20,
})

const onTempSearch = () => {
  searchTempForm.value.current = 1
  runGetTemp()
}

const onTempReset = () => {
  searchTempForm.value = {
    name: '',
    code: '',
    current: 1,
    pageSize: 20,
  }
  runGetTemp()
}

const tableData = ref<TempListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetTemp } = useRequest(
  () => {
    return getTempApi({
      ...searchTempForm.value,
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
  runGetTemp()
}

const handleCurrentChange = () => {
  runGetTemp()
}

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)

const addTemp = () => {
  action.value = ActionEnum.Add
  currentTemp.value = undefined
  visible.value = true
}

const cancelDialog = () => {}

const { loading: actionLoading, run: runActionTemp } = useRequest(
  (values: CreateTempType | UpdateTempType) => {
    if (action.value === ActionEnum.Add) {
      return addTempApi(values as CreateTempType)
    }
    return updateTempApi(values as UpdateTempType)
  },
  {
    loadingKeep: 500,
    onSuccess: (res) => {
      visible.value = false
      const message = action.value === ActionEnum.Add ? '新增模板成功' : '修改模板成功'
      ElMessage.success(message)
      window.location.reload()
    },
  },
)
const currentTemp = ref<TempListType | undefined>(undefined)
const { loading: detailLoading, run: runGetTempOne } = useRequest(getTempOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentTemp.value = res.data
  },
})

const updateTemp = (row: TempListType) => {
  action.value = ActionEnum.Edit
  visible.value = true
  runGetTempOne(row.id)
}

const { runAsync: runDeleteTemps } = useRequest(
  (action: DeleteEnum, ids: string[]) => {
    if (action === DeleteEnum.Single) {
      return deleteTempApi(ids[0] as string)
    }
    return deleteTempApis(ids)
  },
  {
    loadingKeep: 500,
  },
)

const delTemps = (action: DeleteEnum, row?: TempListType) => {
  let message = '此操作将永久删除该模板, 是否继续?'
  let ids: string[] = []
  if (action === DeleteEnum.Single && row != undefined) {
    ids = [row.id]
  }
  if (action === DeleteEnum.Multiple) {
    message = `此操作将永久批量删除当前${selectedTempIds.value.length}个模板, 是否继续?`
    ids = selectedTempIds.value
  }
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (act, instance, done) => {
      if (act === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteTemps(action, ids)
          .then(() => {
            selectedTempIds.value = []
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
    runGetTemp()
  })
}

const selectedTempIds = ref<string[]>([])
const tempSelectionChange = (temps: TempListType[]) => {
  selectedTempIds.value = temps.map((temp) => temp.id)
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
