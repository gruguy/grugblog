<template>
  <div class="captcha-wrapper">
    <div class="captcha-row">
      <div class="captcha-container">
        <Captcha
          ref="captchaRef"
          :width="300"
          :height="100"
          :bg-color="'#f8f9fa'"
          :border-color="'#dee2e6'"
          :click-refresh="true"
          :fail-refresh="true"
        />
      </div>
      <div class="captcha-input-container">
        <input
          type="text"
          v-model="captchaValue"
          class="captcha-input"
          placeholder="请输入验证码"
          @keyup.enter="validate"
        />
        <button
          class="captcha-button"
          @click="validate"
        >
          验证
        </button>
      </div>
    </div>
    <div v-if="error" class="captcha-error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Captcha, { CaptchaInstance } from 'vue3-captcha';

const emit = defineEmits<{
  (e: "success", token: string): void;
  (e: "error"): void;
}>();

const captchaRef = ref<CaptchaInstance | null>(null);
const captchaValue = ref('');
const error = ref('');

const validate = () => {
  if (!captchaValue.value.trim()) {
    error.value = '请输入验证码';
    emit('error');
    return;
  }
  
  if (captchaRef.value?.check(captchaValue.value)) {
    error.value = '';
    const token = generateToken();
    emit('success', token);
  } else {
    error.value = '验证码错误，请重试';
    captchaValue.value = '';
    emit('error');
  }
};

const generateToken = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
};

const reset = () => {
  captchaValue.value = '';
  error.value = '';
  captchaRef.value?.refresh();
};

defineExpose({ reset });
</script>

<style scoped>
.captcha-wrapper {
  width: 100%;
}

.captcha-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-container {
  flex-shrink: 0;
}

.captcha-input-container {
  flex: 1;
  display: flex;
  gap: 8px;
}

.captcha-input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.captcha-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.captcha-button {
  height: 40px;
  padding: 0 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.captcha-button:hover {
  background: #2563eb;
}

.captcha-button:active {
  background: #1d4ed8;
}

.captcha-error {
  margin-top: 8px;
  font-size: 12px;
  color: #ef4444;
}
</style>
