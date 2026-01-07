import request from "./request";
import type { User } from "@/types/user";

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    avatar: string;
  };
}

// 登录
export const login = (params: LoginParams) => {
  return request.post<LoginResponse>(
    "/auth/login",
    params
  ) as Promise<LoginResponse>;
};

// 注册
export const register = (params: RegisterParams) => {
  return request.post<LoginResponse>(
    "/auth/register",
    params
  ) as Promise<LoginResponse>;
};

// 获取用户信息
export const getUserInfo = () => {
  return request.get<User>("/auth/user") as Promise<User>;
};

// 登出
export const logout = () => {
  return request.post("/auth/logout");
};
