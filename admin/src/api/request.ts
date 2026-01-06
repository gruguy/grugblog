import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/userStore";
import router from "@/router";

const service: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    console.log("请求配置:", config);
    const userStore = useUserStore();
    const token = userStore.token || localStorage.getItem("token");
    console.log("当前Token:", token);

    // 登录请求不添加Authorization头
    if (token && config.headers && !config.url?.includes("/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("添加Authorization头:", config.headers.Authorization);
    }

    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 处理统一格式的响应
    if (res.code !== undefined) {
      if (res.code !== 200) {
        if (res.code === 401) {
          const userStore = useUserStore();
          userStore.userLogout();
          router.push("/login");
        }

        ElMessage.error(res.message || "请求失败");
        return Promise.reject(new Error(res.message || "请求失败"));
      }

      // 直接返回data字段的内容，方便前端组件使用
      return res.data;
    }

    // 兼容旧版API（如果有的话），但现在所有API都应该返回统一格式
    return res;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 登录请求特殊处理，保留原始错误信息
      if (error.config?.url?.includes("/auth/login")) {
        // 为登录错误添加更友好的错误信息
        const errorMessage = data?.message || "登录失败，请检查用户名和密码";
        const loginError = new Error(errorMessage);
        // 将原始响应数据附加到错误对象上，方便前端使用
        Object.assign(loginError, {
          response: error.response,
          status,
          data,
        });
        return Promise.reject(loginError);
      }

      switch (status) {
        case 401:
          const userStore = useUserStore();
          userStore.userLogout();
          router.push("/login");
          break;
        case 403:
          ElMessage.error("没有权限");
          break;
        case 404:
          ElMessage.error("请求的资源不存在");
          break;
        case 500:
          ElMessage.error("服务器内部错误");
          break;
        default:
          ElMessage.error(data?.message || "请求失败");
      }
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }

    return Promise.reject(error);
  }
);

export default service;
