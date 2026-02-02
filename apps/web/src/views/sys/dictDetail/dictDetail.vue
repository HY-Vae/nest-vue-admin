<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form :model="searchDictDetailForm" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="字典名称">
              <el-input
                v-model="searchDictDetailForm.label"
                placeholder="请输入字典名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item label="字典状态">
              <el-select
                v-model="searchDictDetailForm.status"
                placeholder="请选择字典状态"
                clearable
              >
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
              <el-button type="primary" plain @click="onDictDetailSearch">搜索</el-button>
              <el-button plain @click="onDictDetailReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button type="primary" :icon="Plus" @click="addDictDetail">新增</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="!selectedDictDetailIds.length"
          @click="delDictDetails(DeleteEnum.Multiple)"
        >
          批量删除
        </el-button>
      </el-row>
      <div class="table-main">
        <el-table
          :data="tableData"
          v-loading="queryLoading"
          border
          row-key="id"
          @selection-change="dictDetailSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" />
          <el-table-column prop="label" label="字典名称" />
          <el-table-column prop="value" label="字典值" />
          <el-table-column label="字典状态">
            <template #default="scope">
              {{ getDictLabel(enableStatusOptions, scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" />
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="createAt" label="创建时间">
            <template #default="scope">
              {{ transTime(scope.row.createAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" width="110">
            <template #default="scope">
              <el-button type="primary" link @click="updateDictDetail(scope.row)">修改</el-button>
              <el-button type="danger" link @click="delDictDetails(DeleteEnum.Single, scope.row)"
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
          v-model:current-page="searchDictDetailForm.current"
          v-model:page-size="searchDictDetailForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <dictDetail-dialog
      :action="action"
      :loading="actionLoading"
      :detailLoading="detailLoading"
      :current="currentDictDetail"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="runActionDictDetail"
    />
  </div>
</template>
<script setup lang="ts">
import {
  addDictDetailApi,
  deleteDictDetailApi,
  getDictDetailApi,
  getDictDetailOneApi,
  updateDictDetailApi,
} from '@/api/dictDetail.ts'
import { ActionEnum, DeleteEnum } from '@/enums/common.ts'
import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import { transTime } from '@/utils/util.ts'
import type {
  CreateDictDetailType,
  DictDetailListType,
  UpdateDictDetailType,
} from '@/views/sys/dictDetail/dictDetail.type'
import DictDetailDialog from '@/views/sys/dictDetail/DictDetailDialog.vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'

const { getDictOptions, getDictLabel } = useDict()

const enableStatusOptions = ref<SelectOptionItem[]>([])
getDictOptions('enableStatus').then((res) => {
  enableStatusOptions.value = res
})

const route = useRoute()

const searchSpan = ref({
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
})

const searchDictDetailForm = ref({
  label: '',
  status: '',
  current: 1,
  pageSize: 20,
})

const onDictDetailSearch = () => {
  searchDictDetailForm.value.current = 1
  runGetDictDetail()
}

const onDictDetailReset = () => {
  searchDictDetailForm.value = {
    label: '',
    status: '',
    current: 1,
    pageSize: 20,
  }
  runGetDictDetail()
}

const tableData = ref<DictDetailListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetDictDetail } = useRequest(
  () => {
    return getDictDetailApi({
      ...searchDictDetailForm.value,
      sysDictCode: route.params.code as string,
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
  runGetDictDetail()
}

const handleCurrentChange = () => {
  runGetDictDetail()
}

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)

const addDictDetail = () => {
  action.value = ActionEnum.Add
  currentDictDetail.value = undefined
  visible.value = true
}

const cancelDialog = () => {}

const { loading: actionLoading, run: runActionDictDetail } = useRequest(
  (values: CreateDictDetailType | UpdateDictDetailType) => {
    if (action.value === ActionEnum.Add) {
      values.sysDictCode = route.params.code as string
      return addDictDetailApi(values as CreateDictDetailType)
    }
    return updateDictDetailApi(values as UpdateDictDetailType)
  },
  {
    loadingKeep: 500,
    onSuccess: (res) => {
      visible.value = false
      const message = action.value === ActionEnum.Add ? '新增字典成功' : '修改字典成功'
      ElMessage.success(message)
      runGetDictDetail()
    },
  },
)
const currentDictDetail = ref<DictDetailListType | undefined>(undefined)
const { loading: detailLoading, run: runGetDictDetailOne } = useRequest(getDictDetailOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentDictDetail.value = res.data
  },
})

const updateDictDetail = (row: DictDetailListType) => {
  action.value = ActionEnum.Edit
  visible.value = true
  runGetDictDetailOne(row.id)
}

const { runAsync: runDeleteDictDetail } = useRequest(deleteDictDetailApi, {
  loadingKeep: 500,
})

const delDictDetails = (action: DeleteEnum, row?: DictDetailListType) => {
  let message = '此操作将永久删除该字典, 是否继续?'
  let ids: string[] = []
  if (action === DeleteEnum.Single && row != undefined) {
    ids = [row.id]
  }
  if (action === DeleteEnum.Multiple) {
    message = `此操作将永久批量删除当前${selectedDictDetailIds.value.length}个字典, 是否继续?`
    ids = selectedDictDetailIds.value
  }
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteDictDetail(ids)
          .then(() => {
            selectedDictDetailIds.value = []
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
    runGetDictDetail()
  })
}

const selectedDictDetailIds = ref<string[]>([])
const dictDetailSelectionChange = (dictDetails: DictDetailListType[]) => {
  selectedDictDetailIds.value = dictDetails.map((dictDetail) => dictDetail.id)
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
