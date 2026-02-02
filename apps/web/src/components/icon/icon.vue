<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 30,
  },
})
</script>

<template>
  <Icon :icon="icon" :style="{ fontSize: size + 'px' }" v-bind="$attrs" />
</template>

<style scoped></style>
