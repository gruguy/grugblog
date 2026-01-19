import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import type { User } from "@/types/user";
import { login, getUserInfo, logout } from "@/api/auth";

export const useUserStore = defineStore("user", () => {
  // 在 SSR 环境下，localStorage 不可用，所以初始化为 null
  const token = ref<string | null>(
    process.client ? localStorage.getItem("token") : null
  );
  const user = ref<User | null>(null);
  const isLoggedIn = ref<boolean>(!!token.value);

  // 登录
  const userLogin = async (username: string, password: string) => {
    try {
      const response = await login({ username, password });
      token.value = response.token;
      // 添加类型断言，处理缺少createdAt和updatedAt字段的情况
      user.value = response.user as User;
      isLoggedIn.value = true;
      // 只有在客户端环境下才能访问localStorage
      if (process.client) {
        localStorage.setItem("token", response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return;

    try {
      const response = await getUserInfo();
      user.value = response;
      return response;
    } catch (error) {
      // Token可能已过期，清除登录状态
      userLogout();
      throw error;
    }
  };

  // 登出
  const userLogout = async () => {
    try {
      if (token.value) {
        await logout();
      }
    } catch (error) {
      console.error("登出失败:", error);
    } finally {
      token.value = null;
      user.value = null;
      isLoggedIn.value = false;
      // 只有在客户端环境下才能访问localStorage
      if (process.client) {
        localStorage.removeItem("token");
      }
    }
  };

  // 在客户端挂载时检查localStorage中的token
  onMounted(() => {
    if (process.client) {
      const storedToken = localStorage.getItem("token");
      if (storedToken && !token.value) {
        token.value = storedToken;
        isLoggedIn.value = true;
        fetchUserInfo();
      } else if (token.value) {
        fetchUserInfo();
      }
    }
  });

  return {
    token,
    user,
    isLoggedIn,
    userLogin,
    fetchUserInfo,
    userLogout,
  };
});
