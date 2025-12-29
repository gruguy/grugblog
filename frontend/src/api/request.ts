import axios, { type AxiosInstance, type AxiosResponse } from "axios";

// 扩展AxiosInstance类型，使响应拦截器返回T而不是AxiosResponse<T>
declare module "axios" {
  interface AxiosInstance {
    request<T = any>(config: import("axios").AxiosRequestConfig): Promise<T>;
    get<T = any>(
      url: string,
      config?: import("axios").AxiosRequestConfig
    ): Promise<T>;
    delete<T = any>(
      url: string,
      config?: import("axios").AxiosRequestConfig
    ): Promise<T>;
    head<T = any>(
      url: string,
      config?: import("axios").AxiosRequestConfig
    ): Promise<T>;
    options<T = any>(
      url: string,
      config?: import("axios").AxiosRequestConfig
    ): Promise<T>;
    post<T = any>(
      url: string,
      data?: any,
      config?: import("axios").AxiosRequestConfig
    ): Promise<T>;
    put<T = any>(
      url: string,
      data?: any,
      config?: import("axios").AxiosRequestConfig
    ): Promise<T>;
    patch<T = any>(
      url: string,
      data?: any,
      config?: import("axios").AxiosRequestConfig
    ): Promise<T>;
  }
}
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
    console.log("请求URL:", config.url);
    console.log("请求数据:", config.data);
    console.log("请求头:", config.headers);

    // 登录和注册请求不应该添加token
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register")
    ) {
      return config;
    }

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
    console.log("响应URL:", response.config.url);
    console.log("响应状态码:", response.status);
    console.log("响应数据:", response.data);

    const res = response.data;

    // 如果返回的是标准格式 { code, message, data }
    if (res.code !== undefined) {
      // 如果状态码不是200，则视为错误
      if (res.code !== 200) {
        // Token过期或无效
        if (res.code === 401) {
          const userStore = useUserStore();
          userStore.userLogout();
          // 可以在这里跳转到登录页
          window.location.href = "/admin/login";
        }

        return Promise.reject(new Error(res.message || "请求失败"));
      }

      // 直接返回data字段的内容，方便前端组件使用
      return res.data;
    }

    // 如果返回的不是标准格式，则直接返回响应数据
    return res;
  },
  (error) => {
    console.error("响应错误:", error);
    console.error("错误响应数据:", error.response?.data);
    console.error("错误状态码:", error.response?.status);
    console.error("错误配置:", error.config);

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
