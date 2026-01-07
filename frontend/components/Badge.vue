<template>
  <div
    :class="[
      {
        'relative inline-flex items-center justify-center': position,
        'inline-flex items-center justify-center': !position,
      },
    ]"
  >
    <slot name="content"></slot>
    <span
      :class="[
        'inline-flex items-center justify-center font-medium text-xs transition-all duration-200',
        {
          'px-2 py-0.5 rounded-full': variant === 'default',
          'w-4 h-4 rounded-full': variant === 'dot',
          'px-1 py-0 rounded-full': variant === 'pill',
        },
        {
          'bg-gray-800 text-white':
            variant === 'default' && color === 'default',
          'bg-primary text-white': variant === 'default' && color === 'primary',
          'bg-secondary text-white':
            variant === 'default' && color === 'secondary',
          'bg-muted text-muted-foreground':
            variant === 'default' && color === 'muted',
          'bg-white text-foreground border border-border':
            variant === 'default' && color === 'white',
          'bg-red-500 text-white': variant === 'default' && color === 'red',
          'bg-green-500 text-white': variant === 'default' && color === 'green',
          'bg-yellow-500 text-white':
            variant === 'default' && color === 'yellow',
          'bg-blue-500 text-white': variant === 'default' && color === 'blue',
        },
        {
          'bg-primary': variant === 'dot' && color === 'primary',
          'bg-secondary': variant === 'dot' && color === 'secondary',
          'bg-muted': variant === 'dot' && color === 'muted',
          'bg-red-500': variant === 'dot' && color === 'red',
          'bg-green-500': variant === 'dot' && color === 'green',
          'bg-yellow-500': variant === 'dot' && color === 'yellow',
          'bg-blue-500': variant === 'dot' && color === 'blue',
        },
        {
          'absolute top-[-2px] right-[-2px] transform translate-x-1/2 -translate-y-1/2 min-w-[18px] h-5':
            position === 'top-right',
          'absolute top-[-2px] left-[-2px] transform -translate-x-1/2 -translate-y-1/2 min-w-[18px] h-5':
            position === 'top-left',
          'absolute bottom-[-2px] right-[-2px] transform translate-x-1/2 translate-y-1/2 min-w-[18px] h-5':
            position === 'bottom-right',
          'absolute bottom-[-2px] left-[-2px] transform -translate-x-1/2 translate-y-1/2 min-w-[18px] h-5':
            position === 'bottom-left',
        },
        customClass,
      ]"
    >
      <slot v-if="variant !== 'dot'"></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: "default" | "dot" | "pill";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "muted"
    | "white"
    | "red"
    | "green"
    | "yellow"
    | "blue";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  color: "default",
  position: undefined,
  customClass: "",
});
</script>
