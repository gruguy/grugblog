<template>
  <div class="slide-captcha">
    <div
      ref="trackRef"
      class="captcha-track"
      :class="{ success: isSuccess, loading: isLoading }"
    >
      <div
        ref="blockRef"
        class="captcha-block"
        :style="{
          left: `${blockLeft}px`,
          transition: isDragging ? 'none' : 'left 0.3s ease-out'
        }"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div
        class="captcha-bg"
        :style="{ width: `${blockLeft}px` }"
      ></div>
      <span v-if="!isSuccess && !isLoading" class="captcha-text">请拖动滑块完成验证</span>
      <span v-else-if="isLoading" class="captcha-text">验证中...</span>
      <span v-else class="captcha-text success-text">验证成功</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const emit = defineEmits<{
  (e: "success", token: string): void;
  (e: "error"): void;
}>();

const trackRef = ref<HTMLElement | null>(null);
const blockRef = ref<HTMLElement | null>(null);
const blockLeft = ref(0);
const isDragging = ref(false);
const isSuccess = ref(false);
const isLoading = ref(false);
const startX = ref(0);
const startLeft = ref(0);
const captchaToken = ref("");

const TRACK_WIDTH = 300;
const BLOCK_WIDTH = 44;

const generateToken = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  if (isSuccess.value || isLoading.value) return;
  
  isDragging.value = true;
  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  startX.value = clientX;
  startLeft.value = blockLeft.value;
  
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("touchend", stopDrag);
};

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  
  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  const diff = clientX - startX.value;
  const newLeft = Math.max(0, Math.min(startLeft.value + diff, TRACK_WIDTH - BLOCK_WIDTH));
  blockLeft.value = newLeft;
};

const stopDrag = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
  
  if (blockLeft.value >= TRACK_WIDTH - BLOCK_WIDTH - 5) {
    isLoading.value = true;
    captchaToken.value = generateToken();
    setTimeout(() => {
      isSuccess.value = true;
      isLoading.value = false;
      emit("success", captchaToken.value);
    }, 500);
  } else {
    blockLeft.value = 0;
    emit("error");
  }
};

const reset = () => {
  isSuccess.value = false;
  isLoading.value = false;
  blockLeft.value = 0;
  captchaToken.value = "";
};

defineExpose({ reset });

onUnmounted(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
});
</script>

<style scoped>
.slide-captcha {
  width: 100%;
  padding: 0 6px;
}

.captcha-track {
  position: relative;
  width: 100%;
  height: 44px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #ddd;
}

.captcha-track.success {
  border-color: #22c55e;
  background: #f0fdf4;
}

.captcha-track.loading {
  border-color: #3b82f6;
  background: #eff6ff;
}

.captcha-block {
  position: absolute;
  top: -1px;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.captcha-block:active {
  cursor: grabbing;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: white;
}

.captcha-bg {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-radius: 4px 0 0 4px;
  transition: width 0.1s linear;
}

.captcha-text {
  position: relative;
  z-index: 5;
  color: #666;
  font-size: 14px;
  user-select: none;
}

.success-text {
  color: #22c55e;
  font-weight: 500;
}
</style>
