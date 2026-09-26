import api from './api';
import type { Product, User } from '../types';

export const userService = {
  getProfile() {
    return api.get<{ success: boolean; user: User }>('/users/profile').then((r) => r.data.user);
  },
  updateProfile(payload: Partial<User> & { password?: string }) {
    return api.put<{ success: boolean; user: User }>('/users/profile', payload).then((r) => r.data.user);
  },
  getWishlist() {
    return api.get<{ success: boolean; wishlist: Product[] }>('/users/wishlist').then((r) => r.data.wishlist);
  },
  addToWishlist(productId: string) {
    return api
      .post<{ success: boolean; wishlist: Product[] }>(`/users/wishlist/${productId}`)
      .then((r) => r.data.wishlist);
  },
  removeFromWishlist(productId: string) {
    return api
      .delete<{ success: boolean; wishlist: Product[] }>(`/users/wishlist/${productId}`)
      .then((r) => r.data.wishlist);
  },
};
