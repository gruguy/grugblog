import request from './request'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  email: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    avatar: string
  }
}

// 登录
export const login = (params: LoginParams) => {
  return request.post<LoginResponse>('/auth/login', params)
}

// 注册
export const register = (params: RegisterParams) => {
  return request.post<LoginResponse>('/auth/register', params)
}

// 获取用户信息
export const getUserInfo = () => {
  return request.get('/auth/user')
}

// 登出
export const logout = () => {
  return request.post('/auth/logout')
}

