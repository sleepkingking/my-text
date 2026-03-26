<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>📝 登录</h1>
      <p class="subtitle">欢迎回来，继续记笔记吧</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="username" type="text" placeholder="输入用户名" required />
        </div>

        <div class="form-group">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="输入密码" required />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <p class="switch-link">还没账号？<router-link to="/register">去注册</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0f2f5; }
.auth-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
.auth-card h1 { margin: 0 0 8px; font-size: 28px; }
.subtitle { color: #888; margin: 0 0 24px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: #333; }
.form-group input { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; outline: none; box-sizing: border-box; }
.form-group input:focus { border-color: #4a90d9; }
.error { color: #e74c3c; font-size: 14px; margin: 8px 0; }
button { width: 100%; padding: 12px; background: #4a90d9; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 8px; }
button:hover { background: #357abd; }
button:disabled { background: #a0c4e8; cursor: not-allowed; }
.switch-link { text-align: center; margin-top: 16px; color: #888; }
.switch-link a { color: #4a90d9; text-decoration: none; }
</style>
