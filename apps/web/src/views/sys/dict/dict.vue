<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form
        :model="searchDictForm"
        class="demo-form-inline"
        @keydown.enter="onDictSearch"
        @submit.prevent
      >
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="字典名称">
              <el-input v-model="searchDictForm.name" placeholder="请输入字典名称" clearable />
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item label="字典状态">
              <el-select v-model="searchDictForm.status" placeholder="请选择字典状态" clearable>
                <el-option
                  v-for="item in enableStatusOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onDictSearch">搜索</el-button>
              <el-button plain @click="onDictReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button type="primary" :icon="Plus" v-auth="'sys:dict:create'" @click="addDict"
          >新增</el-button
        >
      </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table :data="tableData" border row-key="id">
          <el-table-column type="index" align="center" label="序号" />
          <el-table-column prop="name" align="center" label="字典名称" />
          <el-table-column prop="code" align="center" label="字典值">
            <template #default="scope">
              <el-button type="primary" link @click="gotoDetail(scope.row)">{{
                scope.row.code
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="字典状态">
            <template #default="scope">
              {{ getDictLabel(enableStatusOptions, scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sort" label="排序" />
          <el-table-column align="center" prop="createBy" label="创建人" />
          <el-table-column prop="createdAt" align="center" label="创建时间">
            <template #default="scope">
              {{ transTime(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" align="center" label="备注" />
          <el-table-column label="操作" align="center" width="110">
            <template #default="scope">
              <el-button
                type="primary"
                v-auth="'sys:dict:update'"
                link
                @click="updateDict(scope.row)"
                >修改</el-button
              >
              <el-button type="danger" v-auth="'sys:dict:remove'" link @click="delDicts(scope.row)"
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
          v-model:current-page="searchDictForm.current"
          v-model:page-size="searchDictForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <dict-dialog
      :action="action"
      :loading="actionLoading"
      :detailLoading="detailLoading"
      :current="currentDict"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="runActionDict"
    />
  </div>
</template>
<script setup lang="ts">
import { ActionEnum } from '@/enums/common.ts'
import { useDict } from '@/hooks/dict.hook.ts'
import router from '@/router'
import type { SelectOptionItem } from '@/types/global.ts'
import { transTime } from '@/utils/util.ts'
import type { CreateDictType, DictListType, UpdateDictType } from '@/views/sys/dict/dict.type'
import DictDialog from '@/views/sys/dict/DictDialog.vue'
import { Plus } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import { addDictApi, deleteDictApi, getDictApi, getDictOneApi, updateDictApi } from './service.ts'
import { useSearchParams } from '@/composables/useSearchParams'

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

// 初始搜索条件
const initialSearchForm = {
  name: '',
  status: '',
  current: 1,
  pageSize: 20,
}

const searchDictForm = reactive({ ...initialSearchForm })

// 搜索条件保存恢复
const { reset: resetSearchParams } = useSearchParams(searchDictForm)

const onDictSearch = () => {
  searchDictForm.current = 1
  runGetDict()
}

const onDictReset = () => {
  resetSearchParams(initialSearchForm)
  runGetDict()
}

const tableData = ref<DictListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetDict } = useRequest(
  () => {
    return getDictApi({
      ...searchDictForm,
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
  runGetDict()
}

const handleCurrentChange = () => {
  runGetDict()
}

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)

const addDict = () => {
  action.value = ActionEnum.Add
  currentDict.value = undefined
  visible.value = true
}

const cancelDialog = () => {}

const { loading: actionLoading, run: runActionDict } = useRequest(
  (values: CreateDictType | UpdateDictType) => {
    if (action.value === ActionEnum.Add) {
      return addDictApi(values as CreateDictType)
    }
    return updateDictApi(values as UpdateDictType)
  },
  {
    loadingKeep: 500,
    onSuccess: (res) => {
      visible.value = false
      const message = action.value === ActionEnum.Add ? '新增字典成功' : '修改字典成功'
      ElMessage.success(message)
      runGetDict()
    },
  },
)
const currentDict = ref<DictListType | undefined>(undefined)
const { loading: detailLoading, run: runGetDictOne } = useRequest(getDictOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentDict.value = res.data
  },
})

const updateDict = (row: DictListType) => {
  action.value = ActionEnum.Edit
  visible.value = true
  runGetDictOne(row.code)
}

const { runAsync: runDeleteDict } = useRequest(deleteDictApi, {
  loadingKeep: 500,
})

const delDicts = (row: DictListType) => {
  let message = '此操作将永久删除该字典, 是否继续?'
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteDict(row.code)
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
    runGetDict()
  })
}

const gotoDetail = (row: DictListType) => {
  router.push({
    name: 'dict-detail',
    params: {
      code: row.code,
    },
  })
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
