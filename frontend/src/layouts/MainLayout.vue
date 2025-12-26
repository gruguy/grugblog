<template>
  <div class="min-h-screen bg-background">
    <!-- 导航栏 -->
    <nav class="sticky top-0 z-50 bg-card border-b border-border">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/" class="text-2xl font-bold text-primary"
            >个人博客</RouterLink
          >

          <!-- 桌面端导航 -->
          <div class="hidden md:flex items-center space-x-6">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="text-foreground hover:text-primary transition-colors"
              active-class="text-primary font-medium"
              >{{ item.name }}</RouterLink
            >
          </div>

          <!-- 登录状态相关 -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- 已登录状态 -->
            <template v-if="userStore.isLoggedIn">
              <!-- 马上发表按钮 -->
              <router-link
                to="/editor"
                class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                马上发表
              </router-link>
            </template>

            <!-- 登录注册按钮 -->
            <div class="flex items-center space-x-2">
              <!-- 未登录状态 -->
              <template v-if="!userStore.isLoggedIn">
                <button
                  @click="showLoginModal = true"
                  class="text-foreground hover:text-primary transition-colors"
                >
                  登录
                </button>
                <span class="text-muted-foreground">|</span>
                <button
                  @click="showRegisterModal = true"
                  class="text-primary hover:underline"
                >
                  注册
                </button>
              </template>
              <!-- 已登录状态 -->
              <template v-else>
                <!-- 消息图标 -->
                <button
                  class="p-2 rounded-full hover:bg-muted transition-colors relative"
                  title="消息"
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                  </svg>
                  <span
                    class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
                  ></span>
                </button>
                <!-- 个人头像和用户名 -->
                <div class="relative group">
                  <button class="flex items-center gap-2">
                    <div
                      v-if="!userStore.user?.avatar"
                      class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium text-xs border border-border"
                    >
                      {{
                        (userStore.user?.username || "U")
                          .charAt(0)
                          .toUpperCase()
                      }}
                    </div>
                    <img
                      v-else
                      :src="userStore.user?.avatar"
                      alt="头像"
                      class="w-8 h-8 rounded-full object-cover border border-border"
                    />
                    <!-- 显示用户名或昵称 -->
                    <span class="text-sm font-medium hidden md:inline">{{
                      userStore.user?.nickname || userStore.user?.username || ""
                    }}</span>
                  </button>
                  <!-- 下拉菜单 -->
                  <div
                    class="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                  >
                    <div class="py-2">
                      <RouterLink
                        to="/profile"
                        class="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >个人中心</RouterLink
                      >
                      <button
                        @click="userStore.userLogout"
                        class="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        退出登录
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
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
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 移动端菜单 -->
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
            >{{ item.name }}</RouterLink
          >
        </div>
      </div>
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

    <!-- 登录弹窗 -->
    <Modal v-model:modelValue="showLoginModal" title="用户登录">
      <div class="p-0">
        <form @submit.prevent="handleLogin">
          <div class="mb-4 px-6 pt-6">
            <label for="username" class="block text-sm font-medium mb-1"
              >用户名</label
            >
            <input
              type="text"
              id="username"
              v-model="loginForm.username"
              class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入用户名"
              required
              autofocus
            />
          </div>
          <div class="mb-4 px-6">
            <label for="password" class="block text-sm font-medium mb-1"
              >密码</label
            >
            <input
              type="password"
              id="password"
              v-model="loginForm.password"
              class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入密码"
              required
            />
          </div>
          <div class="mb-6 px-6">
            <button
              type="submit"
              class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              :disabled="loginLoading"
            >
              <span v-if="loginLoading">登录中...</span>
              <span v-else>登录</span>
            </button>
          </div>
          <div class="px-6 pb-6 text-center">
            <p class="text-sm text-muted-foreground">
              还没有账号？
              <button
                type="button"
                @click="toggleModal('register')"
                class="text-primary hover:underline"
              >
                立即注册
              </button>
            </p>
          </div>
        </form>
      </div>
    </Modal>

    <!-- 注册弹窗 -->
    <Modal v-model:modelValue="showRegisterModal" title="用户注册">
      <div class="p-0">
        <form @submit.prevent="handleRegister">
          <div class="mb-4 px-6 pt-6">
            <label for="regUsername" class="block text-sm font-medium mb-1"
              >用户名</label
            >
            <input
              type="text"
              id="regUsername"
              v-model="registerForm.username"
              class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入用户名"
              required
              autofocus
            />
          </div>
          <div class="mb-4 px-6">
            <label for="regEmail" class="block text-sm font-medium mb-1"
              >邮箱</label
            >
            <input
              type="email"
              id="regEmail"
              v-model="registerForm.email"
              class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入邮箱"
              required
            />
          </div>
          <div class="mb-4 px-6">
            <label for="regPassword" class="block text-sm font-medium mb-1"
              >密码</label
            >
            <input
              type="password"
              id="regPassword"
              v-model="registerForm.password"
              class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入密码"
              required
              minlength="6"
            />
          </div>
          <div class="mb-6 px-6">
            <label
              for="regConfirmPassword"
              class="block text-sm font-medium mb-1"
              >确认密码</label
            >
            <input
              type="password"
              id="regConfirmPassword"
              v-model="registerForm.confirmPassword"
              class="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请再次输入密码"
              required
              minlength="6"
            />
          </div>
          <div
            v-if="registerForm.password !== registerForm.confirmPassword"
            class="mb-4 px-6 text-red-500 text-sm"
          >
            两次输入的密码不一致
          </div>
          <div class="mb-6 px-6">
            <button
              type="submit"
              class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              :disabled="
                registerLoading ||
                registerForm.password !== registerForm.confirmPassword
              "
            >
              <span v-if="registerLoading">注册中...</span>
              <span v-else>注册</span>
            </button>
          </div>
          <div class="px-6 pb-6 text-center">
            <p class="text-sm text-muted-foreground">
              已有账号？
              <button
                type="button"
                @click="toggleModal('login')"
                class="text-primary hover:underline"
              >
                立即登录
              </button>
            </p>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import Modal from "@/components/Modal.vue";
import { login as apiLogin, register as apiRegister } from "@/api/auth";
import { message } from "@/utils/alertUtils";
import { useRoute } from "vue-router";

const showMobileMenu = ref(false);
const currentYear = computed(() => new Date().getFullYear());
const userStore = useUserStore();

// 路由对象
const route = useRoute();

// 登录注册弹窗状态
const showLoginModal = ref(false);
const showRegisterModal = ref(false);

// 监听路由查询参数，自动打开弹窗
watch(
  () => route.query.modal,
  (modal) => {
    if (modal === "login") {
      showLoginModal.value = true;
      showRegisterModal.value = false;
    } else if (modal === "register") {
      showRegisterModal.value = true;
      showLoginModal.value = false;
    }
  },
  { immediate: true }
);

// 登录表单
const loginForm = ref({
  username: "",
  password: "",
});

// 注册表单
const registerForm = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// 加载状态
const loginLoading = ref(false);
const registerLoading = ref(false);

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

// 切换登录注册弹窗
const toggleModal = (type: "login" | "register") => {
  if (type === "login") {
    showRegisterModal.value = false;
    setTimeout(() => {
      showLoginModal.value = true;
    }, 100);
  } else {
    showLoginModal.value = false;
    setTimeout(() => {
      showRegisterModal.value = true;
    }, 100);
  }
};

// 处理登录
const handleLogin = async () => {
  loginLoading.value = true;
  try {
    await userStore.userLogin(
      loginForm.value.username,
      loginForm.value.password
    );
    showLoginModal.value = false;
    loginForm.value = { username: "", password: "" };
    message.success("登录成功");
  } catch (error: any) {
    console.error("登录失败:", error);
    message.error(
      error.response?.data?.message || "登录失败，请检查用户名和密码"
    );
  } finally {
    loginLoading.value = false;
  }
};

// 处理注册
const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    return;
  }

  registerLoading.value = true;
  try {
    await apiRegister(registerForm.value);
    showRegisterModal.value = false;
    registerForm.value = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    message.success("注册成功，请登录");
    setTimeout(() => {
      showLoginModal.value = true;
    }, 1000);
  } catch (error: any) {
    console.error("注册失败:", error);
    message.error(error.response?.data?.message || "注册失败，请检查输入信息");
  } finally {
    registerLoading.value = false;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest("nav")) {
    showMobileMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  // 检查登录状态
  if (userStore.token) {
    userStore.fetchUserInfo();
  }
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
