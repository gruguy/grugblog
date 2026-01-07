import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const service$1 = axios.create({
  baseURL: "/api",
  timeout: 1e4,
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});
service$1.interceptors.request.use(
  (config) => {
    var _a, _b;
    console.log("\u8BF7\u6C42URL:", config.url);
    console.log("\u8BF7\u6C42\u6570\u636E:", config.data);
    console.log("\u8BF7\u6C42\u5934:", config.headers);
    if (((_a = config.url) == null ? void 0 : _a.includes("/auth/login")) || ((_b = config.url) == null ? void 0 : _b.includes("/auth/register"))) {
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
    console.error("\u8BF7\u6C42\u9519\u8BEF:", error);
    return Promise.reject(error);
  }
);
service$1.interceptors.response.use(
  (response) => {
    console.log("\u54CD\u5E94URL:", response.config.url);
    console.log("\u54CD\u5E94\u72B6\u6001\u7801:", response.status);
    console.log("\u54CD\u5E94\u6570\u636E:", response.data);
    const res = response.data;
    if (res.code !== void 0) {
      if (res.code !== 200) {
        if (res.code === 401) {
          const userStore = useUserStore();
          userStore.userLogout();
          window.location.href = "/admin/login";
        }
        return Promise.reject(new Error(res.message || "\u8BF7\u6C42\u5931\u8D25"));
      }
      return res.data;
    }
    return res;
  },
  (error) => {
    var _a, _b;
    console.error("\u54CD\u5E94\u9519\u8BEF:", error);
    console.error("\u9519\u8BEF\u54CD\u5E94\u6570\u636E:", (_a = error.response) == null ? void 0 : _a.data);
    console.error("\u9519\u8BEF\u72B6\u6001\u7801:", (_b = error.response) == null ? void 0 : _b.status);
    console.error("\u9519\u8BEF\u914D\u7F6E:", error.config);
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          break;
        case 403:
          return Promise.reject(new Error("\u6CA1\u6709\u6743\u9650"));
        case 404:
          return Promise.reject(new Error("\u8BF7\u6C42\u7684\u8D44\u6E90\u4E0D\u5B58\u5728"));
        case 500:
          return Promise.reject(new Error("\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"));
        default:
          return Promise.reject(new Error((data == null ? void 0 : data.message) || "\u8BF7\u6C42\u5931\u8D25"));
      }
    }
    return Promise.reject(error);
  }
);

const login = (params) => {
  return service$1.post(
    "/auth/login",
    params
  );
};
const getUserInfo = () => {
  return service$1.get("/auth/user");
};
const logout = () => {
  return service$1.post("/auth/logout");
};

const useUserStore = defineStore("user", () => {
  const token = ref(null);
  const user = ref(null);
  const isLoggedIn = ref(!!token.value);
  const userLogin = async (username, password) => {
    try {
      const response = await login({ username, password });
      token.value = response.token;
      user.value = response.user;
      isLoggedIn.value = true;
      if (false) ;
      return response;
    } catch (error) {
      throw error;
    }
  };
  const fetchUserInfo = async () => {
    if (!token.value) return;
    try {
      const response = await getUserInfo();
      user.value = response;
      return response;
    } catch (error) {
      userLogout();
      throw error;
    }
  };
  const userLogout = async () => {
    try {
      if (token.value) {
        await logout();
      }
    } catch (error) {
      console.error("\u767B\u51FA\u5931\u8D25:", error);
    } finally {
      token.value = null;
      user.value = null;
      isLoggedIn.value = false;
      localStorage.removeItem("token");
    }
  };
  return {
    token,
    user,
    isLoggedIn,
    userLogin,
    fetchUserInfo,
    userLogout
  };
});

const service = axios.create({
  baseURL: "/api",
  timeout: 1e4,
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});
service.interceptors.request.use(
  (config) => {
    var _a, _b;
    console.log("\u8BF7\u6C42URL:", config.url);
    console.log("\u8BF7\u6C42\u6570\u636E:", config.data);
    console.log("\u8BF7\u6C42\u5934:", config.headers);
    if (((_a = config.url) == null ? void 0 : _a.includes("/auth/login")) || ((_b = config.url) == null ? void 0 : _b.includes("/auth/register"))) {
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
    console.error("\u8BF7\u6C42\u9519\u8BEF:", error);
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    console.log("\u54CD\u5E94URL:", response.config.url);
    console.log("\u54CD\u5E94\u72B6\u6001\u7801:", response.status);
    console.log("\u54CD\u5E94\u6570\u636E:", response.data);
    const res = response.data;
    if (res.code !== void 0) {
      if (res.code !== 200) {
        if (res.code === 401) {
          const userStore = useUserStore();
          userStore.userLogout();
          window.location.href = "/admin/login";
        }
        return Promise.reject(new Error(res.message || "\u8BF7\u6C42\u5931\u8D25"));
      }
      return res.data;
    }
    return res;
  },
  (error) => {
    var _a, _b;
    console.error("\u54CD\u5E94\u9519\u8BEF:", error);
    console.error("\u9519\u8BEF\u54CD\u5E94\u6570\u636E:", (_a = error.response) == null ? void 0 : _a.data);
    console.error("\u9519\u8BEF\u72B6\u6001\u7801:", (_b = error.response) == null ? void 0 : _b.status);
    console.error("\u9519\u8BEF\u914D\u7F6E:", error.config);
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          break;
        case 403:
          return Promise.reject(new Error("\u6CA1\u6709\u6743\u9650"));
        case 404:
          return Promise.reject(new Error("\u8BF7\u6C42\u7684\u8D44\u6E90\u4E0D\u5B58\u5728"));
        case 500:
          return Promise.reject(new Error("\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"));
        default:
          return Promise.reject(new Error((data == null ? void 0 : data.message) || "\u8BF7\u6C42\u5931\u8D25"));
      }
    }
    return Promise.reject(error);
  }
);

export { service as default };
//# sourceMappingURL=request.mjs.map
