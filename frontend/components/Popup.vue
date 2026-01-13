<template>
  <div
    v-if="visible"
    :class="[
      'relative z-50',
      !showMask && position === 'relative' ? '' : 'fixed inset-0 flex',
      positionClass,
    ]"
  >
    <!-- 背景遮罩 -->
    <div
      v-if="showMask"
      class="absolute inset-0 bg-black bg-opacity-50"
      @click="close"
    ></div>

    <!-- 弹窗内容 -->
    <div
      class="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4 relative z-10"
      :class="!showMask && position === 'relative' ? '' : 'mx-4'"
      :style="customStyle"
    >
      <!-- 弹窗头部 -->
      <div class="flex items-center justify-between p-4 border-b border-border">
        <h3 class="text-lg font-medium">{{ title }}</h3>
        <button
          @click="close"
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

      <!-- 弹窗主体 -->
      <div class="p-4 max-h-[400px] overflow-y-auto">
        <slot></slot>
      </div>

      <!-- 弹窗底部 -->
      <div
        v-if="showFooter"
        class="flex justify-end p-4 border-t border-border gap-2"
      >
        <button
          v-if="showCancel"
          @click="cancel"
          class="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          v-if="showConfirm"
          @click="confirm"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    title?: string;
    showFooter?: boolean;
    showCancel?: boolean;
    showConfirm?: boolean;
    cancelText?: string;
    confirmText?: string;
    showMask?: boolean;
    position?:
      | "center"
      | "top-right"
      | "bottom-right"
      | "top-left"
      | "bottom-left"
      | "relative";
    customStyle?: Record<string, any>;
  }>(),
  {
    title: "提示",
    showFooter: false,
    showCancel: false,
    showConfirm: false,
    cancelText: "取消",
    confirmText: "确认",
    showMask: true,
    position: "center",
    customStyle: () => ({}),
  }
);

const emit = defineEmits<{
  close: [];
  cancel: [];
  confirm: [];
}>();

const positionClass = computed(() => {
  // 相对定位模式下不应用flex布局类
  if (props.position === "relative" && !props.showMask) {
    return "";
  }

  const classes: Record<string, string> = {
    center: "items-center justify-center",
    "top-right": "items-start justify-end",
    "bottom-right": "items-end justify-end",
    "top-left": "items-start justify-start",
    "bottom-left": "items-end justify-start",
    relative: "items-start justify-start",
  };
  return classes[props.position] || classes["center"];
});

const close = () => {
  emit("close");
};

const cancel = () => {
  emit("cancel");
  close();
};

const confirm = () => {
  emit("confirm");
  close();
};
</script>

<style scoped>
/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
