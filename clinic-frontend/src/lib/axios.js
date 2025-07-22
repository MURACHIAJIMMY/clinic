

import axios from 'axios'

// Read the API base URL from your Vite env (set in .env.local or Render)
const API = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: `${API}/api`,    // now resolves to `${API}/api/...`
  withCredentials: true,     // if you’re using cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  config.headers = config.headers || {}
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
