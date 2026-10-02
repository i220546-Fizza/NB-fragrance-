import api from './api';

export const heroSlideService = {
  /** Map of slide key -> admin-uploaded image path, for whichever slides have one. */
  getAll() {
    return api
      .get<{ success: boolean; slides: Record<string, string> }>('/hero-slides')
      .then((r) => r.data.slides);
  },
  update(key: string, image: string) {
    return api
      .put<{ success: boolean; slide: { key: string; image: string } }>(`/hero-slides/${key}`, { image })
      .then((r) => r.data.slide);
  },
  remove(key: string) {
    return api.delete(`/hero-slides/${key}`).then((r) => r.data);
  },
};
