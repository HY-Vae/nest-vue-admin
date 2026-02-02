<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import Icon from '@/components/icon/icon.vue'

const props = defineProps({
  icons: {
    type: Array as PropType<string[]>,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})
const activeIcon = defineModel({ required: true })

const emits = defineEmits(['searchIcons'])

const pageSize = ref(30)
const current = ref(1)
const searchKey = ref('')

const paginatedIcons = computed(() => {
  const start = (current.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.icons.slice(start, end)
})

const changeKey = () => {
  current.value = 1
  emits('searchIcons', searchKey.value)
}
</script>

<template>
  <div>
    <el-input v-model="searchKey" placeholder="请输入图标名称" @input="changeKey" />
    <div class="icon-grid">
      <Icon
        :icon="icon"
        :size="24"
        v-for="icon in paginatedIcons"
        :key="icon"
        @click="activeIcon = icon"
      />
    </div>
    <el-pagination
      layout="prev, pager, next"
      hide-on-single-page
      :page-size="pageSize"
      v-model:current-page="current"
      :total="total"
      size="small"
    />
  </div>
</template>

<style scoped lang="less">
.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  padding: 12px 0;
}
</style>
