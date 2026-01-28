import axios from 'axios';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://multipothtech.ddns.net/api/maintenance_ops/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the access token to the headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      removeCookie('access_token');
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  setCookie('access_token', token, { expires: 30, path: '/' });
};

export const clearAuthToken = () => {
  removeCookie('access_token', { path: '/' });
};
