import api from './api';

export interface HeroSlideOverride {
  image?: string;
  headline?: string;
  description?: string;
}

export type HeroSlideField = 'image' | 'headline' | 'description';

export const heroSlideService = {
  /** Map of slide key -> whichever fields (image/headline/description) an admin has overridden. */
  getAll() {
    return api
      .get<{ success: boolean; slides: Record<string, HeroSlideOverride> }>('/hero-slides')
      .then((r) => r.data.slides);
  },
  /** Updates only the fields passed - e.g. { description } leaves an existing image override untouched. */
  update(key: string, fields: HeroSlideOverride) {
    return api
      .put<{ success: boolean; slide: { key: string } & HeroSlideOverride }>(`/hero-slides/${key}`, fields)
      .then((r) => r.data.slide);
  },
  /** Reverts a single field back to the site default. */
  remove(key: string, field: HeroSlideField) {
    return api.delete(`/hero-slides/${key}/${field}`).then((r) => r.data);
  },
};
