import request from './request'

export interface LoginParams {
  username: string
  password: string
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

export const login = (params: LoginParams) => {
  return request.post<LoginResponse>('/auth/login', params)
}

export const getUserInfo = () => {
  return request.get('/auth/user')
}

export const logout = () => {
  return request.post('/auth/logout')
}

