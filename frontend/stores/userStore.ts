import { defineStore } from "pinia";
import { ref, watch, onMounted, computed } from "vue";
import type { User } from "@/types/user";
import { useApi } from "~/composables/useApi";

export const useUserStore = defineStore("user", () => {
  // 核心状态
  const token = ref<string | null>(null);
  const user = ref<User | null>(null);

  // 标记是否已经完成初始化
  const isInitialized = ref<boolean>(false);

  // 从localStorage恢复状态
  const restoreFromStorage = () => {
    if (process.client) {
      console.log("从localStorage恢复状态...");

      // 直接读取localStorage，不使用process.client检查，因为这个函数只在客户端调用
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      console.log("从localStorage读取到token:", storedToken);
      console.log("从localStorage读取到user:", storedUser);

      if (storedToken) {
        token.value = storedToken;
        console.log("恢复token成功:", token.value);
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          user.value = parsedUser;
          console.log("恢复用户信息成功:", parsedUser);
        } catch (error) {
          console.error("解析用户信息失败:", error);
          localStorage.removeItem("user");
        }
      }

      console.log("恢复状态完成");
    }
  };

  // 计算属性，基于token值自动计算登录状态
  const isLoggedIn = computed(() => {
    const result = !!token.value;
    console.log("计算isLoggedIn:", result, "token:", token.value);
    return result;
  });

  // 保存状态到localStorage
  const saveToStorage = () => {
    if (process.client) {
      console.log("保存状态到localStorage...");
      console.log("当前token:", token.value);
      console.log("当前用户:", user.value);

      // 只有当token有值时才保存，避免保存空值
      if (token.value) {
        localStorage.setItem("token", token.value);
        console.log("保存token成功");
      } else {
        localStorage.removeItem("token");
        console.log("删除token");
      }

      // 只有当user有值时才保存，避免保存空值
      if (user.value) {
        localStorage.setItem("user", JSON.stringify(user.value));
        console.log("保存用户信息成功");
      } else {
        localStorage.removeItem("user");
        console.log("删除用户信息");
      }

      console.log("保存完成");
    }
  };

  // 登录
  const userLogin = async (username: string, password: string) => {
    try {
      console.log("执行登录...");
      // 使用useApi组合式函数获取API实例
      const { login } = useApi();
      const response = await login({ username, password });
      console.log("登录成功，响应:", response);
      token.value = response.token;
      // 添加类型断言，处理缺少createdAt和updatedAt字段的情况
      user.value = response.user as User;
      // 手动保存，避免watch触发问题
      saveToStorage();
      return response;
    } catch (error) {
      console.error("登录失败:", error);
      throw error;
    }
  };

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return;

    try {
      console.log("获取用户信息...");
      // 使用useApi组合式函数获取API实例
      const { getUserInfo } = useApi();
      const response = await getUserInfo();
      console.log("获取用户信息成功:", response);
      user.value = response;
      // 手动保存，避免watch触发问题
      saveToStorage();
      return response;
    } catch (error) {
      console.error("获取用户信息失败:", error);
      // Token可能已过期，清除登录状态
      userLogout();
      throw error;
    }
  };

  // 登出
  const userLogout = async () => {
    try {
      console.log("执行登出...");
      if (token.value) {
        // 使用useApi组合式函数获取API实例
        const { logout } = useApi();
        await logout();
      }
    } catch (error) {
      console.error("登出失败:", error);
    } finally {
      console.log("清除登录状态");
      token.value = null;
      user.value = null;
      // 手动保存，避免watch触发问题
      saveToStorage();
    }
  };

  // 初始化时自动刷新用户信息
  const initUserInfo = async () => {
    // 先从localStorage恢复状态
    restoreFromStorage();

    if (token.value && (!user.value || !user.value.id)) {
      try {
        console.log("初始化用户信息...");
        await fetchUserInfo();
      } catch (error) {
        console.error("初始化用户信息失败:", error);
        // 如果获取用户信息失败，清除登录状态
        userLogout();
      }
    }
    // 标记初始化完成
    isInitialized.value = true;
  };

  // 监听状态变化，自动保存到localStorage
  // 只有在初始化完成后才开始监听，避免SSR hydration导致的不必要保存
  onMounted(() => {
    // 初始化完成后开始监听
    isInitialized.value = true;

    watch(
      [token, user],
      (newValues) => {
        if (isInitialized.value) {
          console.log("状态变化，触发saveToStorage");
          saveToStorage();
        }
      },
      { deep: true }
    );
  });

  // 立即从localStorage恢复状态（确保在SSR后客户端立即恢复状态）
  if (process.client) {
    restoreFromStorage();
  }

  return {
    token,
    user,
    isLoggedIn,
    userLogin,
    fetchUserInfo,
    userLogout,
    initUserInfo,
  };
});
