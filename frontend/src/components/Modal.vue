<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
  >
    <div
      class="bg-card border border-border rounded-lg shadow-xl w-full max-w-md"
      @click.stop
    >
      <!-- 头部 -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button
          @click="handleClose"
          class="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      
      <!-- 内容 -->
      <div class="p-6">
        <slot></slot>
      </div>
      
      <!-- 底部 -->
      <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t border-border">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

// 监听modal显示状态，控制body滚动
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      // 禁止body滚动
      document.body.style.overflow = 'hidden'
    } else {
      // 恢复body滚动
      document.body.style.overflow = ''
    }
  }
)
</script>

<style scoped>
/* 移除背景层的过渡动画 */
</style>