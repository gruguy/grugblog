import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { useUserStore } from "@/stores/userStore";

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.token || localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 如果返回的状态码不是200，则视为错误
    if (res.code !== undefined && res.code !== 200) {
      // Token过期或无效
      if (res.code === 401) {
        const userStore = useUserStore();
        userStore.userLogout();
        // 可以在这里跳转到登录页
        window.location.href = "/admin/login";
      }

      return Promise.reject(new Error(res.message || "请求失败"));
    }

    return response.data;
  },
  (error) => {
    console.error("响应错误:", error);

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          const userStore = useUserStore();
          userStore.userLogout();
          break;
        case 403:
          return Promise.reject(new Error("没有权限"));
        case 404:
          return Promise.reject(new Error("请求的资源不存在"));
        case 500:
          return Promise.reject(new Error("服务器内部错误"));
        default:
          return Promise.reject(new Error(data?.message || "请求失败"));
      }
    }

    return Promise.reject(error);
  }
);

export default service;
