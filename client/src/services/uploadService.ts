import api from './api';

export const uploadService = {
  uploadImages(files: File[]) {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    return api
      .post<{ paths: string[] }>('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.paths);
  },
};
