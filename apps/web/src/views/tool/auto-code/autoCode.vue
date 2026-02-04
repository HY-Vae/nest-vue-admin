<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form :model="searchAutoCodeForm" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="模块code" prop="name">
              <el-input
                v-model="searchAutoCodeForm.name"
                placeholder="请输入模块code"
                clearable
                style="width: 200px"
                @keyup.enter="onAutoCodeSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="模块中文名称" prop="nameZh">
              <el-input
                v-model="searchAutoCodeForm.nameZh"
                placeholder="请输入模块中文名称"
                clearable
                style="width: 200px"
                @keyup.enter="onAutoCodeSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item label="模板目录" prop="tempId">
              <el-input
                v-model="searchAutoCodeForm.tempId"
                placeholder="请输入模板目录"
                clearable
                style="width: 200px"
                @keyup.enter="onAutoCodeSearch"
              />
            </el-form-item>
          </el-col>

          <el-col v-bind="searchSpan">
            <el-form-item>
              <el-button type="primary" plain @click="onAutoCodeSearch">搜索</el-button>
              <el-button plain @click="onAutoCodeReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar"> </el-row>
      <div class="table-main" v-loading="queryLoading">
        <el-table :data="tableData" border row-key="id">
          <el-table-column label="模块code" align="center" prop="name" />

          <el-table-column label="模块中文名称" align="center" prop="nameZh" />

          <el-table-column label="Prisma 表名" align="center" prop="modelName" />

          <el-table-column label="Web目录" align="center" prop="webPath" />

          <el-table-column label="模板目录" align="center" prop="tempId" />

          <el-table-column label="路由地址" align="center" prop="routePath" />

          <el-table-column label="创建人" align="center" prop="createBy" />

          <el-table-column label="创建时间" align="center" width="180">
            <template #default="scope">
              <span>{{ transTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="110">
            <template #default="scope">
              <el-button
                type="danger"
                v-auth="'tool:auto-code:remove'"
                link
                @click="delAutoCodes(scope.row)"
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
          v-model:current-page="searchAutoCodeForm.current"
          v-model:page-size="searchAutoCodeForm.pageSize"
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
import type { AutoCodeListType } from './autoCode.type'
import { deleteAutoCodeApi, getAutoCodeApi } from './service'

const searchSpan = ref({
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
})

const searchAutoCodeForm = ref({
  name: undefined,
  nameZh: undefined,
  tempId: undefined,
  current: 1,
  pageSize: 20,
})

const onAutoCodeSearch = () => {
  searchAutoCodeForm.value.current = 1
  runGetAutoCode()
}

const onAutoCodeReset = () => {
  searchAutoCodeForm.value = {
    name: undefined,
    nameZh: undefined,
    tempId: undefined,
    current: 1,
    pageSize: 20,
  }
  runGetAutoCode()
}

const tableData = ref<AutoCodeListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetAutoCode } = useRequest(
  () => {
    return getAutoCodeApi({
      ...searchAutoCodeForm.value,
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
  runGetAutoCode()
}

const handleCurrentChange = () => {
  runGetAutoCode()
}

const { runAsync: runDeleteAutoCodes } = useRequest(deleteAutoCodeApi, {
  loadingKeep: 500,
})

const delAutoCodes = (row: AutoCodeListType) => {
  let message = '此操作将永久删除该生成列表, 是否继续?'
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteAutoCodes(row.id)
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
    runGetAutoCode()
  })
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
