<script setup lang="ts">
import type { ColumnConfig, ColumnFormat } from '@/types/global.ts'
import request from '@/utils/request.ts'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'

export interface ExportField {
  key: string
  label: string
  format?: ColumnFormat
}

const props = defineProps<{
  visible: boolean
  columns: ColumnConfig[]
  exportUrl: string
  searchParams?: Record<string, unknown>
  filename?: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const loading = ref(false)

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const allFields = computed(() =>
  props.columns
    .filter((col) => col.exportable !== false)
    .map((col) => ({
      key: col.key,
      label: col.label,
      format: col.format,
    })),
)

const selectedFields = ref<ExportField[]>([])
const unselectedFields = ref<ExportField[]>([])

const onOpen = () => {
  selectedFields.value = allFields.value.map((f) => ({ ...f }))
  unselectedFields.value = []
}

// 上方已选标签点击 → 移除
const deselectFromTop = (key: string) => {
  const idx = selectedFields.value.findIndex((f) => f.key === key)
  if (idx !== -1) {
    unselectedFields.value.push(selectedFields.value.splice(idx, 1)[0]!)
  }
}

// 上方未选标签点击 → 添加
const selectFromTop = (key: string) => {
  const idx = unselectedFields.value.findIndex((f) => f.key === key)
  if (idx !== -1) {
    selectedFields.value.push(unselectedFields.value.splice(idx, 1)[0]!)
  }
}

// 全选
const selectAll = () => {
  selectedFields.value.push(...unselectedFields.value)
  unselectedFields.value = []
}

// 下方移除
const removeField = (index: number) => {
  unselectedFields.value.push(selectedFields.value.splice(index, 1)[0]!)
}

const handleExport = async () => {
  if (selectedFields.value.length === 0) {
    ElMessage.warning('请至少选择一个导出字段')
    return
  }

  loading.value = true
  try {
    const res = await request(props.exportUrl, {
      method: 'POST',
      data: { fields: selectedFields.value },
      params: props.searchParams,
      responseType: 'blob',
    })

    const blob = new Blob([res as unknown as BlobPart], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${props.filename || '导出数据'}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)

    dialogVisible.value = false
    ElMessage.success('导出成功')
  } catch {
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="导出数据" width="520px" @open="onOpen">
    <div class="section">
      <div class="section-bar">
        <span class="section-title">选择字段</span>
        <span class="section-info">
          {{ selectedFields.length }}/{{ allFields.length }}
          <el-button
            v-if="unselectedFields.length > 0"
            link
            type="primary"
            size="small"
            @click="selectAll"
            >全选</el-button
          >
        </span>
      </div>
      <div class="tag-wrap">
        <!-- 已选：静态标签，点击取消选择 -->
        <div
          v-for="field in selectedFields"
          :key="field.key"
          class="tag on"
          @click="deselectFromTop(field.key)"
        >
          {{ field.label }}
        </div>
        <!-- 未选：可拖拽到下方 或 点击添加 -->
        <draggable
          v-model="unselectedFields"
          :group="{ name: 'export', put: true }"
          item-key="key"
          class="drag-inline"
          ghost-class="tag-ghost"
          :sort="false"
        >
          <template #item="{ element }">
            <div class="tag off drag-source" @click="selectFromTop(element.key)">
              {{ element.label }}
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <div class="section">
      <div class="section-bar">
        <span class="section-title">导出顺序</span>
        <span class="section-info">拖拽排序</span>
      </div>

      <div v-if="selectedFields.length === 0" class="empty">从上方拖拽或点击字段添加</div>

      <draggable
        v-else
        v-model="selectedFields"
        :group="{ name: 'export', put: true }"
        item-key="key"
        class="tag-wrap order"
        ghost-class="tag-ghost"
        handle=".drag-handle"
      >
        <template #item="{ element, index }">
          <div class="tag order-tag">
            <span class="drag-handle">⠿</span>
            <span class="seq">{{ index + 1 }}</span>
            <span>{{ element.label }}</span>
            <span class="del" @click.stop="removeField(index)">×</span>
          </div>
        </template>
      </draggable>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleExport">
        {{ loading ? '导出中...' : '确认导出' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.section {
  & + & {
    margin-top: 14px;
  }
}

.section-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
}

.section-info {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: flex-start;
}

.drag-inline {
  display: contents;
}

.tag {
  padding: 3px 10px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s;

  &.on {
    background: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
    color: var(--el-color-primary);
  }

  &.off {
    background: var(--el-fill-color);
    color: var(--el-text-color-placeholder);
  }

  &.drag-source {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &:hover {
    opacity: 0.75;
  }
}

.order {
  min-height: 32px;
}

.order-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  cursor: default;

  .drag-handle {
    cursor: grab;
    color: var(--el-text-color-placeholder);
    font-size: 12px;
    letter-spacing: -1px;

    &:active {
      cursor: grabbing;
    }
  }

  .seq {
    font-size: 11px;
    font-weight: 600;
    color: var(--el-color-primary);
  }

  .del {
    cursor: pointer;
    color: var(--el-text-color-placeholder);
    font-size: 13px;

    &:hover {
      color: var(--el-color-danger);
    }
  }
}

.tag-ghost {
  opacity: 0.3;
}

.empty {
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-placeholder);
}
</style>
