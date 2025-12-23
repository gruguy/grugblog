<template>
  <div class="min-h-screen bg-background">
    <!-- 导航栏 -->
    <nav class="sticky top-0 z-50 bg-card border-b border-border">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/" class="text-2xl font-bold text-primary">
            个人博客
          </RouterLink>

          <!-- 桌面端导航 -->
          <div class="hidden md:flex items-center space-x-6">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="text-foreground hover:text-primary transition-colors"
              active-class="text-primary font-medium"
            >
              {{ item.name }}
            </RouterLink>
          </div>

          <!-- 移动端菜单按钮 -->
          <div class="flex items-center">
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="菜单"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <Transition name="slide-down">
        <div
          v-if="showMobileMenu"
          class="md:hidden border-t border-border bg-card"
        >
          <div class="container mx-auto px-4 py-4 space-y-2">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              @click="showMobileMenu = false"
              class="block py-2 text-foreground hover:text-primary transition-colors"
              active-class="text-primary font-medium"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- 主内容区 -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="border-t border-border bg-card mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-muted-foreground">
          <p>&copy; {{ currentYear }} 个人博客. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const showMobileMenu = ref(false);
const currentYear = computed(() => new Date().getFullYear());

const navItems = [
  { name: "首页", path: "/" },
  { name: "文章", path: "/articles" },
  { name: "音乐", path: "/music" },
  { name: "相册", path: "/gallery" },
  { name: "Vlog", path: "/vlog" },
  { name: "关于", path: "/about" },
];

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest("nav")) {
    showMobileMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
