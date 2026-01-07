<template>
  <div
    class="skeleton relative overflow-hidden bg-gray-100 rounded transition-all duration-300"
    :class="{
      'animate-pulse': animated,
      'rounded-lg': rounded,
      'rounded-full': rounded === 'full',
    }"
    :style="{
      width: width,
      height: height,
      marginBottom: marginBottom,
    }"
  >
    <!-- 内部骨架结构，根据类型变化 -->
    <template v-if="type === 'card'">
      <div class="p-4 space-y-3">
        <div class="h-8 bg-gray-200 rounded-md w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded-md w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded-md w-4/6"></div>
        <div class="flex justify-between items-center pt-2">
          <div class="h-4 bg-gray-200 rounded-md w-24"></div>
          <div class="h-4 bg-gray-200 rounded-md w-16"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'article-card'">
      <div class="flex flex-col md:flex-row gap-4 p-4">
        <!-- 图片占位符 -->
        <div class="w-full md:w-48 h-32 bg-gray-200 rounded-md"></div>
        <!-- 内容占位符 -->
        <div class="flex-1 space-y-3">
          <div class="h-6 bg-gray-200 rounded-md w-4/5"></div>
          <div class="h-4 bg-gray-200 rounded-md w-full mb-1"></div>
          <div class="h-4 bg-gray-200 rounded-md w-5/6 mb-1"></div>
          <div class="h-4 bg-gray-200 rounded-md w-3/6"></div>
          <div class="flex items-center gap-4 pt-2">
            <div class="flex items-center gap-2">
              <div class="h-5 w-5 bg-gray-200 rounded-full"></div>
              <div class="h-3 bg-gray-200 rounded-md w-16"></div>
            </div>
            <div class="h-3 bg-gray-200 rounded-md w-12"></div>
            <div class="h-3 bg-gray-200 rounded-md w-12"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'text'">
      <div class="space-y-2">
        <div
          v-for="i in rows"
          :key="i"
          class="h-4 bg-gray-200 rounded-md"
          :class="{
            'w-full': i === 1,
            'w-5/6': i === 2,
            'w-4/6': i > 2,
          }"
        ></div>
      </div>
    </template>

    <template v-else-if="type === 'image'">
      <div class="w-full h-full bg-gray-200 rounded-md"></div>
    </template>

    <template v-else-if="type === 'avatar'">
      <div class="w-full h-full bg-gray-200 rounded-full"></div>
    </template>

    <!-- 默认骨架 -->
    <template v-else>
      <div class="h-full w-full bg-gray-200 rounded-md"></div>
    </template>

    <!-- 动画效果 -->
    <div
      v-if="animated"
      class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  // 骨架类型：card, article-card, text, image, avatar
  type?: string;
  // 文本行数，仅type为text时有效
  rows?: number;
  // 宽度，如 "100%", "200px"
  width?: string;
  // 高度，如 "20px", "100%"
  height?: string;
  // 圆角类型：true, false, "full"
  rounded?: boolean | string;
  // 是否显示动画
  animated?: boolean;
  // 底部外边距
  marginBottom?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  rows: 3,
  width: "100%",
  height: "20px",
  rounded: true,
  animated: true,
  marginBottom: "0",
});
</script>

<style scoped>
/* 自定义闪烁动画，更接近Element UI的效果 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite ease-in-out;
  background-size: 200% 100%;
}

/* Element UI风格的脉冲动画 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
