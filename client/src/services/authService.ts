import api from './api';
import type { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  register(payload: { name: string; email: string; password: string }) {
    return api.post<AuthResponse>('/auth/register', payload).then((r) => r.data);
  },
  login(payload: { email: string; password: string }) {
    return api.post<AuthResponse>('/auth/login', payload).then((r) => r.data);
  },
  me() {
    return api.get<{ success: boolean; user: User }>('/auth/me').then((r) => r.data.user);
  },
  forgotPassword(email: string) {
    return api
      .put<{ message: string; resetToken?: string; resetUrl?: string }>('/auth/forgot-password', { email })
      .then((r) => r.data);
  },
  resetPassword(token: string, password: string) {
    return api.put<{ message: string }>(`/auth/reset-password/${token}`, { password }).then((r) => r.data);
  },
};
