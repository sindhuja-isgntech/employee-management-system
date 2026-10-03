// src/api/axiosInstance.ts
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});



// Request Interceptor (Attach Auth tokens, log requests in dev)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
  
);

// Response Interceptor (Global Error Handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url !== '/api/auth/login') {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_roles');
      localStorage.removeItem('user_profile');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Extract a server-provided error message, falling back to a default
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export default API;