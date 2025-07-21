// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


// // Add an interceptor to include the token in every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   config.headers = config.headers || {};
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

// src/lib/axios.js

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
