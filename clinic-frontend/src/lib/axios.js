

// import axios from 'axios'

// // Read the API base URL from your Vite env (set in .env.local or Render)
// const API = import.meta.env.VITE_API_URL || ''

// const api = axios.create({
//   baseURL: `${API}/api`,    // now resolves to `${API}/api/...`
//   withCredentials: true,     // if you’re using cookies/sessions
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Attach token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   config.headers = config.headers || {}
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export default api


// src/lib/axios.js
import axios from 'axios'

// Read your VITE_API_URL and detect dev vs. prod
const API_URL = import.meta.env.VITE_API_URL || ''
const isDev   = import.meta.env.DEV

// Compute baseURL:
//  - in dev → use Vite’s proxy at "/api"
//  - in prod → point at your Render-hosted backend + "/api"
const baseURL = isDev
  ? '/api'
  : `${API_URL.replace(/\/$/, '')}/api`

// Debug logs to confirm what you’ll actually hit
console.log('📡 VITE_API_URL →', API_URL)
console.log('🔗 axios baseURL →', baseURL)

// Create the axios instance
const api = axios.create({
  baseURL,
  withCredentials: true,       // send cookies if you’re using sessions
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
