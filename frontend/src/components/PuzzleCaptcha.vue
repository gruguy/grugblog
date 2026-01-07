<template>
  <div class="puzzle-captcha">
    <div class="captcha-container">
      <div class="captcha-header">
        <span>请完成安全验证</span>
        <button class="refresh-btn" @click="refreshCaptcha" title="刷新验证码">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" :style="{ transform: `rotate(${refreshAngle}deg)` }">
            <path d="M23 4v6h-6M1 20v-6h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="captcha-image-wrapper">
        <canvas ref="bgCanvas" class="captcha-bg"></canvas>
        <canvas ref="blockCanvas" class="captcha-block"></canvas>
        <div v-if="isVerifying" class="verify-overlay">
          <div class="verify-spinner"></div>
        </div>
        <div v-if="verifyStatus" class="verify-result" :class="verifyStatus">
          <svg v-if="verifyStatus === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" stroke-width="3" stroke-linecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      
      <div class="slider-container">
        <div class="slider-track" :class="{ loading: isVerifying }">
          <div class="slider-fill" :style="{ width: `${sliderWidth}%` }"></div>
          <div
            class="slider-thumb"
            :style="{ left: `${sliderWidth}%` }"
            @mousedown="startDrag"
            @touchstart="startDrag"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <span class="slider-text">{{ sliderText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

const emit = defineEmits<{
  (e: "success", token: string): void;
  (e: "error"): void;
}>();

const bgCanvas = ref<HTMLCanvasElement | null>(null);
const blockCanvas = ref<HTMLCanvasElement | null>(null);
const isDragging = ref(false);
const sliderWidth = ref(0);
const isVerifying = ref(false);
const verifyStatus = ref<"" | "success" | "error">("");
const refreshAngle = ref(0);

const sliderText = computed(() => {
  if (isVerifying.value) return "验证中...";
  if (verifyStatus.value === "success") return "验证成功";
  if (verifyStatus.value === "error") return "验证失败，请重试";
  return "请拖动滑块完成拼图";
});

const CAPTCHA_CONFIG = {
  width: 300,
  height: 150,
  blockSize: 40,
  range: 8
};

let startX = 0;
let currentX = 0;
let targetX = 0;
let captchaToken = "";
let bgContext: CanvasRenderingContext2D | null = null;
let blockContext: CanvasRenderingContext2D | null = null;

const generateToken = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
};

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const drawBlockShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath();
  ctx.moveTo(x + size * 0.25, y);
  ctx.lineTo(x + size * 0.25, y);
  ctx.bezierCurveTo(
    x + size * 0.25, y - size * 0.3,
    x + size * 0.75, y - size * 0.3,
    x + size * 0.75, y
  );
  ctx.lineTo(x + size * 0.75, y + size * 0.2);
  ctx.arc(x + size * 0.75, y + size * 0.2, size * 0.2, 0, Math.PI * 2);
  ctx.lineTo(x + size * 0.75, y + size * 0.4);
  ctx.arc(x + size * 0.75, y + size * 0.4, size * 0.2, 0, Math.PI * 2, true);
  ctx.lineTo(x + size * 0.75, y + size);
  ctx.lineTo(x + size * 0.25, y + size);
  ctx.lineTo(x + size * 0.25, y + size * 0.6);
  ctx.arc(x + size * 0.25, y + size * 0.6, size * 0.2, 0, Math.PI * 2, true);
  ctx.lineTo(x + size * 0.25, y + size * 0.4);
  ctx.arc(x + size * 0.25, y + size * 0.4, size * 0.2, 0, Math.PI * 2);
  ctx.lineTo(x + size * 0.25, y);
  ctx.closePath();
};

const generateCaptcha = () => {
  if (!bgCanvas.value || !blockCanvas.value) return;
  
  const bgCtx = bgCanvas.value.getContext("2d");
  const blkCtx = blockCanvas.value.getContext("2d");
  if (!bgCtx || !blkCtx) return;
  
  bgContext = bgCtx;
  blockContext = blkCtx;
  
  const { width, height, blockSize } = CAPTCHA_CONFIG;
  bgCanvas.value.width = width;
  bgCanvas.value.height = height;
  blockCanvas.value.width = width;
  blockCanvas.value.height = height;
  
  targetX = randomInt(blockSize + 10, width - blockSize - 10);
  captchaToken = generateToken();
  
  bgCtx.fillStyle = "#f0f2f5";
  bgCtx.fillRect(0, 0, width, height);
  
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];
  
  for (let i = 0; i < 50; i++) {
    bgCtx.beginPath();
    bgCtx.fillStyle = colors[randomInt(0, colors.length - 1)];
    bgCtx.globalAlpha = 0.3;
    const x = randomInt(0, width);
    const y = randomInt(0, height);
    const size = randomInt(10, 30);
    
    if (randomInt(0, 1)) {
      bgCtx.arc(x, y, size, 0, Math.PI * 2);
    } else {
      bgCtx.fillRect(x, y, size, size);
    }
    bgCtx.fill();
  }
  
  bgCtx.globalAlpha = 1;
  bgCtx.textBaseline = "middle";
  bgCtx.textAlign = "center";
  bgCtx.font = "bold 24px Arial";
  bgCtx.fillStyle = "#333";
  bgCtx.fillText("拼图验证", width / 2, height / 2);
  
  drawBlockShape(blkCtx, targetX, (height - blockSize) / 2, blockSize);
  
  const imageData = bgCtx.getImageData(targetX, (height - blockSize) / 2, blockSize, blockSize);
  blkCtx.putImageData(imageData, targetX, (height - blockSize) / 2);
  
  blkCtx.globalCompositeOperation = "destination-over";
  blkCtx.fillStyle = bgCtx.createPattern(imageData, "repeat") || null;
  if (blkCtx.fillStyle) {
    blkCtx.fillRect(0, 0, width, height);
  }
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  if (isVerifying.value || verifyStatus.value === "success") return;
  
  isDragging.value = true;
  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  startX = clientX;
  currentX = 0;
  
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("touchend", stopDrag);
};

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  
  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  const diff = clientX - startX;
  const { width, blockSize } = CAPTCHA_CONFIG;
  const maxWidth = width - blockSize;
  
  currentX = Math.max(0, Math.min(diff, maxWidth));
  sliderWidth.value = (currentX / maxWidth) * 100;
};

const stopDrag = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
  
  const { blockSize, range } = CAPTCHA_CONFIG;
  const offset = Math.abs(currentX - targetX);
  
  if (offset <= range) {
    isVerifying.value = true;
    sliderWidth.value = (targetX / (CAPTCHA_CONFIG.width - blockSize)) * 100;
    
    setTimeout(() => {
      isVerifying.value = false;
      verifyStatus.value = "success";
      emit("success", captchaToken);
    }, 500);
  } else {
    isVerifying.value = true;
    
    setTimeout(() => {
      isVerifying.value = false;
      verifyStatus.value = "error";
      sliderWidth.value = 0;
      emit("error");
    }, 800);
  }
};

const refreshCaptcha = () => {
  refreshAngle.value += 180;
  verifyStatus.value = "";
  sliderWidth.value = 0;
  generateCaptcha();
};

onMounted(() => {
  generateCaptcha();
});

onUnmounted(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
});
</script>

<style scoped>
.puzzle-captcha {
  width: 100%;
  padding: 0 6px;
}

.captcha-container {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.captcha-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.refresh-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f3f4f6;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.refresh-btn:hover {
  background: #e5e7eb;
}

.refresh-btn svg {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.3s ease;
}

.captcha-image-wrapper {
  position: relative;
  width: 100%;
  height: 150px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
}

.captcha-bg {
  width: 100%;
  height: 100%;
  display: block;
}

.captcha-block {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.verify-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.verify-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.verify-result {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verify-result.success {
  background: #22c55e;
  color: white;
}

.verify-result.error {
  background: #ef4444;
  color: white;
}

.verify-result svg {
  width: 24px;
  height: 24px;
}

.slider-container {
  margin-top: 16px;
}

.slider-track {
  position: relative;
  height: 44px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.slider-track.loading {
  opacity: 0.7;
}

.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.slider-thumb {
  position: absolute;
  top: 0;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: translateX(-50%);
  transition: transform 0.1s;
}

.slider-thumb:active {
  cursor: grabbing;
  transform: translateX(-50%) scale(1.05);
}

.slider-thumb svg {
  width: 20px;
  height: 20px;
  color: white;
}

.slider-text {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}
</style>
