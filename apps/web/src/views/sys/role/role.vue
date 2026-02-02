<template>
  <div class="page-container">
    <el-card class="search-bar">
      <el-form :model="searchRoleForm" class="demo-form-inline">
        <el-row :gutter="24">
          <el-col v-bind="searchSpan">
            <el-form-item label="角色名称">
              <el-input v-model="searchRoleForm.name" placeholder="请输入角色名称" clearable />
            </el-form-item>
          </el-col>
          <el-col v-bind="searchSpan">
            <el-form-item label="角色状态">
              <el-select v-model="searchRoleForm.status" placeholder="请选择角色状态" clearable>
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
              <el-button type="primary" plain @click="onRoleSearch">搜索</el-button>
              <el-button plain @click="onRoleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="table-container">
      <el-row class="table-bar">
        <el-button type="primary" :icon="Plus" @click="addRole">新增</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="!selectedRoleIds.length"
          @click="delRoles(DeleteEnum.Multiple)"
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
          @selection-change="roleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" />
          <el-table-column prop="name" label="角色名称" />
          <el-table-column prop="key" label="角色值" />
          <el-table-column prop="status" label="角色状态">
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
              <el-button type="primary" link @click="updateRole(scope.row)">修改</el-button>
              <el-button type="danger" link @click="delRoles(DeleteEnum.Single, scope.row)"
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
          v-model:current-page="searchRoleForm.current"
          v-model:page-size="searchRoleForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-card>
    <role-dialog
      :action="action"
      :loading="actionLoading"
      :detailLoading="detailLoading"
      :current="currentRole"
      v-model="visible"
      @cancel="cancelDialog"
      @confirm="runActionRole"
    />
  </div>
</template>
<script setup lang="ts">
import { addRoleApi, deleteRoleApi, getRoleApi, getRoleOneApi, updateRoleApi } from '@/api/role.ts'
import { ActionEnum, DeleteEnum } from '@/enums/common.ts'
import { useDict } from '@/hooks/dict.hook.ts'
import type { SelectOptionItem } from '@/types/global.ts'
import { transTime } from '@/utils/util.ts'
import type { CreateRoleType, RoleListType, UpdateRoleType } from '@/views/sys/role/role.type'
import RoleDialog from '@/views/sys/role/RoleDialog.vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRequest } from 'vue-request'

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

const searchRoleForm = ref({
  name: '',
  status: '',
  current: 1,
  pageSize: 20,
})

const onRoleSearch = () => {
  searchRoleForm.value.current = 1
  runGetRole()
}

const onRoleReset = () => {
  searchRoleForm.value = {
    name: '',
    status: '',
    current: 1,
    pageSize: 20,
  }
  runGetRole()
}

const tableData = ref<RoleListType[]>([])
const total = ref(0)

const { loading: queryLoading, run: runGetRole } = useRequest(
  () => {
    return getRoleApi({
      ...searchRoleForm.value,
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
  runGetRole()
}

const handleCurrentChange = () => {
  runGetRole()
}

const visible = ref<boolean>(false)
const action = ref<ActionEnum>(ActionEnum.Add)

const addRole = () => {
  action.value = ActionEnum.Add
  currentRole.value = undefined
  visible.value = true
}

const cancelDialog = () => {}

const { loading: actionLoading, run: runActionRole } = useRequest(
  (values: CreateRoleType | UpdateRoleType) => {
    if (action.value === ActionEnum.Add) {
      return addRoleApi(values as CreateRoleType)
    }
    return updateRoleApi(values as UpdateRoleType)
  },
  {
    loadingKeep: 500,
    onSuccess: (res) => {
      visible.value = false
      const message = action.value === ActionEnum.Add ? '新增角色成功' : '修改角色成功'
      ElMessage.success(message)
      runGetRole()
    },
  },
)
const currentRole = ref<RoleListType | undefined>(undefined)
const { loading: detailLoading, run: runGetRoleOne } = useRequest(getRoleOneApi, {
  loadingKeep: 500,
  onSuccess: (res) => {
    currentRole.value = res.data
  },
})

const updateRole = (row: RoleListType) => {
  action.value = ActionEnum.Edit
  visible.value = true
  runGetRoleOne(row.id)
}

const { runAsync: runDeleteRole } = useRequest(deleteRoleApi, {
  loadingKeep: 500,
})

const delRoles = (action: DeleteEnum, row?: RoleListType) => {
  let message = '此操作将永久删除该角色, 是否继续?'
  let ids: string[] = []
  if (action === DeleteEnum.Single && row != undefined) {
    ids = [row.id]
  }
  if (action === DeleteEnum.Multiple) {
    message = `此操作将永久批量删除当前${selectedRoleIds.value.length}个角色, 是否继续?`
    ids = selectedRoleIds.value
  }
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在删除...'
        runDeleteRole(ids)
          .then(() => {
            selectedRoleIds.value = []
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
    runGetRole()
  })
}

const selectedRoleIds = ref<string[]>([])
const roleSelectionChange = (roles: RoleListType[]) => {
  selectedRoleIds.value = roles.map((role) => role.id)
}
</script>
<style scoped lang="scss">
.page-container {
}
</style>
