<template>
  <div class="page-container sysActionLog-container">
    <el-card class="search-bar">
      <el-form
        :model="searchSysActionLogForm"
        :label-width="searchlabelWith"
        @keydown.enter="onSysActionLogSearch"
        @submit.prevent
      >
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model.trim="searchSysActionLogForm.title"
                placeholder="请输入标题"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="操作类型" prop="action">
              <el-input
                v-model.trim="searchSysActionLogForm.action"
                placeholder="请输入操作类型"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="IP" prop="ip">
              <el-input
                v-model.trim="searchSysActionLogForm.ip"
                placeholder="请输入IP"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="地址" prop="address">
              <el-input
                v-model.trim="searchSysActionLogForm.address"
                placeholder="请输入地址"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="姓名" prop="userName">
              <el-input
                v-model.trim="searchSysActionLogForm.userName"
                placeholder="请输入姓名"
                clearable
                style="width: 200px"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="searchSysActionLogForm.status"
                placeholder="请选择状态"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="dict in requestStatusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onSysActionLogSearch">搜索</el-button>
              <el-button plain @click="onSysActionLogReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar"> </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table :data="tableData" border row-key="id">
          <el-table-column label="标题" align="center" prop="title" />

          <el-table-column label="操作类型" align="center" prop="action" />

          <el-table-column label="请求方式" align="center" prop="method" />

          <el-table-column label="IP" align="center" prop="ip" />

          <el-table-column label="地址" align="center" prop="address" />

          <el-table-column label="用户ID" align="center" prop="userId" />

          <el-table-column label="姓名" align="center" prop="userName" />

          <el-table-column label="请求参数" align="center" prop="params" show-overflow-tooltip />

          <el-table-column label="响应结果" align="center" prop="result" show-overflow-tooltip />

          <el-table-column label="错误信息" align="center" prop="errorInfo" show-overflow-tooltip />

          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              {{ getDictLabel(requestStatusOptions, scope.row.status) }}
            </template>
          </el-table-column>

          <el-table-column label="创建人" align="center" prop="createBy" />

          <el-table-column label="创建时间" align="center" width="180">
            <template #default="scope">
              <span>{{ transTime(scope.row.createdAt) }}</span>
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
          v-model:current-page="searchSysActionLogForm.current"
          v-model:page-size="searchSysActionLogForm.pageSize"
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
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import { getSysActionLogApi } from './service'
import type { SysActionLogListType } from './sysActionLog.type'

import { useDict } from '@/hooks/dict.hook'
import type { SelectOptionItem } from '@/types/global'

const { getDictOptions, getDictLabel } = useDict()

const requestStatusOptions = ref<SelectOptionItem[]>([])
getDictOptions('requestStatus').then((res) => {
  requestStatusOptions.value = res
})

const searchlabelWith = ref(80)

const searchSpan = ref({
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
})

const searchSysActionLogForm = ref({
  title: undefined,
  action: undefined,
  ip: undefined,
  address: undefined,
  userName: undefined,
  status: undefined,

  current: 1,
  pageSize: 20,
})

const onSysActionLogSearch = () => {
  searchSysActionLogForm.value.current = 1
  runGetSysActionLog()
}

const onSysActionLogReset = () => {
  searchSysActionLogForm.value = {
    title: undefined,
    action: undefined,
    ip: undefined,
    address: undefined,
    userName: undefined,
    status: undefined,

    current: 1,
    pageSize: 20,
  }
  runGetSysActionLog()
}

const tableData = ref<SysActionLogListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetSysActionLog } = useRequest(
  () => {
    return getSysActionLogApi({
      ...searchSysActionLogForm.value,
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
  runGetSysActionLog()
}

const handleCurrentChange = () => {
  runGetSysActionLog()
}
</script>
<style scoped lang="scss">
.sysActionLog-container {
}
</style>
