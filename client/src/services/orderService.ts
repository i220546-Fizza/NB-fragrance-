import api from './api';
import type { Order, OrderItem, OrderStatus } from '../types';

export interface CreateOrderPayload {
  orderItems: OrderItem[];
  customerInfo: { fullName: string; email: string; phone: string };
  shippingAddress: { address: string; city: string; postalCode: string };
  notes?: string;
  paymentMethod: 'Cash on Delivery';
}

export const orderService = {
  create(payload: CreateOrderPayload) {
    return api.post<{ success: boolean; order: Order }>('/orders', payload).then((r) => r.data.order);
  },
  myOrders() {
    return api.get<{ success: boolean; orders: Order[] }>('/orders/my-orders').then((r) => r.data.orders);
  },
  getOne(id: string) {
    return api.get<{ success: boolean; order: Order }>(`/orders/${id}`).then((r) => r.data.order);
  },
  // Admin
  list(query: { status?: string; search?: string } = {}) {
    return api
      .get<{ success: boolean; orders: Order[] }>('/orders', { params: query })
      .then((r) => r.data.orders);
  },
  updateStatus(id: string, status: OrderStatus) {
    return api
      .put<{ success: boolean; order: Order }>(`/orders/${id}/status`, { status })
      .then((r) => r.data.order);
  },
};
