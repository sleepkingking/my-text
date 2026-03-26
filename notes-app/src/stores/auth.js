import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')
  const isLoggedIn = ref(!!token.value)

  async function register(username, password) {
    const res = await userApi.register({ username, password })
    return res.data
  }

  async function login(username, password) {
    const res = await userApi.login({ username, password })
    token.value = res.data.token
    user.value = res.data.user
    isLoggedIn.value = true
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }

  function logout() {
    token.value = ''
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { user, token, isLoggedIn, register, login, logout }
})
