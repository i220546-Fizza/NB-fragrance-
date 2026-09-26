import api from './api';
import type { PaginatedProducts, Product } from '../types';

export interface ProductQuery {
  search?: string;
  gender?: string;
  fragranceFamily?: string;
  category?: string;
  collectionName?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

function cleanParams(params: object) {
  const out: Record<string, string> = {};
  Object.entries(params as Record<string, unknown>).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) return;
    out[k] = Array.isArray(v) ? v.join(',') : String(v);
  });
  return out;
}

export const productService = {
  list(query: ProductQuery = {}) {
    return api
      .get<PaginatedProducts>('/products', { params: cleanParams(query) })
      .then((r) => r.data);
  },
  discovery(families: string[]) {
    return api
      .get<{ products: Product[] } | Product[]>('/products/discovery', {
        params: cleanParams({ families }),
      })
      .then((r) => (Array.isArray(r.data) ? r.data : r.data.products));
  },
  getOne(idOrSlug: string) {
    return api.get<{ success: boolean; product: Product }>(`/products/${idOrSlug}`).then((r) => r.data.product);
  },
  related(id: string) {
    return api.get<{ success: boolean; products: Product[] }>(`/products/${id}/related`).then((r) => r.data.products);
  },
  addReview(id: string, payload: { rating: number; comment: string }) {
    return api.post(`/products/${id}/reviews`, payload).then((r) => r.data);
  },
  // Admin
  create(payload: Partial<Product>) {
    return api.post<{ success: boolean; product: Product }>('/products', payload).then((r) => r.data.product);
  },
  update(id: string, payload: Partial<Product>) {
    return api.put<{ success: boolean; product: Product }>(`/products/${id}`, payload).then((r) => r.data.product);
  },
  remove(id: string) {
    return api.delete(`/products/${id}`).then((r) => r.data);
  },
};
