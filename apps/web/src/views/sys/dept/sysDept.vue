<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form :model="searchSysDeptForm" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="部门名称" prop="deptName">
              <el-input
                v-model="searchSysDeptForm.deptName"
                placeholder="请输入部门名称"
                clearable
                style="width: 200px"
                @keyup.enter="onSysDeptSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="部门编码" prop="deptCode">
              <el-input
                v-model="searchSysDeptForm.deptCode"
                placeholder="请输入部门编码"
                clearable
                style="width: 200px"
                @keyup.enter="onSysDeptSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="启用状态" prop="status">
              <el-select
                v-model="searchSysDeptForm.status"
                placeholder="请选择启用状态"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="dict in enableStatusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onSysDeptSearch">搜索</el-button>
              <el-button plain @click="onSysDeptReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button type="primary" :icon="Plus" v-auth="['sys:dept:create']" @click="addSysDept"
          >新增</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          v-auth="['sys:dept:removes']"
          :disabled="!selectedSysDeptIds.length"
          @click="delSysDepts(DeleteEnum.Multiple)"
        >
          批量删除
        </el-button>
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table :data="tableData" border row-key="id" @selection-change="sysDeptSelectionChange">
          <el-table-column type="selection" width="55" align="center" />

          <el-table-column label="部门名称" align="center" prop="deptName" />

          <el-table-column label="部门编码" align="center" prop="deptCode" />

          <el-table-column label="启用状态" align="center" prop="status">
            <template #default="scope">
              {{ getDictLabel(enableStatusOptions, scope.row.status) }}
            </template>
          </el-table-column>

          <el-table-column label="创建人" align="center" prop="createBy" />

          <el-table-column label="创建时间" align="center" width="180">
            <template #default="scope">
              <span>{{ transTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="110">
            <template #default="scope">
              <el-button
                type="primary"
                v-auth="['sys:dept:update']"
                link
                @click="updateSysDept(scope.row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                v-auth="['sys:dept:remove']"
                link
                @click="delSysDepts(DeleteEnum.Single, scope.row)"
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
          v-model:current-page="searchSysDeptForm.current"
          v-model:page-size="searchSysDeptForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <sysDept-dialog
      :action="action"
      :loading="actionLoading"
      :detailLoading="detailLoading"
      :current="currentSysDept"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="runActionSysDept"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import {
  addSysDeptApi,
  deleteSysDeptApi,
  deleteSysDeptsApi,
  getSysDeptApi,
  getSysDeptOneApi,
  updateSysDeptApi,
} from './service.ts'
import SysDeptDialog from './SysDeptDialog.vue'
import { useRequest } from 'vue-request'
import { ActionEnum, DeleteEnum } from '@/enums/common.ts'
import type { CreateSysDeptType, SysDeptListType, UpdateSysDeptType } from './sysDept.type.ts'
import { transTime } from '@/utils/util.ts'
import router from '@/router'

import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'

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

const searchSysDeptForm = ref({
  deptName: undefined,
  deptCode: undefined,
  status: undefined,
  current: 1,
  pageSize: 20,
})

const onSysDeptSearch = () => {
  searchSysDeptForm.value.current = 1
  runGetSysDept()
}

const onSysDeptReset = () => {
  searchSysDeptForm.value = {
    deptName: undefined,
    deptCode: undefined,
    status: undefined,
    current: 1,
    pageSize: 20,
  }
  runGetSysDept()
}

const tableData = ref<SysDeptListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetSysDept } = useRequest(
  () => {
    return getSysDeptApi({
      ...searchSysDeptForm.value,
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
  runGetSysDept()
}

const handleCurrentChange = () => {
  runGetSysDept()
}

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)

const addSysDept = () => {
  action.value = ActionEnum.Add
  currentSysDept.value = undefined
  visible.value = true
}

const cancelDialog = () => {}

const { loading: actionLoading, run: runActionSysDept } = useRequest(
  (values: CreateSysDeptType | UpdateSysDeptType) => {
    if (action.value === ActionEnum.Add) {
      return addSysDeptApi(values as CreateSysDeptType)
    }
    return updateSysDeptApi(values as UpdateSysDeptType)
  },
  {
    loadingKeep: 500,
    onSuccess: (res) => {
      visible.value = false
      const message = action.value === ActionEnum.Add ? '新增部门成功' : '修改部门成功'
      ElMessage.success(message)
    },
  },
)
const currentSysDept = ref<SysDeptListType | undefined>(undefined)
const { loading: detailLoading, run: runGetSysDeptOne } = useRequest(getSysDeptOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentSysDept.value = res.data
  },
})

const updateSysDept = (row: SysDeptListType) => {
  action.value = ActionEnum.Edit
  visible.value = true
  runGetSysDeptOne(row.id)
}

const { runAsync: runDeleteSysDepts } = useRequest(deleteSysDeptsApi, {
  loadingKeep: 500,
})

const delSysDepts = (action: DeleteEnum, row?: SysDeptListType) => {
  let message = '此操作将永久删除该部门, 是否继续?'
  let ids: string[] = []
  if (action === DeleteEnum.Single && row != undefined) {
    ids = [row.id]
  }
  if (action === DeleteEnum.Multiple) {
    message = `此操作将永久批量删除当前${selectedSysDeptIds.value.length}个部门, 是否继续?`
    ids = selectedSysDeptIds.value
  }
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteSysDepts(ids)
          .then(() => {
            selectedSysDeptIds.value = []
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
    runGetSysDept()
  })
}

const selectedSysDeptIds = ref<string[]>([])
const sysDeptSelectionChange = (sysDepts: SysDeptListType[]) => {
  selectedSysDeptIds.value = sysDepts.map((sysDept) => sysDept.id)
}
</script>
<style scoped lang="scss">
.sysDept-container {
}
</style>
