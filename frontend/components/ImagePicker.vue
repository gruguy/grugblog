<template>
  <div class="image-picker">
    <div v-if="label" class="picker-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </div>
    
    <div class="shape-options">
      <div
        v-for="shape in shapes"
        :key="shape.value"
        class="shape-option"
        :class="{ active: currentShape === shape.value }"
        @click="currentShape = shape.value"
        :title="shape.label"
      >
        <div :class="['shape-preview', shape.value]"></div>
      </div>
    </div>

    <div
      class="image-grid"
      :class="currentShape"
    >
      <div
        v-for="(image, index) in images"
        :key="image.key || index"
        class="image-item"
        :class="{ selected: isSelected(image) }"
        @click="toggleSelect(image)"
      >
        <div class="image-wrapper">
          <img
            v-if="image.url"
            :src="image.url"
            :alt="image.name || image.title || '图片'"
            loading="lazy"
          />
          <div v-else class="image-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        </div>
        
        <div v-if="showCheckbox" class="checkbox-overlay">
          <div class="checkbox" :class="{ checked: isSelected(image) }">
            <svg v-if="isSelected(image)" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div v-if="image.name || image.title" class="image-name">
          {{ image.name || image.title }}
        </div>
      </div>
      
      <div
        v-if="allowAdd"
        class="image-item add-new"
        @click="$emit('add')"
      >
        <div class="add-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19" stroke-width="2" stroke-linecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span>{{ addText }}</span>
      </div>
    </div>

    <div v-if="selectedImages.length > 0 && showSelectedCount" class="selected-info">
      已选择 {{ selectedImages.length }} 项
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface ImageItem {
  url: string;
  key?: string | number;
  name?: string;
  title?: string;
  [key: string]: any;
}

const props = withDefaults(defineProps<{
  images: ImageItem[];
  modelValue?: ImageItem[];
  label?: string;
  required?: boolean;
  maxSelect?: number;
  showCheckbox?: boolean;
  allowAdd?: boolean;
  addText?: string;
  showSelectedCount?: boolean;
  defaultShape?: string;
}>(), {
  modelValue: () => [],
  maxSelect: 1,
  showCheckbox: true,
  allowAdd: false,
  addText: "添加图片",
  showSelectedCount: true,
  defaultShape: "square"
});

const emit = defineEmits<{
  (e: "update:modelValue", value: ImageItem[]): void;
  (e: "select", image: ImageItem): void;
  (e: "add"): void;
}>();

const shapes = [
  { value: "square", label: "方形" },
  { value: "rounded", label: "圆角" },
  { value: "circle", label: "圆形" }
] as const;

type ShapeType = typeof shapes[number]["value"];

const currentShape = ref<ShapeType>(props.defaultShape as ShapeType);
const selectedImages = ref<ImageItem[]>([...props.modelValue]);

const isSelected = (image: ImageItem) => {
  const key = image.key ?? image.url;
  return selectedImages.value.some(
    img => (img.key ?? img.url) === key
  );
};

const toggleSelect = (image: ImageItem) => {
  if (props.maxSelect === 1) {
    selectedImages.value = [image];
  } else {
    const index = selectedImages.value.findIndex(
      img => (img.key ?? img.url) === (image.key ?? image.url)
    );
    
    if (index >= 0) {
      selectedImages.value.splice(index, 1);
    } else if (selectedImages.value.length < props.maxSelect) {
      selectedImages.value.push(image);
    }
  }
  
  emit("update:modelValue", [...selectedImages.value]);
  emit("select", image);
};

watch(() => props.modelValue, (newVal) => {
  selectedImages.value = [...newVal];
}, { deep: true });
</script>

<style scoped>
.image-picker {
  width: 100%;
}

.picker-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.shape-options {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.shape-option {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.shape-option:hover {
  border-color: #3b82f6;
}

.shape-option.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.shape-preview {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.shape-preview.square {
  border-radius: 2px;
}

.shape-preview.rounded {
  border-radius: 8px;
}

.shape-preview.circle {
  border-radius: 50%;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.image-grid.circle {
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: #f9fafb;
}

.image-item:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-item.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.image-item.circle {
  border-radius: 50%;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-wrapper.circle img {
  border-radius: 50%;
}

.image-placeholder {
  width: 48px;
  height: 48px;
  color: #9ca3af;
}

.image-placeholder svg {
  width: 100%;
  height: 100%;
}

.checkbox-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox.checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox svg {
  width: 12px;
  height: 12px;
  color: #fff;
}

.image-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: #fff;
  font-size: 10px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-item.add-new {
  border: 2px dashed #d1d5db;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6b7280;
  font-size: 12px;
}

.image-item.add-new:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.add-icon {
  width: 32px;
  height: 32px;
}

.add-icon svg {
  width: 100%;
  height: 100%;
}

.selected-info {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  text-align: right;
}
</style>
