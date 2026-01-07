import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  // 创建 axios 实例，使用相对路径，这样会被 nitro 代理处理
  const axiosInstance = axios.create({
    baseURL: "/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  // 请求拦截器
  axiosInstance.interceptors.request.use(
    (config) => {
      // 只有在客户端环境下才能访问 localStorage 和 Pinia
      if (process.client) {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  axiosInstance.interceptors.response.use(
    (response) => {
      const res = response.data;
      if (res.code !== undefined && res.code !== 200) {
        // Token过期或无效
        if (res.code === 401 && process.client) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(new Error(res.message || "请求失败"));
      }
      return res.data || res;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 将 axios 实例注入到 Nuxt 上下文中
  nuxtApp.provide("axios", axiosInstance);
});
