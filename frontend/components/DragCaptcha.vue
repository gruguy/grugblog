<template>
  <div class="drag-captcha">
    <div class="captcha-container">
      <div class="captcha-title">拖动滑块完成拼图验证</div>

      <div class="captcha-body">
        <div class="puzzle-area">
          <!-- Background with missing piece -->
          <div class="puzzle-bg-container">
            <canvas ref="bgCanvas" class="puzzle-bg"></canvas>
            <div class="puzzle-mask" :style="maskStyle"></div>
          </div>

          <!-- Draggable puzzle piece -->
          <div
            ref="puzzlePiece"
            class="puzzle-piece"
            :style="pieceStyle"
            @mousedown="startDrag"
            @touchstart="startDrag"
          >
            <canvas ref="pieceCanvas" class="piece-canvas"></canvas>
            <div class="piece-border"></div>
          </div>
        </div>

        <!-- Drag track -->
        <div class="drag-track">
          <div class="track-bar">
            <div class="track-fill" :style="trackFillStyle"></div>
          </div>
          <div
            ref="dragHandle"
            class="drag-handle"
            @mousedown="startDrag"
            @touchstart="startDrag"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline
                points="9 18 15 12 9 6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <!-- Status text -->
        <div class="status-text" :class="statusClass">{{ statusText }}</div>
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

// Canvas references
const bgCanvas = ref<HTMLCanvasElement | null>(null);
const pieceCanvas = ref<HTMLCanvasElement | null>(null);
const puzzlePiece = ref<HTMLElement | null>(null);
const dragHandle = ref<HTMLElement | null>(null);

// CAPTCHA configuration
const CAPTCHA_CONFIG = {
  width: 300,
  height: 150,
  pieceSize: 40,
  tolerance: 5,
};

// State
const isDragging = ref(false);
const dragOffset = ref(0);
const targetPosition = ref(0);
const currentPosition = ref(0);
const status = ref<"idle" | "dragging" | "success" | "error">("idle");
const statusText = ref("请拖动滑块完成拼图");
const captchaToken = ref("");

// Computed styles
const pieceStyle = computed(() => ({
  left: `${currentPosition.value}px`,
  transform: isDragging.value ? "scale(1.1)" : "scale(1)",
  transition: isDragging.value ? "transform 0.2s ease" : "all 0.3s ease",
}));

const maskStyle = computed(() => ({
  left: `${targetPosition.value}px`,
}));

const trackFillStyle = computed(() => ({
  width: `${
    (currentPosition.value /
      (CAPTCHA_CONFIG.width - CAPTCHA_CONFIG.pieceSize)) *
    100
  }%`,
}));

const statusClass = computed(() => {
  if (status.value === "success") return "success";
  if (status.value === "error") return "error";
  return "";
});

// Generate random color background
const generateBackground = () => {
  if (!bgCanvas.value || !pieceCanvas.value) return;

  const bgCtx = bgCanvas.value.getContext("2d");
  const pieceCtx = pieceCanvas.value.getContext("2d");
  if (!bgCtx || !pieceCtx) return;

  // Set canvas dimensions
  bgCanvas.value.width = CAPTCHA_CONFIG.width;
  bgCanvas.value.height = CAPTCHA_CONFIG.height;
  pieceCanvas.value.width = CAPTCHA_CONFIG.pieceSize;
  pieceCanvas.value.height = CAPTCHA_CONFIG.pieceSize;

  // Generate random target position
  targetPosition.value =
    Math.floor(
      Math.random() * (CAPTCHA_CONFIG.width - CAPTCHA_CONFIG.pieceSize * 2)
    ) + CAPTCHA_CONFIG.pieceSize;

  // Draw colorful background
  const gradient = bgCtx.createLinearGradient(
    0,
    0,
    CAPTCHA_CONFIG.width,
    CAPTCHA_CONFIG.height
  );
  const color1 = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
  const color2 = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  bgCtx.fillStyle = gradient;
  bgCtx.fillRect(0, 0, CAPTCHA_CONFIG.width, CAPTCHA_CONFIG.height);

  // Draw random shapes
  for (let i = 0; i < 50; i++) {
    bgCtx.beginPath();
    const x = Math.random() * CAPTCHA_CONFIG.width;
    const y = Math.random() * CAPTCHA_CONFIG.height;
    const size = Math.random() * 15 + 5;

    bgCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;

    if (Math.random() > 0.5) {
      bgCtx.arc(x, y, size, 0, Math.PI * 2);
    } else {
      bgCtx.fillRect(x, y, size, size);
    }
    bgCtx.fill();
  }

  // Draw puzzle piece shape on piece canvas
  drawPuzzleShape(pieceCtx, 0, 0, CAPTCHA_CONFIG.pieceSize);
  pieceCtx.globalCompositeOperation = "source-in";
  pieceCtx.drawImage(
    bgCanvas.value,
    targetPosition.value,
    (CAPTCHA_CONFIG.height - CAPTCHA_CONFIG.pieceSize) / 2,
    CAPTCHA_CONFIG.pieceSize,
    CAPTCHA_CONFIG.pieceSize,
    0,
    0,
    CAPTCHA_CONFIG.pieceSize,
    CAPTCHA_CONFIG.pieceSize
  );
};

// Draw puzzle shape
const drawPuzzleShape = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + size * 0.25, y);
  ctx.lineTo(x + size * 0.75, y);
  ctx.bezierCurveTo(
    x + size * 0.75,
    y - size * 0.15,
    x + size,
    y - size * 0.15,
    x + size,
    y + size * 0.25
  );
  ctx.lineTo(x + size, y + size * 0.75);
  ctx.bezierCurveTo(
    x + size,
    y + size * 0.9,
    x + size * 0.75,
    y + size * 0.9,
    x + size * 0.75,
    y + size
  );
  ctx.lineTo(x + size * 0.25, y + size);
  ctx.bezierCurveTo(
    x + size * 0.25,
    y + size * 0.9,
    x,
    y + size * 0.9,
    x,
    y + size * 0.75
  );
  ctx.lineTo(x, y + size * 0.25);
  ctx.bezierCurveTo(
    x,
    y - size * 0.15,
    x + size * 0.25,
    y - size * 0.15,
    x + size * 0.25,
    y
  );
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;
  ctx.stroke();
};

// Start dragging
const startDrag = (e: MouseEvent | TouchEvent) => {
  if (status.value !== "idle") return;

  isDragging.value = true;
  status.value = "dragging";
  statusText.value = "拖动滑块完成拼图";

  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const handleRect = dragHandle.value?.getBoundingClientRect();
  if (handleRect) {
    dragOffset.value = clientX - handleRect.left;
  }

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("touchend", stopDrag);
};

// Drag move
const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;

  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const trackRect = dragHandle.value?.parentElement?.getBoundingClientRect();
  if (!trackRect) return;

  let newPosition = clientX - trackRect.left - dragOffset.value;
  const maxPosition = CAPTCHA_CONFIG.width - CAPTCHA_CONFIG.pieceSize;

  // Constrain to track
  newPosition = Math.max(0, Math.min(newPosition, maxPosition));
  currentPosition.value = newPosition;
};

// Stop dragging
const stopDrag = () => {
  if (!isDragging.value) return;

  isDragging.value = false;

  // Check if position is correct
  const isCorrect =
    Math.abs(currentPosition.value - targetPosition.value) <=
    CAPTCHA_CONFIG.tolerance;

  if (isCorrect) {
    status.value = "success";
    statusText.value = "验证成功";
    captchaToken.value = generateToken();
    emit("success", captchaToken.value);
  } else {
    status.value = "error";
    statusText.value = "验证失败，请重试";

    // Reset position after delay
    setTimeout(() => {
      currentPosition.value = 0;
      status.value = "idle";
      statusText.value = "请拖动滑块完成拼图";
    }, 800);
    emit("error");
  }

  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
};

// Generate verification token
const generateToken = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};

// Refresh CAPTCHA
const refresh = () => {
  currentPosition.value = 0;
  status.value = "idle";
  statusText.value = "请拖动滑块完成拼图";
  generateBackground();
};

// Expose refresh method
defineExpose({
  refresh,
});

// Initialize
onMounted(() => {
  generateBackground();
});

onUnmounted(() => {
  // Cleanup event listeners
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
});
</script>

<style scoped>
.drag-captcha {
  width: 100%;
}

.captcha-container {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.captcha-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  text-align: center;
}

.captcha-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.puzzle-area {
  position: relative;
  width: 300px;
  height: 150px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  background: #f8f9fa;
}

.puzzle-bg-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.puzzle-bg {
  width: 100%;
  height: 100%;
  display: block;
}

.puzzle-mask {
  position: absolute;
  top: calc(50% - 20px); /* Fixed alignment */
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.6), 0 0 0 2px #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 5;
}

.puzzle-piece {
  position: absolute;
  top: calc(50% - 20px); /* Fixed alignment */
  width: 40px;
  height: 40px;
  cursor: grab;
  z-index: 10;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  user-select: none;
}

.puzzle-piece:active {
  cursor: grabbing;
}

.piece-canvas {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 4px;
  border: 2px solid #ffffff;
  box-sizing: border-box;
}

.piece-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  pointer-events: none;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
}

.drag-track {
  position: relative;
  width: 300px;
  height: 40px;
  background: #f0f2f5;
  border-radius: 20px;
  overflow: hidden;
}

.track-bar {
  width: 100%;
  height: 100%;
  position: relative;
}

.track-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.1s linear;
  border-radius: 20px;
}

.drag-handle {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.drag-handle:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.1);
}

.drag-handle svg {
  width: 20px;
  height: 20px;
  color: #666;
}

.status-text {
  margin-top: 12px;
  font-size: 12px;
  color: #666;
  transition: all 0.3s ease;
}

.status-text.success {
  color: #22c55e;
}

.status-text.error {
  color: #ef4444;
}
</style>
