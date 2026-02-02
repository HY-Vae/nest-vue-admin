<script lang="ts" setup>
import { fieldTypeOptions, formItemTypeOptions, searchTypeOptions } from '@/views/tool/gen/constant'
import { nextTick, type PropType } from 'vue'
import Sortable from 'sortablejs'
import { Grid } from '@element-plus/icons-vue'
import type { SelectOptionItem } from '@/types/global.ts'
import type { BaseFieldType } from '@/views/tool/gen/gen.type'

const props = defineProps({
  fieldsTableData: {
    type: Array,
    default: () => [],
  },
  dictTypeOptions: {
    type: Array as PropType<SelectOptionItem[]>,
    default: () => [],
  },
})
const emit = defineEmits(['update', 'delete', 'copy'])

const handleUpdate = (row: BaseFieldType, index: number) => {
  emit('update', row, index)
}

const handleDelete = (index: number) => {
  emit('delete', index)
}

const handleCopy = (row: BaseFieldType) => {
  emit('copy', row)
}

const rowDrop = async (event: DragEvent) => {
  event.preventDefault()
  await nextTick()
  const wrapper = document.querySelector('.drag-field-table tbody') as HTMLElement
  if (wrapper) {
    Sortable.create(wrapper, {
      animation: 300,
      handle: '.drag-btn',
      onEnd: async (e: Sortable.SortableEvent) => {
        const { oldIndex, newIndex } = e
        const currentRow = props.fieldsTableData.splice(oldIndex as number, 1)[0]
        props.fieldsTableData.splice(newIndex as number, 0, currentRow)
      },
    })
  }
}
</script>

<template>
  <el-table ref="dragTable" :data="fieldsTableData" row-key="name" class="drag-field-table">
    <el-table-column width="80" label="排序" align="center">
      <template #default>
        <el-icon class="drag-btn cursor-grab" @mouseenter="rowDrop"><Grid /></el-icon>
      </template>
    </el-table-column>
    <el-table-column label="序号" type="index" min-width="5%" />
    <el-table-column label="字段Code" prop="name" min-width="10%" :show-overflow-tooltip="true" />
    <el-table-column label="字段中文名" min-width="10%">
      <template #default="scope">
        <el-input v-model="scope.row.nameCh"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="字段类型" min-width="11%">
      <template #default="scope">
        <el-select v-model="scope.row.type">
          <el-option
            v-for="item in fieldTypeOptions"
            :value="item.value"
            :key="item.value"
            :label="item.label"
          />
        </el-select>
      </template>
    </el-table-column>

    <el-table-column label="新增/编辑" min-width="5%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.isAdd"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column label="列表" min-width="5%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.isShowTable"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column label="查询" min-width="5%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.isSearch"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column label="查询方式" min-width="10%">
      <template #default="scope">
        <el-select v-model="scope.row.searchType">
          <el-option
            v-for="item in searchTypeOptions"
            :value="item.value"
            :key="item.value"
            :label="item.label"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="必填" min-width="5%">
      <template #default="scope">
        <el-checkbox v-model="scope.row.isRequired"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column label="显示类型" min-width="12%">
      <template #default="scope">
        <el-select v-model="scope.row.formItemType">
          <el-option
            v-for="item in formItemTypeOptions"
            :value="item.value"
            :key="item.value"
            :label="item.label"
          />
        </el-select>
      </template>
    </el-table-column>
    <!--    <el-table-column label="字典表" min-width="12%">-->
    <!--      <template #default="scope">-->
    <!--        <el-select v-model="scope.row.dictCode" clearable filterable placeholder="请选择">-->
    <!--          <el-option-->
    <!--            v-for="item in dictTypeOptions"-->
    <!--            :label="item.label"-->
    <!--            :value="item.value"-->
    <!--            :key="item.value"-->
    <!--          />-->
    <!--        </el-select>-->
    <!--      </template>-->
    <!--    </el-table-column>-->
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button link type="primary" @click="handleCopy(scope.row)" v-auth="['tool:temp:edit']"
          >拷贝</el-button
        >
        <el-button
          link
          type="primary"
          @click="handleUpdate(scope.row, scope.$index)"
          v-auth="['tool:temp:edit']"
          >修改</el-button
        >
        <el-button
          link
          type="primary"
          @click="handleDelete(scope.$index)"
          v-auth="['tool:temp:remove']"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
:deep(.cursor-grab) {
  cursor: move;
}
</style>
