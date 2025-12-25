<template>
  <TransitionGroup name="message">
    <div
      v-for="message in messages"
      :key="message.id"
      class="fixed z-50 px-4 py-3 rounded-md shadow-lg"
      :class="[
        `bg-${message.type}`,
        `text-${message.type === 'success' || message.type === 'info' ? 'white' : 'foreground'}`,
        positionClasses[message.position]
      ]"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg v-if="message.type === 'success'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <svg v-else-if="message.type === 'error'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <svg v-else-if="message.type === 'warning'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ message.content }}</span>
        </div>
        <button
          @click="removeMessage(message.id)"
          class="ml-4 text-current hover:opacity-70"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface MessageItem {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  content: string
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  duration: number
}

const messages = ref<MessageItem[]>([])
let messageId = 0

const positionClasses = computed(() => ({
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4'
}))

const addMessage = (options: {
  type?: 'success' | 'error' | 'warning' | 'info'
  content: string
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  duration?: number
}) => {
  const id = ++messageId
  const message: MessageItem = {
    id,
    type: options.type || 'info',
    content: options.content,
    position: options.position || 'top-right',
    duration: options.duration || 3000
  }
  messages.value.push(message)
  
  if (message.duration > 0) {
    setTimeout(() => {
      removeMessage(id)
    }, message.duration)
  }
  
  return id
}

const removeMessage = (id: number) => {
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index > -1) {
    messages.value.splice(index, 1)
  }
}

// 导出方法
defineExpose({
  addMessage,
  removeMessage
})
</script>

<style scoped>
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.bg-success {
  background-color: #10b981;
}

.bg-error {
  background-color: #ef4444;
}

.bg-warning {
  background-color: #f59e0b;
}

.bg-info {
  background-color: #3b82f6;
}

.text-white {
  color: white;
}

.text-foreground {
  color: #1f2937;
}
</style>