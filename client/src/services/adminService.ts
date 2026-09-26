import api from './api';
import type { AdminStats } from '../types';

export const adminService = {
  getStats() {
    return api.get<AdminStats>('/admin/stats').then((r) => r.data);
  },
};
