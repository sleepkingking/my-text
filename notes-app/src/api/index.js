import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const userApi = {
  register(data) { return api.post('/register', data) },
  login(data) { return api.post('/login', data) },
}

export const notesApi = {
  getAll() { return api.get('/notes') },
  getOne(id) { return api.get(`/notes/${id}`) },
  create(data) { return api.post('/notes', data) },
  update(id, data) { return api.put(`/notes/${id}`, data) },
  remove(id) { return api.delete(`/notes/${id}`) },
}

export default api
