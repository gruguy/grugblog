import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'
import { login, getUserInfo, logout } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const isLoggedIn = ref<boolean>(!!token.value)

  const userLogin = async (username: string, password: string) => {
    try {
      const response = await login({ username, password })
      token.value = response.token
      user.value = response.user
      isLoggedIn.value = true
      localStorage.setItem('token', response.token)
      return response
    } catch (error) {
      throw error
    }
  }

  const fetchUserInfo = async () => {
    if (!token.value) return
    
    try {
      const response = await getUserInfo()
      user.value = response
      return response
    } catch (error) {
      userLogout()
      throw error
    }
  }

  const userLogout = async () => {
    try {
      if (token.value) {
        await logout()
      }
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      token.value = null
      user.value = null
      isLoggedIn.value = false
      localStorage.removeItem('token')
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    userLogin,
    fetchUserInfo,
    userLogout,
  }
})

