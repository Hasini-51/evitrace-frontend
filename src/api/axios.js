import axios from 'axios'

/**
 * Axios instance pre-configured for EviTrace API.
 * - Base URL proxied via Vite to http://localhost:8080
 * - Automatically injects the Bearer JWT from localStorage
 * - On 401, clears the token and redirects to login
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ─── Request interceptor: inject JWT ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('evitrace_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor: handle 401 ──────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('evitrace_token')
      localStorage.removeItem('evitrace_user')
      // Redirect to login without using React Router (interceptor is outside React tree)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
