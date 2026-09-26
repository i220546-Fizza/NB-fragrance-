import axios, { AxiosError } from 'axios';

export const TOKEN_KEY = 'nb_token';
export const USER_KEY = 'nb_user';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Listeners so AuthContext can react to a forced logout without a circular import.
type UnauthorizedListener = () => void;
const unauthorizedListeners: UnauthorizedListener[] = [];
export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListeners.push(listener);
}

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      unauthorizedListeners.forEach((l) => l());
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.message === 'Network Error') return 'Unable to reach the server. Please check your connection.';
    if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  }
  return fallback;
}

export default api;
