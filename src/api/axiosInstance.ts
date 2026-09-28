// src/api/axiosInstance.ts
import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

// Public mock API fallback for development (e.g., JSONPlaceholder)
const MOCK_API_URL = 'https://jsonplaceholder.typicode.com';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || MOCK_API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor (Attach Auth tokens, log requests in dev)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Global Error Handling)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with non-2xx status code
      console.error(`API Error [${error.response.status}]:`, error.response.data);
      if (error.response.status === 401) {
        // Handle unauthenticated state
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error: No response received from server.');
    } else {
      console.error('Axios Request Error:', error.message);
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

export default axiosInstance;