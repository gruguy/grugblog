<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      {
        'px-4 py-2 rounded-lg': variant === 'default',
        'p-2 rounded-full': variant === 'circle',
        'p-1 rounded': variant === 'icon',
      },
      {
        'bg-primary text-white hover:bg-primary/90': variant === 'default' && color === 'primary',
        'bg-secondary text-white hover:bg-secondary/90': variant === 'default' && color === 'secondary',
        'bg-muted text-muted-foreground hover:bg-muted/80': variant === 'default' && color === 'muted',
        'bg-white text-foreground hover:bg-muted border border-border': variant === 'default' && color === 'white',
      },
      {
        'text-primary hover:bg-primary/10': variant === 'circle' && color === 'primary',
        'text-secondary hover:bg-secondary/10': variant === 'circle' && color === 'secondary',
        'text-muted-foreground hover:bg-muted': variant === 'circle' && color === 'muted',
        'bg-white text-foreground hover:bg-muted border border-border': variant === 'circle' && color === 'white',
      },
      {
        'text-primary hover:bg-primary/10': variant === 'icon' && color === 'primary',
        'text-secondary hover:bg-secondary/10': variant === 'icon' && color === 'secondary',
        'text-muted-foreground hover:bg-muted': variant === 'icon' && color === 'muted',
        'bg-white text-foreground hover:bg-muted border border-border': variant === 'icon' && color === 'white',
      },
      {
        'opacity-50 cursor-not-allowed': disabled,
      },
      {
        'shadow-md': shadow,
      },
      customClass,
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'circle' | 'icon';
  color?: 'primary' | 'secondary' | 'muted' | 'white';
  disabled?: boolean;
  shadow?: boolean;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  color: 'primary',
  disabled: false,
  shadow: false,
  customClass: '',
});

defineEmits(['click']);
</script>

<style scoped>
button:active {
  transform: scale(0.95);
}
</style>